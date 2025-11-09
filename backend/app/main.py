from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .database import init_db, get_db
from .models import News
from .schemas import NewsCreate, NewsRead, NewsUpdate, SearchResponse, SearchItem
from .embeddings import embed_text
from .vectorstore import add_news, update_news, delete_news, query_similar
from .cache import get_cached_search, set_cached_search, clear_search_cache


app = FastAPI(title="SmartNews API (Python)")


@app.on_event("startup")
def on_startup():
    init_db()


@app.post("/news/", response_model=NewsRead)
def create_news(payload: NewsCreate, db: Session = Depends(get_db)):
    news = News(
        title=payload.title,
        text=payload.text,
        author=payload.author,
        source=payload.source,
        date=payload.date,
    )
    db.add(news)
    db.commit()
    db.refresh(news)

    emb = embed_text(news.text)
    add_news(str(news.id), news.text, {
        "title": news.title,
        "author": news.author,
        "source": news.source,
        "date": news.date,
    }, emb)
    clear_search_cache()

    return NewsRead.model_validate(news)


@app.put("/news/{news_id}", response_model=NewsRead)
def update_news_item(news_id: int, payload: NewsUpdate, db: Session = Depends(get_db)):
    news = db.get(News, news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    if payload.title is not None:
        news.title = payload.title
    if payload.text is not None:
        news.text = payload.text
    if payload.author is not None:
        news.author = payload.author
    if payload.source is not None:
        news.source = payload.source
    if payload.date is not None:
        news.date = payload.date

    db.commit()
    db.refresh(news)

    emb = embed_text(news.text)
    update_news(str(news.id), news.text, {
        "title": news.title,
        "author": news.author,
        "source": news.source,
        "date": news.date,
    }, emb)

    clear_search_cache()

    return NewsRead.model_validate(news)


@app.delete("/news/{news_id}")
def delete_news_item(news_id: int, db: Session = Depends(get_db)):
    news = db.get(News, news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    db.delete(news)
    db.commit()
    delete_news(str(news_id))
    clear_search_cache()
    return {"ok": True}


@app.get("/search", response_model=SearchResponse)
def search_news(q: str, top_k: int = 5, db: Session = Depends(get_db)):
    cached = get_cached_search(q)
    if cached:
        return cached

    embedding = embed_text(q)
    results = query_similar(embedding, top_k=top_k)

    items: List[SearchItem] = []
    for r in results:
        meta = r.get("metadata", {})
        news_id = int(r["id"])
        news_obj = db.get(News, news_id)
        items.append(SearchItem(
            id=news_id,
            title=str(meta.get("title", "")),
            text=str(r.get("text", "")),
            author=meta.get("author"),
            source=meta.get("source"),
            date=news_obj.date if news_obj else None,
            score=float(r["score"]),
        ))

    resp = SearchResponse(query=q, items=items).model_dump()
    set_cached_search(q, resp)
    return resp