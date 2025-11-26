# BRX.MA - Frontend React

Application React pour la plateforme BRX.MA - Bourse de Casablanca

## 🚀 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configuration

Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

Éditer `.env` si nécessaire :
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Lancer l'application

#### Mode développement
```bash
npm start
```
L'application s'ouvrira automatiquement sur `http://localhost:3000`

#### Build production
```bash
npm run build
```
Les fichiers de production seront dans le dossier `build/`

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Chart/          # Composant graphique TradingView
│   ├── Header/         # En-tête de l'application
│   ├── Sidebar/        # Barre latérale
│   ├── StockCard/      # Carte d'affichage d'action
│   └── ...
├── pages/              # Pages de l'application
│   ├── Home/           # Page d'accueil
│   ├── StockDetail/    # Détails d'une action
│   └── Watchlist/      # Liste de favoris
├── services/           # Services API
│   └── api.js          # Configuration Axios
├── hooks/              # Custom Hooks
│   ├── useStocks.js    # Hook pour les actions
│   └── useChart.js     # Hook pour les graphiques
├── context/            # Context API
│   └── ThemeContext.js # Thème clair/sombre
├── utils/              # Fonctions utilitaires
│   ├── formatters.js   # Formatage de données
│   └── helpers.js      # Fonctions helper
├── assets/             # Images, icônes, etc.
├── styles/             # Styles globaux
├── App.js              # Composant principal
├── App.css             # Styles de l'App
├── index.js            # Point d'entrée
└── index.css           # Styles globaux
```

## 🎨 Composants (à venir dans Phase 2)

### Chart Component
Composant pour afficher les graphiques TradingView Lightweight Charts
```jsx
import Chart from './components/Chart/Chart';

<Chart 
  symbol="ATW" 
  interval="1D"
  height={400}
/>
```

### StockCard Component
Carte pour afficher les informations d'une action
```jsx
import StockCard from './components/StockCard/StockCard';

<StockCard 
  symbol="ATW"
  name="Attijariwafa Bank"
  price={450.50}
  change={2.5}
  changePercent={0.56}
/>
```

## 🔧 Scripts disponibles

- `npm start` - Démarrer en mode développement
- `npm run build` - Build de production
- `npm test` - Lancer les tests
- `npm run eject` - Ejecter la configuration (irréversible)
- `npm run lint` - Vérifier le code
- `npm run lint:fix` - Corriger automatiquement

## 📦 Dépendances principales

- **React 18** - Bibliothèque UI
- **React Router** - Navigation
- **Lightweight Charts** - Graphiques financiers
- **Axios** - Client HTTP
- **React Query** - Gestion du cache et des requêtes

## 🎨 Design System

### Couleurs
- **Primary**: #1a73e8 (Bleu)
- **Success**: #00c853 (Vert - hausse)
- **Danger**: #ff1744 (Rouge - baisse)
- **Neutral**: #757575 (Gris)

### Typographie
- **Font**: Inter
- **Tailles**: 12px, 14px, 16px, 18px, 24px, 32px

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec coverage
npm test -- --coverage
```

## 🌐 Déploiement

### Netlify
```bash
npm run build
# Déployer le dossier build/
```

### Vercel
```bash
vercel --prod
```

## 📱 Progressive Web App (PWA)

L'application est configurée comme PWA et peut être installée sur mobile et desktop.

## 🔐 Variables d'environnement

- `REACT_APP_API_URL` - URL de l'API backend
- `REACT_APP_WS_URL` - URL WebSocket pour temps réel
- `REACT_APP_ENABLE_DARK_MODE` - Activer le mode sombre

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.
