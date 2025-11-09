from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class NewsBase(BaseModel):
    title: str
    text: str
    author: Optional[str] = None
    source: Optional[str] = None
    date: Optional[datetime] = None


class NewsCreate(NewsBase):
    pass


class NewsUpdate(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None
    author: Optional[str] = None
    source: Optional[str] = None
    date: Optional[datetime] = None


class NewsRead(BaseModel):
    id: int
    title: str
    text: str
    author: Optional[str] = None
    source: Optional[str] = None
    date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SearchItem(BaseModel):
    id: int
    title: str
    text: str
    author: Optional[str] = None
    source: Optional[str] = None
    date: Optional[datetime] = None
    score: float


class SearchResponse(BaseModel):
    query: str
    items: List[SearchItem]