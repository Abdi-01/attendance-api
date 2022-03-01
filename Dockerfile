FROM node:12

# Buat direktori didalam docker
WORKDIR /usr/src/app

# Menyalin dependencies aplikasi kedalam docker
COPY package*.json ./

# Instalasi dependencies
RUN npm install

# menyalin file project
COPY . .

# define port
EXPOSE 2500

# menjalankan aplikasi
CMD [ "node", "index.js" ]