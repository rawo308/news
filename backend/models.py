from sqlalchemy import Column, Integer, String, Text, Boolean
import db

Base = db.Base

class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    image = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    breaking = Column(Boolean, default=False)
    date = Column(String, nullable=False)
