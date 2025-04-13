FROM node:20.15.1

WORKDIR /app

COPY package*.json ./

# Install semua dependency termasuk devDependencies
RUN npm install

COPY . .

EXPOSE 3000

# Gunakan node, bukan nodemon, untuk production
CMD ["node", "index.js"]
