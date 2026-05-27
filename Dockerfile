FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --ignore-scripts=false

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/main.js"]