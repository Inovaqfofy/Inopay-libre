# --- ÉTAPE 1 : BUILD ---
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ÉTAPE 2 : PRODUCTION ---
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Config pour éviter les erreurs 404 sur React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
