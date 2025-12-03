# Installation et Configuration de PostgreSQL pour BRX.MA

## Étape 1 : Installation de PostgreSQL

### Option A : Via winget (Recommandé)
```powershell
winget install PostgreSQL.PostgreSQL
```

### Option B : Téléchargement manuel
1. Télécharger depuis https://www.postgresql.org/download/windows/
2. Exécuter l'installeur
3. Mot de passe par défaut : choisir un mot de passe simple pour développement (ex: `postgres`)
4. Port par défaut : 5432

## Étape 2 : Création de la base de données

Après l'installation, ouvrir PowerShell en tant qu'administrateur :

```powershell
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, exécuter ces commandes :
CREATE DATABASE brx_db;
CREATE USER brx_user WITH PASSWORD 'brx_admin';
GRANT ALL PRIVILEGES ON DATABASE brx_db TO brx_user;

# Quitter psql
\q
```

## Étape 3 : Configuration du projet (DÉJÀ FAIT)

J'ai déjà préparé les fichiers de configuration. Il suffit de lancer les commandes suivantes :

```bash
cd server

# Mettre à jour les packages
npm install pg

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma migrate dev --name init

# Démarrer le serveur
npm run dev
```

## Étape 4 : Tester le portefeuille

```bash
# Terminal 1 - Serveur
cd server
npm run dev

# Terminal 2 - Client
cd client-new
npm run dev

# Ouvrir http://localhost:5173/portfolio
```

## Dépannage

### Erreur : "psql: error: connection to server"
- Vérifier que PostgreSQL est démarré : `services.msc` → Chercher "PostgreSQL" → Démarrer le service

### Erreur : "password authentication failed"
- Vérifier le mot de passe dans `server/.env`
- Réinitialiser le mot de passe PostgreSQL si nécessaire

### Port 5432 déjà utilisé
- Modifier le port dans `server/.env` : `postgresql://brx_user:brx_admin@localhost:5433/brx_db`
