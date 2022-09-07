FROM node:16-alpine as builder

RUN mkdir -p /napa/node_modules && chown -R node:node /napa
WORKDIR /napa
COPY package*.json ./
# COPY .env ./

RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install

COPY --chown=node:node . .
RUN npm run build


EXPOSE 8000 5000
CMD [ "node", "./dist/index.js" ]