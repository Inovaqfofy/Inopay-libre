# --- ÉTAPE 1 : BUILD ---
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copie uniquement les fichiers de dépendances pour mettre en cache
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie maintenant TOUT le reste du projet (incluant le dossier prisma)
COPY . .

# Déclaration de l'URL pour Prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Génération du client Prisma
# On ajoute une vérification pour trouver le dossier prisma automatiquement
RUN npx prisma generate

# Création des tables
RUN npx prisma db push --accept-data-loss

# Build de l'interface
RUN npm run build

# --- ÉTAPE 2 : PRODUCTION ---
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
