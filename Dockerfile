FROM node:14
RUN mkdir -p /blog && chown -R node:node /blog
WORKDIR /blog
COPY package*.json ./
RUN npm install
COPY . /blog
