from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import db
import models
import schemas
import auth

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

SessionLocal = db.SessionLocal
engine = db.engine
Base = db.Base

# Load environment variables
load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ramya News API")

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - Get allowed origins from environment variable
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# create default admin if missing
def init_default_admin():
    db = SessionLocal()
    try:
        default_username = os.getenv("DEFAULT_ADMIN_USERNAME", "admin123")
        default_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "rawad123")

        admin = db.query(models.Admin).filter(models.Admin.username == default_username).first()
        if not admin:
            password_hash = auth.get_password_hash(default_password)
            admin = models.Admin(username=default_username, password_hash=password_hash)
            db.add(admin)
            db.commit()
    finally:
        db.close()

init_default_admin()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/login", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(request: Request, data: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.Admin).filter(models.Admin.username == data.username).first()
    if not user or not auth.verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/news", response_model=List[schemas.NewsOut])
def get_news(
    category: Optional[str] = None,
    breaking: Optional[int] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    # Cap limit to prevent abuse
    limit = min(limit, 100)

    q = db.query(models.News)
    if category:
        q = q.filter(models.News.category == category)
    if breaking is not None:
        q = q.filter(models.News.breaking == bool(int(breaking)))
    items = q.order_by(models.News.date.desc()).offset(offset).limit(limit).all()
    return items

@app.post("/api/news", response_model=schemas.NewsOut)
def create_news(item: schemas.NewsCreate, username: str = Depends(auth.get_current_username), db: Session = Depends(get_db)):
    # ensure only existing admin name can post (username validated from token)
    user = db.query(models.Admin).filter(models.Admin.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    news = models.News(
        title=item.title,
        category=item.category,
        image=item.image,
        summary=item.summary,
        content=item.content,
        breaking=bool(item.breaking),
        date=item.date or __import__("datetime").datetime.utcnow().isoformat()
    )
    db.add(news)
    db.commit()
    db.refresh(news)
    return news
