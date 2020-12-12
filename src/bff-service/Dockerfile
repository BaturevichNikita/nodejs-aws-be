FROM node:15.3.0-alpine3.10 as development
WORKDIR /build
COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run prebuild && npm run build

FROM node:15.3.0-alpine3.10 as production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=development /build/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]