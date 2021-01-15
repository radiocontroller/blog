FROM node:alpine
RUN mkdir -p /motor && chown -R node:node /motor
WORKDIR /motor
COPY package*.json ./
RUN npm install
COPY . /motor