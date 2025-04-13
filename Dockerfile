FROM node:20.15.1

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies (hanya dependencies, bukan devDependencies)
RUN npm install

# Copy seluruh source code ke container
COPY . .

# Port yang digunakan oleh aplikasi
EXPOSE 3000

# Jalankan aplikasi dengan node (bukan nodemon)
CMD ["node", "index.js"]
