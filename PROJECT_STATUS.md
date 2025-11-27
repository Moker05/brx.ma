# 📊 BRX.MA - ÉTAT D'AVANCEMENT DU PROJET

**Date de mise à jour** : 26 Novembre 2024
**Version** : MVP - Phase Infrastructure
**Statut global** : 🟡 En développement actif

---

## 📈 Progression Globale : 25%

```
[████████░░░░░░░░░░░░░░░░░░░░░░░░] 25%

Phase 1 : Infrastructure Python      ████████████ 100% ✅
Phase 2 : Microservice Flask          ████████████ 100% ✅
Phase 3 : Validation données BVC      ████████████ 100% ⚠️ (Bloqué Cloudflare)
Phase 4 : Migration TypeScript        ░░░░░░░░░░░░   0% ⏳
Phase 5 : Intégration Charts          ░░░░░░░░░░░░   0% ⏳
Phase 6 : Backend Node.js + Prisma    ░░░░░░░░░░░░   0% ⏳
Phase 7 : Features MVP                ░░░░░░░░░░░░   0% ⏳
Phase 8 : Déploiement                 ░░░░░░░░░░░░   0% ⏳
```

---

## 🏗️ ARCHITECTURE DU PROJET

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                     BRX.MA PLATFORM                         │
│              Plateforme d'Information Financière            │
│          Bourse de Casablanca + Crypto-monnaies            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   FRONTEND       │     │    BACKEND       │     │  DATA SOURCES    │
│   React + TS     │────▶│  Node.js + TS    │────▶│                  │
│   + Vite         │     │  + Express       │     │  ┌────────────┐  │
│   + TailwindCSS  │     │  + Prisma        │     │  │ CoinGecko  │  │
│   + TradingView  │     │  + Socket.io     │     │  │    API     │  │
│     Charts       │     │  + Redis         │     │  │  (Crypto)  │  │
│                  │     │                  │     │  └────────────┘  │
│                  │     │                  │     │                  │
│                  │     │                  │     │  ┌────────────┐  │
│                  │     │  ┌────────────┐  │     │  │  Python    │  │
│                  │     │  │PostgreSQL  │  │     │  │  Flask     │  │
│                  │     │  │  (Prisma)  │  │     │  │   BVC      │  │
│                  │     │  └────────────┘  │     │  │ Scraper    │  │
└──────────────────┘     └──────────────────┘     │  └────────────┘  │
                                                   └──────────────────┘
    localhost:3000         localhost:5000            localhost:5001
```

### Architecture Technique

#### Frontend (React + TypeScript + Vite)
```
client/
├── src/
│   ├── components/           # Composants réutilisables
│   │   ├── charts/          # TradingView Lightweight Charts
│   │   ├── layout/          # Header, Sidebar, Footer
│   │   ├── common/          # Buttons, Cards, Modals
│   │   └── portfolio/       # Gestion portfolio
│   ├── pages/               # Pages de l'application
│   │   ├── Home/           # Dashboard principal
│   │   ├── Markets/        # Liste marchés
│   │   ├── StockDetail/    # Détails action
│   │   ├── Crypto/         # Crypto-monnaies
│   │   ├── Portfolio/      # Portfolio utilisateur
│   │   └── Auth/           # Login/Register
│   ├── services/            # API clients
│   │   ├── api.ts          # Configuration Axios
│   │   ├── stocksAPI.ts    # API Bourse Casa
│   │   ├── cryptoAPI.ts    # API CoinGecko
│   │   └── portfolioAPI.ts # API Portfolio
│   ├── hooks/              # Custom React Hooks
│   │   ├── useStocks.ts
│   │   ├── useCrypto.ts
│   │   ├── useWebSocket.ts
│   │   └── useAuth.ts
│   ├── store/              # Zustand state management
│   │   ├── authStore.ts
│   │   ├── portfolioStore.ts
│   │   └── themeStore.ts
│   ├── types/              # TypeScript types
│   └── utils/              # Utilitaires
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

#### Backend (Node.js + TypeScript + Express)
```
server/
├── src/
│   ├── config/              # Configuration
│   │   ├── database.ts     # Prisma config
│   │   ├── redis.ts        # Redis config
│   │   └── env.ts          # Variables environnement
│   ├── controllers/         # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── stocks.controller.ts
│   │   ├── crypto.controller.ts
│   │   └── portfolio.controller.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── stocks.service.ts    # ─┐
│   │   ├── crypto.service.ts    #  ├─▶ Appelle APIs externes
│   │   ├── bvc.service.ts       # ─┘
│   │   └── portfolio.service.ts
│   ├── routes/              # Express routes
│   ├── middleware/          # Middleware Express
│   ├── websocket/           # WebSocket handlers
│   ├── models/              # Types Prisma
│   └── server.ts            # Point d'entrée
├── prisma/
│   ├── schema.prisma        # Schéma BDD
│   └── migrations/
├── package.json
└── tsconfig.json
```

#### Microservice Python (Flask + BVCscrap)
```
scraper/                      ✅ COMPLETÉ
├── app.py                    # API Flask
├── bvc_wrapper.py            # Wrapper BVCscrap
├── venv/                     # Environnement virtuel
├── requirements.txt          # Dépendances Python
├── .env                      # Configuration
└── README.md                 # Documentation
```

### Stack Technologique Complète

| Couche | Technologie | Version | Status |
|--------|-------------|---------|--------|
| **Frontend** |
| Framework | React | 18.x | ⏳ À migrer |
| Langage | TypeScript | 5.x | ⏳ À configurer |
| Build Tool | Vite | 5.x | ⏳ À installer |
| UI Framework | TailwindCSS + DaisyUI | 3.x | ⏳ À installer |
| Charts | TradingView Lightweight Charts | 4.1.3 | ⏳ À intégrer |
| State Management | Zustand | 4.x | ⏳ À installer |
| Router | React Router | 6.x | ✅ Installé |
| HTTP Client | Axios + React Query | Latest | ✅ Installé |
| **Backend** |
| Runtime | Node.js | 18+ | ✅ Installé |
| Framework | Express.js | 4.x | ✅ Installé |
| Langage | TypeScript | 5.x | ⏳ À configurer |
| ORM | Prisma | 5.x | ⏳ À installer |
| Database | PostgreSQL | 14+ | ⏳ À installer |
| Cache | Redis | 7.x | ⏳ À installer |
| WebSocket | Socket.io | 4.x | ⏳ À installer |
| Auth | JWT + bcrypt | Latest | ⏳ À installer |
| Validation | Zod | 3.x | ⏳ À installer |
| **Scraper** |
| Runtime | Python | 3.12.10 | ✅ Installé |
| Framework | Flask | 3.0.0 | ✅ Installé |
| Scraping | BVCscrap | 0.2.1 | ✅ Installé ⚠️ Ne fonctionne plus |
| Parser | BeautifulSoup4 | 4.14.2 | ✅ Installé |
| Data Processing | Pandas | 2.3.3 | ✅ Installé |
| **Data Sources** |
| Crypto API | CoinGecko | Free Tier | ⏳ À intégrer |
| Bourse Casa | BVCscrap/Custom Scraper | - | ⚠️ BVCscrap bloqué |
| Charts | TradingView Free Widgets | - | ⏳ À intégrer |

---

## ✅ RÉALISATIONS

### Phase 1 : Infrastructure Python (100%)
- [x] Python 3.12.10 installé via Microsoft Store
- [x] pip 25.0.1 configuré
- [x] Environnement virtuel créé (`scraper/venv/`)
- [x] BVCscrap 0.2.1 + dépendances installées
- [x] BeautifulSoup4, lxml, pandas installés

### Phase 2 : Microservice Flask (100%)
- [x] API Flask créée et fonctionnelle
- [x] 7 endpoints REST implémentés :
  - `GET /health` - Health check
  - `GET /api/stocks` - Liste des actions
  - `GET /api/stocks/:symbol` - Détails action
  - `GET /api/stocks/:symbol/history` - Historique
  - `GET /api/stocks/:symbol/intraday` - Données intraday
  - `GET /api/sectors` - Secteurs
  - `GET /api/indices` - Indices (MASI, MADEX)
- [x] Wrapper BVCscrap avec fallback sur données mock
- [x] CORS configuré
- [x] Serveur lancé sur `http://localhost:5001`
- [x] Tests réussis avec curl

### Phase 3 : Validation Données (100% - avec limitation)
- [x] BVCscrap testé
- [x] ⚠️ **Problème identifié** : API Medias24 bloquée par Cloudflare
- [x] Solution temporaire : Données mock pour MVP
- [x] Recommandation : Playwright scraper ou autre source

### Documentation (100%)
- [x] [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture détaillée
- [x] [ROADMAP.md](ROADMAP.md) - Roadmap 12 phases
- [x] [STATUS.md](STATUS.md) - État projet
- [x] [INSTALL_PYTHON.md](INSTALL_PYTHON.md) - Guide installation Python
- [x] [scraper/README.md](scraper/README.md) - Doc microservice
- [x] [PROJECT_STATUS.md](PROJECT_STATUS.md) - Ce fichier

---

## ⚠️ PROBLÈMES IDENTIFIÉS

### 1. BVCscrap bloqué par Cloudflare
**Statut** : ⚠️ Problème critique
**Impact** : Impossible d'obtenir vraies données Bourse de Casablanca
**Cause** : API Medias24 protégée par Cloudflare challenge JavaScript

**Solutions proposées** :
1. **Court terme** : Utiliser données mock pour développement MVP
2. **Moyen terme** : Construire scraper avec Playwright (contourne Cloudflare)
3. **Long terme** :
   - Contacter Bourse de Casablanca pour API officielle
   - Utiliser fournisseur de données payant
   - Scraper alternatif avec rotation IP

**Décision** : Continuer avec mock data, développer le reste du MVP

---

## 🎯 PROCHAINES ÉTAPES

### Priorité 1 : Migration TypeScript (Semaine actuelle)

#### Client (React → React + TypeScript + Vite)
- [ ] Créer nouveau projet Vite avec template React + TypeScript
- [ ] Configurer tsconfig.json
- [ ] Installer TailwindCSS + DaisyUI
- [ ] Installer TradingView Lightweight Charts
- [ ] Installer Zustand
- [ ] Migrer composants existants vers TypeScript
- [ ] Créer composants de base :
  - [ ] Layout (Header, Sidebar, Footer)
  - [ ] Chart Component (TradingView)
  - [ ] StockCard
  - [ ] StockList

**Estimation** : 2-3 jours

#### Server (Node.js → TypeScript + Prisma)
- [ ] Initialiser projet TypeScript
- [ ] Configurer tsconfig.json
- [ ] Installer Prisma
- [ ] Créer schéma Prisma (Users, Portfolios, Stocks, Prices)
- [ ] Setup PostgreSQL
- [ ] Créer migrations
- [ ] Implémenter services :
  - [ ] Auth Service (JWT)
  - [ ] Stocks Service (appelle Python microservice)
  - [ ] Crypto Service (appelle CoinGecko)
  - [ ] Portfolio Service
- [ ] Setup WebSocket (Socket.io)
- [ ] Setup Redis cache

**Estimation** : 3-4 jours

### Priorité 2 : Intégrations (Semaine suivante)

#### CoinGecko API
- [ ] Créer compte CoinGecko (gratuit)
- [ ] Implémenter crypto.service.ts
- [ ] Tester endpoints :
  - Liste cryptos
  - Prix temps réel
  - Historique OHLCV
- [ ] Cache Redis (TTL: 1s)
- [ ] WebSocket temps réel

**Estimation** : 1 jour

#### TradingView Lightweight Charts
- [ ] Créer composant Chart
- [ ] Intégrer données mock
- [ ] Types de graphiques :
  - Candlestick
  - Line
  - Area
- [ ] Interactivité (zoom, pan, crosshair)
- [ ] Thème clair/sombre

**Estimation** : 1-2 jours

### Priorité 3 : Features MVP (Semaine 3-4)

#### Authentification
- [ ] JWT tokens (access + refresh)
- [ ] Register endpoint
- [ ] Login endpoint
- [ ] Middleware auth
- [ ] Frontend login/register pages

**Estimation** : 1-2 jours

#### Portfolio Tracking
- [ ] CRUD Portfolios
- [ ] CRUD Positions
- [ ] Calcul P&L temps réel
- [ ] WebSocket updates
- [ ] Frontend portfolio pages

**Estimation** : 2-3 jours

---

## 📊 SCHÉMA BASE DE DONNÉES

### Prisma Schema (à créer)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String      @id @default(uuid())
  email         String      @unique
  password      String      // bcrypt hashed
  name          String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  portfolios    Portfolio[]
}

model Portfolio {
  id          String            @id @default(uuid())
  userId      String
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  positions   PortfolioPosition[]
}

model PortfolioPosition {
  id            String      @id @default(uuid())
  portfolioId   String
  portfolio     Portfolio   @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  symbol        String      // ATW, BCP, BTC, ETH
  type          AssetType   // STOCK, CRYPTO, OPCVM
  quantity      Float
  purchasePrice Float
  purchaseDate  DateTime
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([portfolioId])
}

model Stock {
  symbol        String      @id
  name          String
  sector        String?
  market        Market      // BVC, CRYPTO
  lastPrice     Float?
  lastUpdate    DateTime?
  createdAt     DateTime    @default(now())
  prices        StockPrice[]
}

model StockPrice {
  id          String      @id @default(uuid())
  symbol      String
  stock       Stock       @relation(fields: [symbol], references: [symbol])
  open        Float
  high        Float
  low         Float
  close       Float
  volume      Float
  timestamp   DateTime
  createdAt   DateTime    @default(now())

  @@index([symbol, timestamp])
  @@unique([symbol, timestamp])
}

enum AssetType {
  STOCK
  CRYPTO
  OPCVM
}

enum Market {
  BVC
  CRYPTO
}
```

---

## 🔌 API ENDPOINTS

### Backend Node.js (Port 5000)

#### Authentification
```
POST   /api/auth/register      # Créer compte
POST   /api/auth/login         # Se connecter
POST   /api/auth/refresh       # Refresh token
GET    /api/auth/me            # Profil utilisateur
```

#### Stocks (Bourse de Casablanca)
```
GET    /api/stocks                    # Liste actions
GET    /api/stocks/:symbol            # Détails action
GET    /api/stocks/:symbol/history    # Historique
  ?interval=1d|1w|1m
  &from=YYYY-MM-DD
  &to=YYYY-MM-DD
GET    /api/stocks/sectors            # Secteurs
GET    /api/stocks/indices            # Indices
```

#### Crypto
```
GET    /api/crypto                    # Liste cryptos
GET    /api/crypto/:symbol            # Détails crypto
GET    /api/crypto/:symbol/history    # Historique
  ?interval=1h|1d
  &from=YYYY-MM-DD
  &to=YYYY-MM-DD
GET    /api/crypto/trending           # Top gainers/losers
```

#### Portfolio
```
GET    /api/portfolio                         # Mes portfolios
POST   /api/portfolio                         # Créer portfolio
GET    /api/portfolio/:id                     # Détails
PUT    /api/portfolio/:id                     # Modifier
DELETE /api/portfolio/:id                     # Supprimer
POST   /api/portfolio/:id/positions           # Ajouter position
PUT    /api/portfolio/:id/positions/:posId    # Modifier position
DELETE /api/portfolio/:id/positions/:posId    # Supprimer position
GET    /api/portfolio/:id/summary             # Résumé P&L
```

### WebSocket Events
```
Client → Server:
  subscribe:stock:ATW
  subscribe:crypto:BTC
  unsubscribe:stock:ATW

Server → Client:
  stock:ATW:update { price, change, volume, timestamp }
  crypto:BTC:update { price, change, volume, timestamp }
  portfolio:update { totalValue, pnl, positions }
```

---

## 💰 COÛTS ESTIMÉS

### Phase Development (Actuel)
- **Total** : 0€
  - Python : Gratuit
  - Node.js : Gratuit
  - PostgreSQL local : Gratuit
  - Redis local : Gratuit
  - APIs : Gratuit (tiers gratuits)

### Phase MVP Deployment
| Service | Fournisseur | Coût/mois |
|---------|-------------|-----------|
| Frontend | Vercel Free | 0€ |
| Backend Node.js | Railway Hobby | 5€ |
| Python Scraper | Railway Hobby | 5€ |
| PostgreSQL | Railway Free | 0€ |
| Redis | Upstash Free | 0€ |
| CoinGecko API | Free Tier | 0€ |
| TradingView Charts | Free (avec attribution) | 0€ |
| Domain (.ma) | - | 10-15€/an |
| **TOTAL** | | **~10€/mois** |

### Phase Production (6+ mois)
| Service | Coût/mois |
|---------|-----------|
| Hosting (scaled) | 50-100€ |
| Database Pro | 20-50€ |
| Redis Pro | 10-30€ |
| APIs Premium | 30-100€ |
| CDN/Monitoring | 10-20€ |
| **TOTAL** | **120-300€/mois** |

---

## 📅 CALENDRIER PRÉVISIONNEL

### Semaine 1-2 (Actuelle)
- ✅ Setup Python + BVCscrap
- ✅ Microservice Flask
- ⏳ Migration TypeScript (client + server)
- ⏳ TradingView Lightweight Charts

### Semaine 3
- Intégration CoinGecko API
- WebSocket temps réel
- Setup PostgreSQL + Prisma
- Setup Redis

### Semaine 4
- Authentification JWT
- Portfolio CRUD
- Frontend pages principales

### Semaine 5-6
- Tests
- Optimisations
- Documentation utilisateur
- Préparation déploiement

### Semaine 7-8
- Déploiement MVP
- Monitoring
- Corrections bugs
- Amélioration scraper Bourse Casa

---

## 🔧 COMMANDES UTILES

### Microservice Python
```bash
# Activer environnement
cd scraper
venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Lancer serveur
python app.py
# → http://localhost:5001
```

### Backend Node.js (futur)
```bash
cd server
npm install
npm run dev
# → http://localhost:5000
```

### Frontend React (futur)
```bash
cd client
npm install
npm run dev
# → http://localhost:3000
```

---

## 🎯 OBJECTIFS MVP

### Fonctionnalités Essentielles
- [ ] Visualisation graphiques actions BVC (mock data temporaire)
- [ ] Visualisation graphiques crypto (vraies données CoinGecko)
- [ ] Authentification utilisateur
- [ ] Création compte
- [ ] Gestion portfolio :
  - [ ] Ajouter positions (actions, crypto, OPCVM)
  - [ ] Voir P&L total
  - [ ] Voir P&L par position
  - [ ] Monitoring temps réel
- [ ] Indicateurs techniques de base :
  - [ ] SMA
  - [ ] Volume
- [ ] Mode clair/sombre

### Fonctionnalités Nice-to-Have (Post-MVP)
- Alertes prix
- Watchlist personnalisée
- Export données CSV
- Indicateurs avancés (RSI, MACD, Bollinger)
- Comparaison graphiques
- Actualités financières
- Notifications push

---

## 📚 RESSOURCES & LIENS

### Documentation Technique
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)

### Repositories
- [OpenAlgo (inspiration)](https://github.com/marketcalls/openalgo)
- [BVCscrap (archivé)](https://github.com/AmineAndam04/BVCscrap)
- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts)

### APIs
- [CoinGecko Free API](https://www.coingecko.com/en/api)
- [Bourse de Casablanca](https://www.casablanca-bourse.com/)
- [TradingView Free Widgets](https://www.tradingview.com/widget/)

---

## 🏆 MÉTRIQUES DE SUCCÈS MVP

| Métrique | Objectif | Status |
|----------|----------|--------|
| **Performance** |
| Page Load (LCP) | < 2s | ⏳ |
| API Response (p95) | < 200ms | ⏳ |
| WebSocket Latency | < 100ms | ⏳ |
| **Qualité** |
| Test Coverage Backend | > 80% | ⏳ |
| Test Coverage Frontend | > 70% | ⏳ |
| Lighthouse Score | > 90 | ⏳ |
| **Disponibilité** |
| Uptime | > 99% | ⏳ |

---

## 🚨 RISQUES & MITIGATIONS

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| BVCscrap ne fonctionne plus | Élevé | ✅ Réalisé | Utiliser mock data + développer Playwright scraper |
| Cloudflare bloque scraping | Élevé | Élevée | Rotation IP, proxies, ou API officielle |
| CoinGecko rate limit | Moyen | Faible | Cache Redis + upgrade plan si nécessaire |
| PostgreSQL gratuit limité | Faible | Moyenne | Migrer vers plan payant (~10€/mois) |
| Complexité TypeScript | Faible | Faible | Documentation + formation équipe |

---

## 👥 ÉQUIPE & CONTACTS

**Développeur Principal** : YFA
**Assistant IA** : Claude Code (Anthropic)

---

## 📝 NOTES & DÉCISIONS

### 26 Nov 2024
- ✅ Python 3.12.10 installé
- ✅ Microservice Flask créé et testé
- ⚠️ **Décision** : BVCscrap bloqué par Cloudflare
  - **Action** : Continuer avec mock data
  - **Next** : Développer Playwright scraper après MVP
- 📋 **Next Steps** : Migration TypeScript

---

**Dernière mise à jour** : 26 Novembre 2024 21:45
**Prochaine révision** : Après migration TypeScript
**Version** : 1.0.0
