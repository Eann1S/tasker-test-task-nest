FROM node:19 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nx run tasker-test-task-nest:build:production


FROM node:19-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

CMD ["node", "dist/apps/tasker-test-task-nest/main"]