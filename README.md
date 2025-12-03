# 🚀 BRX.MA - Plateforme d'Information Financière

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📊 Description

**BRX.MA** est une plateforme web moderne et complète pour :
- 📊 Suivre les actions de la **Bourse de Casablanca (BVC)** en temps réel
- 💎 Suivre les **cryptomonnaies** via l'API CoinGecko
- 📈 Analyser avec des **graphiques avancés** et indicateurs techniques (SMA, EMA, RSI, MACD)
- 💼 Gérer son **portfolio** d'investissements
- ⭐ Créer des **watchlists** personnalisées
- 🔔 Recevoir des **alertes de prix**

## 🚀 Technologies

### Frontend
- **React 19.2** + **TypeScript 5.9** - Framework UI moderne
- **Vite 7.2** - Build tool ultra-rapide
- **TailwindCSS 3.4** + **DaisyUI 5.5** - Design system
- **Lightweight Charts 4.2** - Graphiques TradingView performants
- **@ixjb94/indicators** - +100 indicateurs techniques
- **TanStack Query 5.90** (React Query) - Gestion cache et données
- **React Router 7.9** - Navigation
- **Zustand 5.0** - State management
- **Axios 1.13** - Client HTTP

### Backend
- **Node.js** + **Express 4.18** - API REST
- **TypeScript 5.9** - Type-safety
- **Prisma 7.0** - ORM moderne
- **PostgreSQL** - Base de données relationnelle
- **JWT** + **bcryptjs** - Authentification sécurisée
- **Zod 4.1** - Validation runtime
- **Helmet** - Sécurité HTTP headers
- **Morgan** - Logging

### Services Tiers
- **CoinGecko API** - Données crypto temps réel
- **Python Flask** - Microservice scraping BVC

## 📁 Structure du Projet

```
brx.ma/
├── client-new/              # Frontend React + TypeScript ✅
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   │   ├── charts/      # AdvancedChart, TradingChart
│   │   │   ├── layout/      # Header, Sidebar, Layout
│   │   │   └── trading/     # TradeModal
│   │   ├── pages/           # Pages principales
│   │   │   ├── Home/        # Dashboard avec graphiques
│   │   │   ├── Crypto/      # Page cryptos (CoinGecko)
│   │   │   ├── Markets/     # Marchés BVC
│   │   │   ├── Portfolio/   # Gestion portfolio
│   │   │   ├── Auth/        # Login/Register
│   │   │   └── Dashboard/   # Dashboard personnel
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # useCrypto, etc.
│   │   ├── routes/          # ProtectedRoute
│   │   ├── services/        # coinGeckoAPI
│   │   ├── utils/           # mockData, formatters
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── tailwind.config.js   # 3 thèmes DaisyUI
│   └── package.json
│
├── server/                  # Backend Node.js + TypeScript ✅
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── stocks.routes.ts
│   │   │   ├── crypto.routes.ts
│   │   │   ├── portfolio.routes.ts
│   │   │   └── watchlist.routes.ts
│   │   ├── middleware/      # errorHandler, notFound
│   │   └── index.ts         # Serveur Express
│   ├── prisma/
│   │   └── schema.prisma    # Schéma DB Prisma 7
│   ├── tsconfig.json
│   ├── prisma.config.ts
│   └── package.json
│
├── scraper/                 # Python Flask microservice 🐍
│   ├── app.py               # API Flask (port 5001)
│   └── requirements.txt
│
├── DEVELOPMENT_RECAP.md     # Récap développement détaillé
├── TEST_REPORT.md           # Rapport de tests complet
├── INSTALL_PYTHON.md        # Guide installation Python
└── README.md                # Ce fichier
```

## 🛠️ Installation

### Prérequis
- **Node.js** >= 18.x ([Télécharger](https://nodejs.org/))
- **npm** >= 9.x (inclus avec Node.js)
- **Python** 3.10+ ([Guide](INSTALL_PYTHON.md))
- **PostgreSQL** >= 14.x ([Télécharger](https://www.postgresql.org/download/)) OU Prisma Postgres
- **Git** ([Télécharger](https://git-scm.com/))

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/brx.ma.git
cd brx.ma
```

### 2. Installer les dépendances

#### Frontend
```bash
cd client-new
npm install
```

#### Backend
```bash
cd ../server
npm install
```

#### Python Microservice (optionnel)
```bash
cd ../scraper
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### 3. Configuration

#### Créer le fichier .env backend
```bash
cd server
cp .env.example .env
```

Modifier `.env` avec vos valeurs :
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/brxma?schema=public"
JWT_SECRET="votre_secret_jwt_super_securise"
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
PYTHON_API_URL=http://localhost:5001
```

### 4. Configurer la base de données

#### Option A : Prisma Postgres (recommandé pour dev)
```bash
cd server
npx prisma dev
```

#### Option B : PostgreSQL classique
```bash
# 1. Installer PostgreSQL
# 2. Créer la database : createdb brxma
# 3. Appliquer le schéma
cd server
npm run prisma:push
```

### 5. Générer le client Prisma
```bash
cd server
npm run prisma:generate
```

### 6. Lancer l'application

#### Terminal 1 - Frontend React
```bash
cd client-new
npm run dev
```
→ Ouvrir [http://localhost:5173](http://localhost:5173)

#### Terminal 2 - Backend TypeScript
```bash
cd server
npm run dev
```
→ API sur [http://localhost:5000](http://localhost:5000)

#### Terminal 3 - Python Microservice (optionnel)
```bash
cd scraper
venv\Scripts\activate
python app.py
```
→ API sur [http://localhost:5001](http://localhost:5001)

## ✨ Fonctionnalités

### Actuellement Disponibles ✅

- **Graphiques TradingView Avancés**
  - Chandeliers japonais (candlesticks)
  - Indicateurs techniques : SMA, EMA, RSI, MACD, Volume
  - Multi-timeframes : 1J, 1S, 1M, 1A
  - Zoom et pan interactifs

- **Page Crypto**
  - Top 50 cryptos (CoinGecko API)
  - Prix temps réel avec auto-refresh
  - Graphiques OHLC avec indicateurs
  - Stats détaillées (prix, variation, market cap, volume)

- **Design Moderne**
  - 3 thèmes : **brx-terminal** (défaut), **brx-night**, **brx-light**
  - Interface responsive (mobile, tablette, desktop)
  - Animations fluides

- **Backend TypeScript**
  - API REST avec Express
  - Prisma ORM + PostgreSQL
  - Middleware sécurité (Helmet, CORS)
  - Error handling robuste

### En Développement 🚧

- Authentification JWT complète
- Portfolio CRUD avec Prisma
- Watchlist fonctionnelle
- Alertes de prix
- WebSocket temps réel (Socket.io)
- Tests automatisés

### Roadmap 🗺

Voir [DEVELOPMENT_RECAP.md](DEVELOPMENT_RECAP.md) pour le plan détaillé

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le fichier `CONTRIBUTING.md` pour plus de détails.

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ pour la communauté des investisseurs marocains

## 📞 Contact

- Website: https://brx.ma
- Email: contact@brx.ma

---

**Note**: Ce projet est en cours de développement actif. Restez à l'écoute pour les mises à jour !
