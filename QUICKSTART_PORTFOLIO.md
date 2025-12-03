# 🚀 Démarrage Rapide - Portfolio BRX.MA

## Prérequis

- Node.js v18+
- PostgreSQL installé et en cours d'exécution
- npm ou yarn

## Installation en 5 étapes

### 1️⃣ Configuration de la Base de Données

Créez une base de données PostgreSQL :

```bash
# Sur PostgreSQL
createdb brxma
```

Ou via psql :
```sql
CREATE DATABASE brxma;
```

### 2️⃣ Configuration du Backend

```bash
# Aller dans le dossier server
cd server

# Créer le fichier .env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/brxma" > .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma db push

# Optionnel : Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

### 3️⃣ Configuration du Frontend

```bash
# Aller dans le dossier client-new
cd ../client-new

# Créer le fichier .env
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Installer les dépendances
npm install
```

### 4️⃣ Démarrer le Backend

```bash
cd server
npm run dev
```

Vous devriez voir :
```
🚀 Server running on port 5000
📊 Environment: development
🔗 CORS origin: http://localhost:5173
```

### 5️⃣ Démarrer le Frontend

Dans un nouveau terminal :
```bash
cd client-new
npm run dev
```

Ouvrez votre navigateur à : **http://localhost:5173**

## 🎯 Tester les Fonctionnalités

### Test 1 : Ajouter un Actif Crypto

1. Cliquez sur **"Mon Portfolio"** dans le menu
2. Cliquez sur **"Ajouter un actif"**
3. Remplissez le formulaire :
   - Type : **Crypto**
   - Symbole : **BTC**
   - Nom : **Bitcoin**
   - Quantité : **0.5**
   - Prix d'achat : **500000** MAD
   - Date : Aujourd'hui
4. Cliquez sur **"Ajouter l'actif"**

### Test 2 : Actualiser les Prix

1. Cliquez sur **"Actualiser les prix"**
2. Les prix crypto seront mis à jour via CoinGecko API
3. Le PnL sera recalculé automatiquement

### Test 3 : Visualiser l'Évolution

1. Consultez le graphique **"Évolution du portefeuille"**
2. Testez les filtres : **1S, 1M, 1A, Max**
3. Survolez le graphique pour voir les détails

### Test 4 : Ajouter une Action BVC

1. Cliquez sur **"Ajouter un actif"**
2. Type : **Action (BVC)**
3. Symbole : **ATW**
4. Nom : **Attijariwafa Bank**
5. Quantité : **100**
6. Prix d'achat : **520** MAD
7. Valider

## 📊 API Endpoints Disponibles

### Portfolio
```
GET    /api/portfolio/wallet/:userId          # Récupérer le portefeuille
POST   /api/portfolio/positions/:userId       # Ajouter une position
PUT    /api/portfolio/positions/:positionId   # Modifier une position
DELETE /api/portfolio/positions/:positionId   # Supprimer une position
POST   /api/portfolio/wallet/:userId/reset    # Réinitialiser
```

### Trading
```
POST   /api/portfolio/buy/:userId    # Exécuter un achat
POST   /api/portfolio/sell/:userId   # Exécuter une vente
```

### Historique
```
GET    /api/portfolio/history/:userId?period=1M    # Historique graphique
POST   /api/portfolio/snapshot/:userId             # Créer un snapshot
```

### Prix
```
POST   /api/prices/update/:userId    # Mettre à jour les prix
```

## 🧪 Tester les API avec curl

### Récupérer le portefeuille
```bash
curl http://localhost:5000/api/portfolio/wallet/demo-user-001
```

### Ajouter une position
```bash
curl -X POST http://localhost:5000/api/portfolio/positions/demo-user-001 \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTC",
    "assetType": "CRYPTO",
    "market": "CRYPTO",
    "quantity": 1,
    "purchasePrice": 500000,
    "name": "Bitcoin"
  }'
```

### Mettre à jour les prix
```bash
curl -X POST http://localhost:5000/api/prices/update/demo-user-001
```

## 🛠️ Dépannage

### Erreur : "Cannot find module '@prisma/client'"
```bash
cd server
npx prisma generate
```

### Erreur : "Connection refused PostgreSQL"
Vérifiez que PostgreSQL est en cours d'exécution :
```bash
# Windows
pg_ctl status

# Linux/Mac
sudo service postgresql status
```

### Erreur : "Port 5000 already in use"
Changez le port dans `server/.env` :
```env
PORT=5001
```

### Frontend : "Failed to fetch"
Vérifiez que :
1. Le backend est démarré (`npm run dev` dans `server/`)
2. L'URL dans `client-new/.env` correspond au port du backend
3. CORS est bien configuré

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [React Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

## 💡 Astuces

### Prisma Studio
Visualisez vos données en temps réel :
```bash
cd server
npx prisma studio
```
Ouvre un navigateur à : http://localhost:5555

### Reset Complet
Pour tout réinitialiser :
```bash
cd server
npx prisma migrate reset --force
npx prisma db push
```

### Voir les Logs Backend
Le backend affiche tous les appels API et erreurs dans la console.

### DevTools React Query
Installez l'extension React Query DevTools pour déboguer le cache.

## 🎉 Prochaines Étapes

1. ✅ Testez l'ajout de plusieurs actifs
2. ✅ Explorez les différentes périodes du graphique
3. ✅ Testez les filtres et la recherche
4. 📝 Consultez [PORTFOLIO_FEATURES.md](./PORTFOLIO_FEATURES.md) pour la documentation complète
5. 🚀 Commencez à développer vos propres fonctionnalités !

## ❓ Besoin d'Aide ?

Consultez les fichiers :
- `PORTFOLIO_FEATURES.md` - Documentation complète
- `README.md` - Vue d'ensemble du projet
- `server/src/controllers/portfolio.controller.ts` - Logique backend
- `client-new/src/pages/Portfolio/PortfolioNew.tsx` - Interface principale
