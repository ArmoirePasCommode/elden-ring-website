# Stage de build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present

# Stage de production
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app .
EXPOSE 3000
# lance le script start si présent, sinon sert le dossier build via npx serve
CMD ["sh", "-c", "npm run start --if-present || npx serve -s build -l 3000"]

