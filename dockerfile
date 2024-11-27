# Usar uma imagem base do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a API usa
EXPOSE 3000

# Compilar a aplicação NestJS
RUN npm run build

# Comando para rodar a aplicação
CMD ["npm", "start"]
