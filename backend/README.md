# SmartNews API (Python) — Endpoints

Este documento descreve os endpoints disponíveis na API SmartNews implementada em Python com FastAPI, embeddings via `sentence-transformers` e base vetorial local com ChromaDB.

- Base URL: `http://localhost:8000`
- Formato: JSON
- Autenticação: Não requerida

## Sumário
- `POST /news/` — Criar notícia
- `PUT /news/{id}` — Atualizar notícia
- `DELETE /news/{id}` — Remover notícia
- `GET /search` — Buscar notícias por similaridade semântica

---

## POST /news/
Cria uma nova notícia, salva no banco (SQLite por padrão) e indexa o texto na base vetorial Chroma.

Body (JSON):
```json
{
  "title": "Título da notícia",
  "text": "Conteúdo da notícia",
  "author": "Autor opcional",
  "source": "Fonte opcional",
  "date": "2024-10-01T12:00:00Z"
}
```

Resposta (200):
```json
{
  "id": 1,
  "title": "Título da notícia",
  "text": "Conteúdo da notícia",
  "author": "Autor opcional",
  "source": "Fonte opcional",
  "date": "2024-10-01T12:00:00Z",
  "created_at": "2024-10-01T12:00:05Z",
  "updated_at": null
}
```

Exemplo `curl`:
```bash
curl -X POST http://localhost:8000/news/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Exemplo",
    "text": "Conteúdo de teste",
    "author": "Ana",
    "source": "Blog",
    "date": "2024-10-01T12:00:00Z"
  }'
```

---

## PUT /news/{id}
Atualiza campos da notícia (parciais) e reindexa o texto no Chroma.

Body (JSON, todos os campos opcionais):
```json
{
  "title": "Novo título",
  "text": "Texto atualizado",
  "author": "Novo autor",
  "source": "Nova fonte",
  "date": "2024-10-02T09:30:00Z"
}
```

Resposta (200): mesmo formato do `POST /news/`.

Erros:
- 404 se o `id` não existir.

Exemplo `curl`:
```bash
curl -X PUT http://localhost:8000/news/1 \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Texto atualizado"
  }'
```

---

## DELETE /news/{id}
Remove a notícia do banco e o registro correspondente na base vetorial.

Resposta (200):
```json
{ "ok": true }
```

Erros:
- 404 se o `id` não existir.

Exemplo `curl`:
```bash
curl -X DELETE http://localhost:8000/news/1
```

---

## GET /search
Busca semântica por similaridade com embeddings.

Query params:
- `q` (string, obrigatório): texto da consulta
- `top_k` (int, opcional, padrão 5): quantidade de documentos retornados

Resposta (200):
```json
{
  "query": "texto da consulta",
  "items": [
    {
      "id": 1,
      "title": "Título",
      "text": "Conteúdo da notícia",
      "author": "Autor",
      "source": "Fonte",
      "date": null,
      "score": 0.12
    }
  ]
}
```

Exemplo `curl`:
```bash
curl "http://localhost:8000/search?q=conteudo%20de%20teste&top_k=5"
```

---

## Execução rápida (Docker)

1. Build e subir serviços:
```bash
docker compose up --build
```
2. A API estará disponível em `http://localhost:8000`.

Notas:
- Primeiro start pode baixar o modelo `sentence-transformers`, levando alguns minutos.
- Redis é usado para cachear resultados de busca (`/search`).

