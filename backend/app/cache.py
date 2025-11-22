import json
from typing import Optional, Any
from datetime import datetime, date
import redis
from .config import REDIS_URL, SEARCH_CACHE_TTL


_client: Optional[redis.Redis] = None


def _get_client() -> redis.Redis:
    global _client
    if _client is None:
        _client = redis.from_url(REDIS_URL, decode_responses=True)
    return _client


def make_key(query: str) -> str:
    return f"search:{query.strip().lower()}"


def get_cached_search(query: str) -> Optional[Any]:
    cli = _get_client()
    raw = cli.get(make_key(query))
    if raw:
        try:
            return json.loads(raw)
        except Exception:
            return None
    return None


def set_cached_search(query: str, data: Any, ttl: int = SEARCH_CACHE_TTL) -> None:
    cli = _get_client()
    def _json_default(o):
        if isinstance(o, (datetime, date)):
            return o.isoformat()
        return str(o)
    cli.set(make_key(query), json.dumps(data, default=_json_default), ex=ttl)


def clear_search_cache() -> int:
    cli = _get_client()
    keys = list(cli.scan_iter(match="search:*"))
    if not keys:
        return 0
    pipe = cli.pipeline()
    for k in keys:
        pipe.delete(k)
    pipe.execute()
    return len(keys)


def next_news_id() -> int:
    cli = _get_client()
    return int(cli.incr("news:id:seq"))
