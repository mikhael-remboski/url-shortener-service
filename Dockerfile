FROM node:20-slim AS build

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim AS production

WORKDIR /opt/app

COPY --from=build /opt/app/node_modules ./node_modules

COPY --from=build /opt/app/build ./build

CMD ["node", "build/src/bin/www.js"]
