# --- ÉTAPE 1 : BUILD ---
FROM node:20-alpine AS builder

# Installation des outils système nécessaires
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Installation des dépendances (optimisée pour le cache Docker)
COPY package*.json ./
RUN npm install

# Copie du reste du code source
COPY . .

# Build de l'application (Génère le dossier /dist)
RUN npm run build

# --- ÉTAPE 2 : PRODUCTION (Serveur Web) ---
FROM nginx:1.25-alpine

# On vide le dossier par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers compilés depuis l'étape de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Création d'une configuration Nginx personnalisée
# Cela permet de rediriger toutes les routes vers index.html (essentiel pour React Router)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Optimisation du cache pour les assets statiques \
    location /assets/ { \
        expires 1y; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Healthcheck pour s'assurer que le serveur répond
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
