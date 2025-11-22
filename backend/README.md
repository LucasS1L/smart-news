# SmartNews API (Python) — Endpoints

Este documento descreve os endpoints disponíveis na API SmartNews implementada em Python com FastAPI, embeddings via `sentence-transformers` e base vetorial local com ChromaDB.

- Base URL: `http://localhost:8000`
- Formato: JSON
- Autenticação: Não requerida

## Sumário
- `POST /news/` — Criar notícia
- `PUT /news/{id}` — Atualizar notícia
- `GET /news/{id}` — Obter notícia por ID
- `DELETE /news/{id}` — Remover notícia
- `GET /search` — Buscar notícias por similaridade semântica

---

## POST /news/
Cria uma nova notícia e salva na base vetorial Chroma.

Body (JSON):
```json
{
  "title": "Título da notícia",
  "text": "Conteúdo da notícia",
  "author": "Autor opcional",
  "source": "Fonte opcional",
  "date": "2024-10-01"
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
  "date": "2024-10-01"
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
    "date": "2024-10-01"
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
  "date": "2024-10-02"
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

## GET /news/{id}
Obtém uma notícia pelo seu identificador numérico.

Resposta (200): mesmo formato do `POST /news/`.

Erros:
- 404 se o `id` não existir.

Exemplo `curl`:
```bash
curl http://localhost:8000/news/1
```

---

## DELETE /news/{id}
Remove o registro correspondente na base vetorial Chroma.

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
- Todos os dados persistem no ChromaDB (sem SQLite).

