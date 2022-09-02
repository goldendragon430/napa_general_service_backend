FROM node:16.17.0-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8080

VOLUME ["/app/node_modules"]

CMD ["yarn", "start"]
