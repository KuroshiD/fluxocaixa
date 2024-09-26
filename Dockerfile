FROM node:20.17 as base

ARG timezone
ENV TIMEZONE=${timezone:-"America/Sao_Paulo"} \
    APP_ENV=prod \
    SCAN_CACHEABLE=(true)

WORKDIR /home/node/app

COPY package*.json ./

RUN yarn install

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN yarn build

