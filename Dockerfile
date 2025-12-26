# --- ÉTAPE 1 : BUILD (Utilisation de Node.js pour compiler et migrer) ---
FROM node:20-alpine AS builder

# Installation des outils nécessaires pour Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances
RUN npm install

# Copie de tout le code source
COPY . .

# Déclaration de l'argument de build pour la base de données
# Cela permet à Prisma de se connecter pendant la création de l'image
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Génération du client Prisma
RUN npx prisma generate

# SYNCHRONISATION DE LA BASE DE DONNÉES
# Cette commande crée les tables manquantes dans votre Supabase auto-hébergé
RUN npx prisma db push --accept-data-loss

# Build de l'interface (Vite)
RUN npm run build

# --- ÉTAPE 2 : PRODUCTION (Image légère avec Nginx) ---
FROM nginx:1.25-alpine

# Copie du résultat du build vers le dossier Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration du Healthcheck pour Coolify
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
