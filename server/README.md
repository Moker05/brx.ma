# BRX.MA - Backend API

API REST pour la plateforme BRX.MA - Bourse de Casablanca

## 🚀 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configuration de PostgreSQL

#### Créer la base de données
```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer la base de données et l'utilisateur
CREATE DATABASE brx_db;
CREATE USER brx_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE brx_db TO brx_user;

-- Se connecter à la nouvelle base de données
\c brx_db

-- Donner les permissions sur le schéma public
GRANT ALL ON SCHEMA public TO brx_user;
```

### 3. Variables d'environnement

Copier le fichier `.env.example` vers `.env` et modifier les valeurs :

```bash
cp .env.example .env
```

Puis éditer `.env` avec vos paramètres :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brx_db
DB_USER=brx_user
DB_PASSWORD=votre_mot_de_passe
```

### 4. Lancer le serveur

#### Mode développement (avec auto-reload)
```bash
npm run dev
```

#### Mode production
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## 📚 Endpoints API

### Status
- `GET /` - Informations sur l'API
- `GET /health` - Health check

### Stocks (À venir - Phase 4)
- `GET /api/stocks` - Liste de toutes les actions
- `GET /api/stocks/:symbol` - Détails d'une action
- `GET /api/stocks/:symbol/history` - Historique des prix

## 🗄️ Structure de la base de données

### Table: stocks
```sql
CREATE TABLE stocks (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  market VARCHAR(50),
  currency VARCHAR(3) DEFAULT 'MAD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: stock_prices
```sql
CREATE TABLE stock_prices (
  id SERIAL PRIMARY KEY,
  stock_id INTEGER REFERENCES stocks(id),
  date DATE NOT NULL,
  open DECIMAL(10,2),
  high DECIMAL(10,2),
  low DECIMAL(10,2),
  close DECIMAL(10,2),
  volume BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(stock_id, date)
);
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm test -- --coverage
```

## 📝 Scripts disponibles

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer en mode développement
- `npm test` - Lancer les tests
- `npm run migrate` - Exécuter les migrations
- `npm run seed` - Peupler la base de données
- `npm run lint` - Vérifier le code
- `npm run lint:fix` - Corriger automatiquement les erreurs

## 🔧 Configuration avancée

### Rate Limiting
Le serveur inclut un rate limiting par défaut :
- 100 requêtes par fenêtre de 15 minutes par IP

### CORS
Configuré pour accepter les requêtes de `http://localhost:3000` en développement.

### Logging
Utilise Morgan en développement et Winston en production.

## 📦 Dépendances principales

- **Express** - Framework web
- **Sequelize** - ORM pour PostgreSQL
- **Axios** - Client HTTP pour scraping
- **Cheerio** - Parsing HTML
- **Node-cron** - Tâches planifiées
- **Helmet** - Sécurité HTTP
- **CORS** - Gestion des requêtes cross-origin

## 🚀 Déploiement

Instructions de déploiement seront ajoutées dans la Phase 12.

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.
