FROM node
RUN mkdir /moto
WORKDIR /moto
COPY package*.json ./
RUN npm install
COPY . /moto