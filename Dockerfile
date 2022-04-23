FROM node:16.13.2
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate