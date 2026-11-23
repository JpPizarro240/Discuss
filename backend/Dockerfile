# Backend - CineDebate (Node.js + Express + PostgreSQL)
FROM node:20-slim

WORKDIR /app

# Instala dependencias primero (aprovecha la cache de Docker si no cambian)
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el resto del codigo del backend
COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
