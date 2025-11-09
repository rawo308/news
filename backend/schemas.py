from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginIn(BaseModel):
    username: str
    password: str

class NewsCreate(BaseModel):
    title: str
    category: Optional[str] = None
    image: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    breaking: Optional[bool] = False
    date: Optional[str] = None

class NewsOut(NewsCreate):
    id: int
    class Config:
        orm_mode = True
