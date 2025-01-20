# Usamos una imagen oficial de Node.js como base
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del codigo fuente
COPY . .

# Exponemos el puerto en el que se ejecutar la aplicacion
EXPOSE 3000

# Comando para iniciar la aplicacion
CMD ["npm", "start"]
