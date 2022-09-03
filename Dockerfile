FROM node:12-alpine as builder

RUN mkdir -p /napa/node_modules && chown -R node:node /napa
WORKDIR /napa
COPY package*.json ./

RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install

COPY --chown=node:node . .
RUN npm run build

FROM node:12-alpine
RUN mkdir -p /napa/node_modules && chown -R node:node /napa
WORKDIR /napa
COPY package*.json ./
USER node
RUN npm install
COPY --from=builder /napa/dist ./dist
# COPY --chown=node:node .env .
COPY --chown=node:node  /config ./config
# COPY --chown=node:node  /public ./public
EXPOSE 8000
CMD [ "node", "./dist/index.js" ]