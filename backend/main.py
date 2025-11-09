from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from .db import SessionLocal, engine, Base
from . import models, schemas, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ramya News API")

# CORS - during dev allow localhost: you can restrict later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create default admin if missing
def init_default_admin():
    db = SessionLocal()
    try:
        admin = db.query(models.Admin).filter(models.Admin.username == "admin123").first()
        if not admin:
            password_hash = auth.get_password_hash("rawad123")
            admin = models.Admin(username="admin123", password_hash=password_hash)
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
def login(data: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.Admin).filter(models.Admin.username == data.username).first()
    if not user or not auth.verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/news", response_model=List[schemas.NewsOut])
def get_news(category: Optional[str] = None, breaking: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.News)
    if category:
        q = q.filter(models.News.category == category)
    if breaking is not None:
        q = q.filter(models.News.breaking == bool(int(breaking)))
    items = q.order_by(models.News.date.desc()).all()
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
