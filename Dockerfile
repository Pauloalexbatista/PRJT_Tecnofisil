FROM node:20-slim

# Instalar dependências necessárias para compilar o sqlite3 se necessário
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar os package.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Construir o frontend Vite
RUN npm run build

# Expor o porto
EXPOSE 3000

# Arrancar o servidor
CMD ["npm", "start"]
