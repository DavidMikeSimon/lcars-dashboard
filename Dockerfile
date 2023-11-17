FROM node:20-alpine3.17

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app
RUN npm install

COPY adapters dist postcss.config.js public server src tsconfig.json vite.config.ts /app
RUN npm run build

CMD ["npm", "run", "serve"]
