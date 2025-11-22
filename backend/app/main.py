from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime

from .schemas import NewsCreate, NewsRead, NewsUpdate, SearchResponse, SearchItem
from .embeddings import embed_text
from .vectorstore import add_news, update_news, delete_news, query_similar, get_news
from .cache import get_cached_search, set_cached_search, clear_search_cache, next_news_id
from .config import CORS_ALLOW_ORIGINS


app = FastAPI(title="SmartNews API (Python)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    pass


@app.post("/news/", response_model=NewsRead)
def create_news(payload: NewsCreate):
    news_id = next_news_id()
    emb = embed_text(payload.text)
    add_news(str(news_id), payload.text, {
        "title": payload.title,
        "author": payload.author,
        "source": payload.source,
        "date": payload.date.isoformat() if payload.date else None,
    }, emb)
    clear_search_cache()

    return NewsRead(
        id=news_id,
        title=payload.title,
        text=payload.text,
        author=payload.author,
        source=payload.source,
        date=payload.date,
    )


@app.put("/news/{news_id}", response_model=NewsRead)
def update_news_item(news_id: int, payload: NewsUpdate):
    existing = get_news(str(news_id))
    if not existing:
        raise HTTPException(status_code=404, detail="News not found")

    meta = existing.get("metadata", {})
    title = payload.title if payload.title is not None else meta.get("title")
    text = payload.text if payload.text is not None else existing.get("text", "")
    author = payload.author if payload.author is not None else meta.get("author")
    source = payload.source if payload.source is not None else meta.get("source")
    date_val = payload.date if payload.date is not None else None
    if date_val is None:
        raw_date = meta.get("date")
        try:
            date_val = datetime.fromisoformat(raw_date) if raw_date else None
        except Exception:
            date_val = None

    emb = embed_text(text)
    update_news(str(news_id), text, {
        "title": title,
        "author": author,
        "source": source,
        "date": date_val.isoformat() if date_val else None,
    }, emb)

    clear_search_cache()

    return NewsRead(
        id=news_id,
        title=title or "",
        text=text,
        author=author,
        source=source,
        date=date_val,
    )


@app.get("/news/{news_id}", response_model=NewsRead)
def get_news_item(news_id: int):
    existing = get_news(str(news_id))
    if not existing:
        raise HTTPException(status_code=404, detail="News not found")
    meta = existing.get("metadata", {})
    raw_date = meta.get("date")
    try:
        parsed_date = datetime.fromisoformat(raw_date) if raw_date else None
    except Exception:
        parsed_date = None
    return NewsRead(
        id=news_id,
        title=str(meta.get("title", "")),
        text=str(existing.get("text", "")),
        author=meta.get("author"),
        source=meta.get("source"),
        date=parsed_date,
    )


@app.delete("/news/{news_id}")
def delete_news_item(news_id: int):
    existing = get_news(str(news_id))
    if not existing:
        raise HTTPException(status_code=404, detail="News not found")

    delete_news(str(news_id))
    clear_search_cache()
    return {"ok": True}


@app.get("/search", response_model=SearchResponse)
def search_news(q: str, top_k: int = 5):
    cached = get_cached_search(q)
    if cached:
        return cached

    embedding = embed_text(q)
    results = query_similar(embedding, top_k=top_k)

    items: List[SearchItem] = []
    for r in results:
        meta = r.get("metadata", {})
        news_id_raw = r.get("id")
        news_id = int(news_id_raw) if str(news_id_raw).isdigit() else news_id_raw
        items.append(SearchItem(
            id=news_id,
            title=str(meta.get("title", "")),
            text=str(r.get("text", "")),
            author=meta.get("author"),
            source=meta.get("source"),
            date=(datetime.fromisoformat(meta.get("date")) if meta.get("date") else None),
            score=float(r["score"]),
        ))

    resp = SearchResponse(query=q, items=items).model_dump()
    set_cached_search(q, resp)
    return resp
