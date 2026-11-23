# Frontend - CineDebate (Ionic + React + Vite)
# Se sirve con el servidor de desarrollo de Vite escuchando en 0.0.0.0
# para que sea accesible desde fuera del contenedor (requisito EF6: Docker local).
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
