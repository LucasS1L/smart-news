from sqlalchemy import Column, Integer, String, Text, DateTime, func
from .database import Base


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    text = Column(Text, nullable=False)
    author = Column(String(255), nullable=True)
    source = Column(String(255), nullable=True)
    date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())