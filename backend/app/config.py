import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smartnews.db")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

# Persistência local do Chroma (duckdb+parquet)
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "/data/chroma")

SEARCH_CACHE_TTL = int(os.getenv("SEARCH_CACHE_TTL", "300"))
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-mpnet-base-v2")

def _parse_origins(raw: str) -> list[str]:
    parts = [p.strip() for p in raw.split(",")]
    return [p for p in parts if p]

CORS_ALLOW_ORIGINS = _parse_origins(os.getenv(
    "CORS_ALLOW_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
))