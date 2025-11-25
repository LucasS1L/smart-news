# SmartNews — Execução com Docker Compose

## Pré-requisitos
- Docker instalado

## Primeira execução (build inicial)
- Na raiz do projeto, execute:
```bash
docker compose up --build
```
- Serviços:
- `Interface Web` disponível em `localhost:5173`
- `smartnews-api` (FastAPI) disponível em `http://localhost:8000`
- `redis` disponível em `localhost:6379`


Obs: na primeira execução a instalação das dependências pode demorar um pouco.

## Como acessar a aplicação
- Abra essa URL no navegador: `http://localhost:5173`

## Próximas execuções (a partir da segunda vez)
- Como as imagens já foram construídas e os dados do Chroma estão no volume, basta executar :
```bash
docker compose up
```
- Opcional em background:
```bash
docker compose up -d
```

## Persistência
- O ChromaDB grava dados em `CHROMA_PERSIST_DIR` e é montado no volume `chroma_data`.
- Os dados permanecem entre reinícios do container.

## Encerrar e limpar
- Parar serviços e manter dados:
```bash
docker compose down
```
- Remover volumes (apaga dados do Chroma):
```bash
docker compose down -v
```
