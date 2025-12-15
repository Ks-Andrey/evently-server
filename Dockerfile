FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем проект
RUN npm run build

# Production образ
FROM node:20-alpine

WORKDIR /app

# Копируем package.json для установки только production зависимостей
COPY package*.json ./

# Устанавливаем production зависимости
RUN npm ci --only=production

# Копируем необходимые dev зависимости для seed.ts
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/@swc ./node_modules/@swc
COPY --from=builder /app/node_modules/esbuild ./node_modules/esbuild

# Копируем собранные файлы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Копируем необходимые файлы
COPY avatars ./avatars
COPY events ./events
COPY scripts ./scripts
COPY init ./init

# Создаем директории для логов
RUN mkdir -p logs

EXPOSE 3000

CMD ["npm", "start"]

