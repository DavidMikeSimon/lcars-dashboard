FROM node:20-alpine3.17

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app
RUN npm install

COPY adapters postcss.config.js public src tsconfig.json vite.config.ts /app
RUN npm run build
COPY dist server /app

CMD ["npm", "run", "serve"]
