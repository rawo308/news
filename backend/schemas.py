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
    category: str
    image: Optional[str] = None
    summary: Optional[str] = None
    content: str
    breaking: Optional[bool] = False
    date: Optional[str] = None

class NewsOut(NewsCreate):
    id: int
    class Config:
        orm_mode = True
