FROM node:alpine
RUN mkdir -p /blog && chown -R node:node /blog
WORKDIR /blog
COPY package*.json ./
RUN npm install
COPY . /blog
