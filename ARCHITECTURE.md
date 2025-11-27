# 🏗️ ARCHITECTURE BRX.MA - MVP

## 📋 Vue d'ensemble

Plateforme d'information financière pour la Bourse de Casablanca et Crypto-monnaies, inspirée d'investing.com avec des capacités d'analyse technique similaires à TradingView.

## 🎯 Objectifs MVP

1. **Visualisation** : Charts interactifs pour actions et crypto
2. **Authentification** : Comptes utilisateurs
3. **Portfolio** : Tracking du portefeuille personnel (actions, OPCVM)
4. **Temps réel** : Mise à jour crypto (1s) et bourse Casa (15min)
5. **Analyse technique** : Indicateurs comme TradingView

## 🏗️ Stack Technologique

### Frontend
- **Framework** : React 18 + TypeScript
- **Charts** : TradingView Lightweight Charts (Apache 2.0, gratuit)
- **UI** : Tailwind CSS + DaisyUI
- **State** : Zustand (simple et performant)
- **Router** : React Router v6
- **HTTP** : Axios + React Query (cache)
- **WebSocket** : Socket.io-client

### Backend
- **Runtime** : Node.js 18+ + TypeScript
- **Framework** : Express.js
- **Database** : PostgreSQL 14+ (time-series data)
- **Cache** : Redis (données 15min bourse)
- **ORM** : Prisma (TypeScript-first)
- **Auth** : JWT + bcrypt
- **WebSocket** : Socket.io
- **Validation** : Zod
- **Logger** : Winston

### Data Sources
- **Crypto** : CoinGecko API (gratuit, 10K calls/mois)
- **Bourse Casa** : BVCscrap (Python) via microservice
- **Charts** : TradingView Lightweight Charts

### DevOps
- **Monorepo** : Non (client/ et server/ séparés)
- **Build** : Vite (frontend), tsc (backend)
- **Testing** : Jest + React Testing Library
- **Lint** : ESLint + Prettier
- **Git Hooks** : Husky + lint-staged

## 📁 Structure du Projet

```
brx.ma/
├── client/                          # Frontend React + TypeScript
│   ├── public/
│   ├── src/
│   │   ├── components/              # Composants réutilisables
│   │   │   ├── charts/              # TradingView charts
│   │   │   ├── common/              # Buttons, Cards, etc.
│   │   │   ├── layout/              # Header, Sidebar, Footer
│   │   │   └── portfolio/           # Portfolio components
│   │   ├── pages/                   # Pages de l'application
│   │   │   ├── Home/
│   │   │   ├── Markets/
│   │   │   ├── StockDetail/
│   │   │   ├── Crypto/
│   │   │   ├── Portfolio/
│   │   │   └── Auth/
│   │   ├── services/                # API clients
│   │   │   ├── api.ts               # Axios config
│   │   │   ├── stocksAPI.ts
│   │   │   ├── cryptoAPI.ts
│   │   │   └── portfolioAPI.ts
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useStocks.ts
│   │   │   ├── useCrypto.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── useAuth.ts
│   │   ├── store/                   # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── portfolioStore.ts
│   │   │   └── themeStore.ts
│   │   ├── types/                   # TypeScript types
│   │   ├── utils/                   # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                          # Backend Node.js + TypeScript
│   ├── src/
│   │   ├── config/                  # Configuration
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── env.ts
│   │   ├── controllers/             # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── stocks.controller.ts
│   │   │   ├── crypto.controller.ts
│   │   │   └── portfolio.controller.ts
│   │   ├── services/                # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── stocks.service.ts
│   │   │   ├── crypto.service.ts
│   │   │   ├── bvc.service.ts       # Bourse Casa
│   │   │   └── portfolio.service.ts
│   │   ├── models/                  # Prisma models
│   │   ├── routes/                  # Express routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── stocks.routes.ts
│   │   │   ├── crypto.routes.ts
│   │   │   └── portfolio.routes.ts
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── websocket/               # WebSocket handlers
│   │   │   ├── index.ts
│   │   │   ├── crypto.ws.ts
│   │   │   └── stocks.ws.ts
│   │   ├── utils/                   # Utilities
│   │   │   ├── logger.ts
│   │   │   └── errors.ts
│   │   ├── types/                   # TypeScript types
│   │   ├── validators/              # Zod schemas
│   │   └── server.ts                # Entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── scraper/                         # Python BVCscrap microservice
│   ├── app.py                       # Flask API
│   ├── bvc_wrapper.py               # BVCscrap wrapper
│   ├── requirements.txt
│   └── README.md
│
├── docs/                            # Documentation
├── .gitignore
├── ARCHITECTURE.md                  # Ce fichier
├── README.md
└── ROADMAP.md
```

## 🔄 Architecture des Données

### Base de données PostgreSQL

```prisma
// Prisma Schema

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
  user        User              @relation(fields: [userId], references: [id])
  name        String
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  positions   PortfolioPosition[]
}

model PortfolioPosition {
  id            String      @id @default(uuid())
  portfolioId   String
  portfolio     Portfolio   @relation(fields: [portfolioId], references: [id])
  symbol        String      // ATW, BCP, BTC, etc.
  type          String      // STOCK, CRYPTO, OPCVM
  quantity      Float
  purchasePrice Float
  purchaseDate  DateTime
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Stock {
  symbol        String      @id
  name          String
  sector        String?
  market        String      // BVC, CRYPTO
  lastPrice     Float?
  lastUpdate    DateTime?
  createdAt     DateTime    @default(now())
}

model StockPrice {
  id          String      @id @default(uuid())
  symbol      String
  open        Float
  high        Float
  low         Float
  close       Float
  volume      Float
  timestamp   DateTime
  createdAt   DateTime    @default(now())

  @@index([symbol, timestamp])
}
```

### Cache Redis

```typescript
// Structure du cache Redis
{
  // Données bourse (TTL: 15 minutes)
  "stock:ATW:latest": { price, change, volume, ... },
  "stock:BCP:latest": { ... },

  // Données crypto (TTL: 1 seconde)
  "crypto:BTC:latest": { price, change, volume, ... },

  // Historique (TTL: 1 heure)
  "stock:ATW:history:1d": [...],
  "crypto:BTC:history:1h": [...],
}
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        # Créer un compte
POST   /api/auth/login           # Se connecter
POST   /api/auth/logout          # Se déconnecter
GET    /api/auth/me              # Profil utilisateur
```

### Stocks (Bourse de Casablanca)
```
GET    /api/stocks               # Liste des actions
GET    /api/stocks/:symbol       # Détails d'une action
GET    /api/stocks/:symbol/history?interval=1d&from=...&to=...
GET    /api/stocks/sectors       # Secteurs
GET    /api/stocks/indices       # MASI, MADEX, etc.
```

### Crypto
```
GET    /api/crypto               # Liste des cryptos
GET    /api/crypto/:symbol       # Détails d'une crypto
GET    /api/crypto/:symbol/history?interval=1h&from=...&to=...
GET    /api/crypto/trending      # Top gainers/losers
```

### Portfolio
```
GET    /api/portfolio            # Mes portfolios
POST   /api/portfolio            # Créer un portfolio
GET    /api/portfolio/:id        # Détails d'un portfolio
PUT    /api/portfolio/:id        # Modifier un portfolio
DELETE /api/portfolio/:id        # Supprimer un portfolio
POST   /api/portfolio/:id/positions    # Ajouter une position
PUT    /api/portfolio/:id/positions/:posId  # Modifier position
DELETE /api/portfolio/:id/positions/:posId  # Supprimer position
GET    /api/portfolio/:id/summary      # Résumé (P&L, etc.)
```

### WebSocket Events
```
// Client -> Server
subscribe:stock:ATW
subscribe:crypto:BTC
unsubscribe:stock:ATW

// Server -> Client
stock:ATW:update { price, change, volume, timestamp }
crypto:BTC:update { price, change, volume, timestamp }
portfolio:update { totalValue, pnl, positions }
```

## 🔄 Flux de Données

### 1. Données Bourse de Casablanca
```
BVCscrap (Python)
  ↓ (HTTP API)
Node.js Service
  ↓ (PostgreSQL)
Database
  ↓ (Redis cache 15min)
API Endpoint
  ↓ (WebSocket)
Frontend
```

### 2. Données Crypto
```
CoinGecko API
  ↓ (HTTP)
Node.js Service
  ↓ (Redis cache 1s)
API Endpoint
  ↓ (WebSocket)
Frontend
```

### 3. Portfolio Tracking
```
User Input (Frontend)
  ↓ (REST API)
Portfolio Service
  ↓ (PostgreSQL)
Database
  ↓ (Real-time price data)
P&L Calculation
  ↓ (WebSocket)
Frontend Update
```

## 🔒 Sécurité

- **JWT** : Access tokens (15min) + Refresh tokens (7 jours)
- **bcrypt** : Hash des mots de passe (10 rounds)
- **Helmet** : Security headers
- **CORS** : Whitelist des origines
- **Rate Limiting** : 100 req/min par IP
- **Input Validation** : Zod schemas
- **SQL Injection** : Prisma (parameterized queries)
- **XSS** : React (auto-escape)

## 🚀 Déploiement

### Phase MVP
- **Frontend** : Vercel (gratuit)
- **Backend** : Railway / Render (hobby tier ~$5/mois)
- **Database** : Railway PostgreSQL (gratuit)
- **Redis** : Upstash (gratuit jusqu'à 10K req/jour)
- **BVCscrap** : Railway Python (hobby tier ~$5/mois)

### Phase Production
- **Frontend** : Vercel Pro ($20/mois)
- **Backend** : Railway / DigitalOcean ($20-50/mois)
- **Database** : Railway PostgreSQL ($10-20/mois)
- **Redis** : Upstash Pay-as-you-go ($10-30/mois)
- **CDN** : Cloudflare (gratuit)
- **Monitoring** : Sentry (gratuit tier)

## 📊 Métriques de Performance

### Objectifs MVP
- **Page Load** : < 2s (LCP)
- **API Response** : < 200ms (p95)
- **WebSocket Latency** : < 100ms
- **Uptime** : > 99%

### Optimisations
- Redis cache pour données fréquentes
- React Query pour cache client
- Lazy loading des composants
- Code splitting par route
- Image optimization (WebP)
- Compression Gzip/Brotli

## 🧪 Tests

### Frontend
- **Unit** : Jest + React Testing Library
- **E2E** : Playwright (optionnel MVP)
- **Coverage** : > 70%

### Backend
- **Unit** : Jest
- **Integration** : Supertest
- **Coverage** : > 80%

## 📈 Roadmap MVP (8 semaines)

### Semaine 1-2 : Infrastructure
- [ ] Setup TypeScript (client + server)
- [ ] Configuration Prisma + PostgreSQL
- [ ] Configuration Redis
- [ ] Setup TailwindCSS + DaisyUI
- [ ] Architecture de base

### Semaine 3-4 : Bourse de Casablanca
- [ ] Test BVCscrap
- [ ] Microservice Python Flask
- [ ] API endpoints stocks
- [ ] Cache Redis
- [ ] TradingView Lightweight Charts

### Semaine 5-6 : Crypto + Temps Réel
- [ ] Intégration CoinGecko API
- [ ] WebSocket setup
- [ ] Temps réel crypto (1s)
- [ ] Temps réel bourse (15min)
- [ ] Charts interactifs

### Semaine 7-8 : Authentification + Portfolio
- [ ] JWT authentication
- [ ] User registration/login
- [ ] Portfolio CRUD
- [ ] P&L tracking temps réel
- [ ] Tests + Déploiement

## 💡 Inspirations

- **OpenAlgo** : Architecture WebSocket, P&L tracking
- **Investing.com** : UI/UX, data presentation
- **TradingView** : Charts, technical analysis
- **Yahoo Finance** : Portfolio tracking

## 📚 Documentation

- [TradingView Lightweight Charts Docs](https://tradingview.github.io/lightweight-charts/)
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [Prisma Docs](https://www.prisma.io/docs)
- [Socket.io Docs](https://socket.io/docs/v4/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

---

**Version** : 1.0.0
**Date** : Novembre 2024
**Status** : 🚧 En développement
