# BRX.MA - Frontend React + TypeScript

Plateforme d'information financière pour la Bourse de Casablanca et les crypto-monnaies.

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

## 🏗️ Stack Technique

- **Framework** : React 18 + TypeScript
- **Build Tool** : Vite
- **UI Framework** : TailwindCSS + DaisyUI
- **Charts** : TradingView Lightweight Charts
- **State Management** : Zustand
- **HTTP Client** : Axios + React Query
- **Router** : React Router v6
- **Icons** : React Icons

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── layout/         # Header, Sidebar, Layout
│   ├── charts/         # TradingChart (TradingView)
│   ├── common/         # Composants communs
│   └── portfolio/      # Composants portfolio
├── pages/              # Pages de l'application
│   ├── Home/          # Dashboard principal avec chart
│   ├── Markets/       # Liste des marchés
│   ├── Crypto/        # Crypto-monnaies
│   ├── Portfolio/     # Portfolio utilisateur
│   └── Auth/          # Authentication
├── services/           # API clients
├── hooks/              # Custom React Hooks
├── store/              # Zustand stores
├── types/              # TypeScript types
└── utils/              # Utilitaires
```

## ✅ Fonctionnalités Actuelles

- ✅ Layout responsive (Header + Sidebar)
- ✅ Navigation React Router
- ✅ Graphiques TradingView (mock data)
- ✅ Dashboard avec indices du marché
- ✅ Thème clair/sombre
- ✅ Menu mobile responsive

## 🎯 Prochaines Étapes

- [ ] Connecter au backend Node.js (http://localhost:5000)
- [ ] Connecter au microservice Python (http://localhost:5001)
- [ ] Intégrer vraies données crypto (CoinGecko API)
- [ ] Ajouter authentification
- [ ] Implémenter portfolio tracking
- [ ] WebSocket temps réel

## 🎨 Thèmes

L'application supporte les thèmes clair et sombre grâce à DaisyUI.
Utilisez le bouton dans le header pour basculer entre les thèmes.

## 📦 Scripts Disponibles

```bash
npm run dev        # Lancer en mode développement
npm run build      # Build production
npm run preview    # Preview du build
npm run lint       # Linter ESLint
```

## 🌐 API Endpoints (À venir)

### Backend Node.js (Port 5000)
```
GET  /api/stocks              # Liste des actions
GET  /api/stocks/:symbol      # Détails action
GET  /api/crypto              # Liste cryptos
GET  /api/portfolio           # Mon portfolio
```

### Microservice Python (Port 5001)
```
GET  /api/stocks              # Données BVC (mock)
GET  /api/stocks/:symbol      # Détails action BVC
GET  /api/indices             # MASI, MADEX
```

## 🔧 Configuration

### TailwindCSS
Configuration dans `tailwind.config.js` avec DaisyUI pour les composants UI.

### TypeScript
Configuration dans `tsconfig.json` avec les meilleures pratiques React.

### Vite
Configuration dans `vite.config.ts` pour un build optimisé.

## 📝 Notes

- Les données actuelles sont mock (fictives)
- L'intégration avec le backend est en cours
- Le microservice Python fonctionne mais BVCscrap est bloqué par Cloudflare

---

**Version** : 0.1.0
**Date** : 26 Novembre 2024
