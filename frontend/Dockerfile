FROM node:20-alpine

ENV NODE_ENV=development

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (cache layer)
COPY frontend/package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY frontend/ .

# Expõe a porta do Vite
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]