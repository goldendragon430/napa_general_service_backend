FROM node:12-alpine as builder

RUN mkdir -p /home/napa/node_modules && chown -R node:node /home/napa
WORKDIR /home/napa
COPY package*.json ./

RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install

COPY --chown=napa:napa . .
RUN npm run build

FROM node:12-alpine
RUN mkdir -p /home/napa/node_modules && chown -R node:node /home/napa
WORKDIR /home/napa
COPY package*.json ./
USER node
RUN npm install
COPY --from=builder /home/napa/dist ./dist
# COPY --chown=node:node .env .
COPY --chown=node:node  /config ./config
# COPY --chown=node:node  /public ./public
EXPOSE 8000
CMD [ "node", "./dist/index.js" ]