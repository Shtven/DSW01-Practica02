FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/frontend/browser/ ./
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/docker-entrypoint.sh /docker-entrypoint.d/40-runtime-config.sh
COPY public/runtime-config.template.json /usr/share/nginx/html/runtime-config.template.json

RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh \
	&& sed -i 's/\r$//' /docker-entrypoint.d/40-runtime-config.sh

EXPOSE 80