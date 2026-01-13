# (modifié : commentaire CI ajouté)
# Stage de build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present
RUN npm run build:server

# Stage de production
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app .

# s'assurer des permissions et exécuter en user non-root
RUN chown -R node:node /app
USER node

EXPOSE 8080
# start the server
CMD ["node", "dist-server/server/index.js"]

# CI note: owner lowercasing is handled in the workflow tags
