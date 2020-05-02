FROM node
RUN mkdir /motor
WORKDIR /motor
COPY package*.json ./
RUN npm install
COPY . /motor