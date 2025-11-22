from typing import Dict, List, Any
import os
import chromadb
from chromadb.config import Settings
from .config import CHROMA_PERSIST_DIR

_client = None
_collection = None

def _get_client() -> Any:
    global _client
    if _client is None:
        os.makedirs(CHROMA_PERSIST_DIR, exist_ok=True)
        _client = chromadb.PersistentClient(
            path=CHROMA_PERSIST_DIR,
            settings=Settings(anonymized_telemetry=False)
        )
    return _client

def _get_collection():
    global _collection
    if _collection is None:
        _collection = _get_client().get_or_create_collection(name="news_mpnet")
    return _collection


def _sanitize_metadata(metadata: Dict[str, Any]) -> Dict[str, Any]:
    clean: Dict[str, Any] = {}
    for k, v in metadata.items():
        if v is None:
            continue
        clean[k] = str(v)
    return clean


def add_news(id_str: str, text: str, metadata: Dict[str, Any], embedding: List[float]):
    col = _get_collection()
    meta = _sanitize_metadata(metadata)
    col.add(ids=[id_str], documents=[text], metadatas=[meta], embeddings=[embedding])


def update_news(id_str: str, text: str, metadata: Dict[str, Any], embedding: List[float]):
    col = _get_collection()
    try:
        meta = _sanitize_metadata(metadata)
        col.update(ids=[id_str], documents=[text], metadatas=[meta], embeddings=[embedding])
    except Exception:
        try:
            col.delete(ids=[id_str])
        except Exception:
            pass
        meta = _sanitize_metadata(metadata)
        col.add(ids=[id_str], documents=[text], metadatas=[meta], embeddings=[embedding])


def delete_news(id_str: str):
    col = _get_collection()
    try:
        col.delete(ids=[id_str])
    except Exception:
        pass


def query_similar(embedding: List[float], top_k: int = 10):
    col = _get_collection()
    res = col.query(query_embeddings=[embedding], n_results=top_k)
    items = []
    ids = res.get("ids", [[]])[0]
    dists = res.get("distances", [[]])[0]
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    for i in range(len(ids)):
        items.append({
            "id": ids[i],
            "score": float(dists[i]),
            "text": docs[i],
            "metadata": metas[i] or {},
        })
    return items


def get_news(id_str: str):
    col = _get_collection()
    try:
        res = col.get(ids=[id_str])
        ids = res.get("ids", [])
        if not ids:
            return None
        doc = (res.get("documents") or [None])[0]
        meta = (res.get("metadatas") or [{}])[0]
        return {
            "id": ids[0],
            "text": doc,
            "metadata": meta or {},
        }
    except Exception:
        return None
