FROM node:14 as base

WORKDIR /opt/app

COPY ./package.json .

COPY ./yarn.lock .

RUN yarn

COPY . .

FROM base as production

ENV NODE_PATH=./dist

ENV NODE_ENV=production

RUN yarn build