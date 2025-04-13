FROM node:20.15.1

WORKDIR /app

COPY package*.json ./

# Install termasuk devDependencies (agar nodemon ikut)
RUN npm install --include=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
