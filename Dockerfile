FROM node:14.4.0-alpine3.12 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:14.4.0-alpine3.12 as web
WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/tsconfig.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]
