# BRX.MA - Plateforme de Bourse de Casablanca

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📊 Description

BRX.MA est une plateforme web moderne pour suivre et analyser les actions de la Bourse de Casablanca en temps réel. Elle offre des graphiques interactifs, des données historiques et des outils d'analyse technique.

## 🚀 Technologies

### Frontend
- **React 18** - Framework UI
- **TradingView Lightweight Charts** - Graphiques financiers
- **Axios** - Client HTTP
- **React Router** - Navigation
- **CSS Modules / Styled Components** - Styling

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données
- **Sequelize** - ORM
- **Node-cron** - Tâches planifiées

## 📁 Structure du Projet

```
brx.ma/
├── client/                 # Application React (Frontend)
│   ├── public/            # Fichiers statiques
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── context/       # Context API
│   │   ├── utils/         # Utilitaires
│   │   ├── assets/        # Images, fonts, etc.
│   │   └── styles/        # Styles globaux
│   ├── package.json
│   └── README.md
│
├── server/                # API Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/        # Configuration (DB, etc.)
│   │   ├── controllers/   # Contrôleurs
│   │   ├── models/        # Modèles Sequelize
│   │   ├── routes/        # Routes API
│   │   ├── services/      # Services métier
│   │   ├── middleware/    # Middlewares Express
│   │   ├── utils/         # Utilitaires
│   │   └── scrapers/      # Scripts de scraping données
│   ├── tests/             # Tests unitaires et d'intégration
│   ├── package.json
│   └── README.md
│
├── docs/                  # Documentation
├── scripts/               # Scripts utilitaires
├── .gitignore
├── .env.example           # Exemple de variables d'environnement
└── README.md              # Ce fichier
```

## 🛠️ Installation

### Prérequis
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm ou yarn

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/brx.ma.git
cd brx.ma
```

### 2. Installer les dépendances

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Configuration de la base de données

Créer une base de données PostgreSQL :
```sql
CREATE DATABASE brx_db;
CREATE USER brx_user WITH PASSWORD 'votre_password';
GRANT ALL PRIVILEGES ON DATABASE brx_db TO brx_user;
```

### 4. Variables d'environnement

Copier les fichiers `.env.example` et les renommer en `.env` dans les dossiers `server/` et `client/`

#### server/.env
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brx_db
DB_USER=brx_user
DB_PASSWORD=votre_password
JWT_SECRET=votre_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

#### client/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Lancer l'application

#### Backend (Terminal 1)
```bash
cd server
npm run dev
```

#### Frontend (Terminal 2)
```bash
cd client
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📊 Fonctionnalités

### Phase 1 - MVP ✅
- [x] Architecture du projet
- [x] Configuration initiale
- [ ] Interface de base
- [ ] Intégration graphiques TradingView
- [ ] API REST basique
- [ ] Connexion PostgreSQL

### Phase 2 - Données temps réel
- [ ] Scraping données Bourse Casablanca
- [ ] WebSocket pour temps réel
- [ ] Cache Redis
- [ ] Mise à jour automatique

### Phase 3 - Fonctionnalités avancées
- [ ] Indicateurs techniques
- [ ] Alertes de prix
- [ ] Watchlist personnalisée
- [ ] Mode sombre/clair
- [ ] Export données

### Phase 4 - Déploiement
- [ ] Tests automatisés
- [ ] CI/CD Pipeline
- [ ] Déploiement production
- [ ] Monitoring

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
