# Gunakan image Node.js resmi sebagai base
FROM node:20.15.1

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies terlebih dahulu
RUN npm install

# Install dotenv jika belum
RUN npm install dotenv

# Salin seluruh source code ke dalam container
COPY . .

# Expose port yang digunakan oleh Express.js
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["node", "index.js"]
