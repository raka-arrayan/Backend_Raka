# Gunakan image Node.js resmi sebagai base
FROM node:20.15.1

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies
RUN npm install

# Install dotenv jika diperlukan (opsional, tapi biasanya sudah termasuk di package.json)
RUN npm install dotenv

# Salin file .env ke dalam container
COPY .env .env

# Salin seluruh source code ke dalam container
COPY . .

# Expose port yang digunakan oleh Express.js
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]
