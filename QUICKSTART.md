# 🚀 GUIDE DE DÉMARRAGE RAPIDE - BRX.MA

## ✅ PHASE 1 COMPLÉTÉE - Architecture & Setup Initial

Félicitations ! La Phase 1 est terminée. Voici ce qui a été créé :

### 📦 Structure du projet
```
brx.ma/
├── client/              ✅ Frontend React
├── server/              ✅ Backend Node.js/Express
├── README.md            ✅ Documentation principale
└── .gitignore           ✅ Configuration Git
```

---

## 🛠️ INSTALLATION COMPLÈTE

### 1️⃣ Installation de PostgreSQL

#### Sur Ubuntu/Debian :
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Sur macOS :
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Sur Windows :
Télécharger et installer depuis : https://www.postgresql.org/download/windows/

### 2️⃣ Configuration de la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans psql, exécuter :
CREATE DATABASE brx_db;
CREATE USER brx_user WITH ENCRYPTED PASSWORD 'VotreMotDePasse123!';
GRANT ALL PRIVILEGES ON DATABASE brx_db TO brx_user;
\c brx_db
GRANT ALL ON SCHEMA public TO brx_user;
\q
```

### 3️⃣ Installation du Backend

```bash
cd brx.ma/server

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos paramètres
nano .env  # ou code .env
```

**Fichier .env à configurer :**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brx_db
DB_USER=brx_user
DB_PASSWORD=VotreMotDePasse123!
JWT_SECRET=changez_cette_clé_secrète_en_production_123456789
CORS_ORIGIN=http://localhost:3000
```

### 4️⃣ Installation du Frontend

```bash
cd ../client

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Le fichier .env devrait contenir :
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 LANCEMENT DE L'APPLICATION

### Terminal 1 - Backend
```bash
cd brx.ma/server
npm run dev
```

**Résultat attendu :**
```
╔═══════════════════════════════════════╗
║   🚀 Serveur BRX.MA démarré           ║
║   📡 Port: 5000                        ║
║   🌍 Environnement: development        ║
╚═══════════════════════════════════════╝
```

### Terminal 2 - Frontend
```bash
cd brx.ma/client
npm start
```

**Résultat attendu :**
- L'application s'ouvre automatiquement dans votre navigateur
- URL : `http://localhost:3000`

---

## 🧪 TESTS DE VÉRIFICATION

### Test 1 : Backend fonctionne
Ouvrir dans le navigateur ou avec curl :
```bash
curl http://localhost:5000/
```

**Réponse attendue :**
```json
{
  "message": "Bienvenue sur l'API BRX.MA",
  "version": "1.0.0",
  "status": "running"
}
```

### Test 2 : Health check
```bash
curl http://localhost:5000/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "uptime": 123.45
}
```

### Test 3 : Frontend accessible
Ouvrir `http://localhost:3000` dans le navigateur

**Résultat attendu :**
- Page d'accueil BRX.MA affichée
- Header avec logo "BRX.MA"
- 3 cartes de fonctionnalités
- Footer

---

## 📋 CHECKLIST PHASE 1

- [x] Structure des dossiers créée
- [x] Configuration package.json (backend et frontend)
- [x] Configuration PostgreSQL
- [x] Variables d'environnement configurées
- [x] Serveur Express de base fonctionnel
- [x] Application React de base fonctionnelle
- [x] Documentation (README) complète
- [x] .gitignore configuré

---

## 🎯 PROCHAINE ÉTAPE : PHASE 2

La Phase 2 consistera à créer l'interface utilisateur complète :
- Header avec navigation
- Sidebar avec liste des actions
- Zone principale pour les graphiques
- Design responsive
- Mode sombre/clair

---

## 🐛 DÉPANNAGE

### Problème : Port 5000 déjà utilisé
**Solution :** Modifier le PORT dans `server/.env`
```env
PORT=5001
```

### Problème : PostgreSQL ne se connecte pas
**Solution :** Vérifier que PostgreSQL est démarré
```bash
sudo systemctl status postgresql  # Linux
brew services list                # macOS
```

### Problème : npm install échoue
**Solution :** Vider le cache npm
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problème : React ne démarre pas
**Solution :** Vérifier la version de Node.js
```bash
node --version  # Doit être >= 18.x
```

---

## 📚 RESSOURCES

- **Documentation React** : https://react.dev
- **Express.js** : https://expressjs.com
- **PostgreSQL** : https://www.postgresql.org/docs/
- **Sequelize** : https://sequelize.org/docs/
- **TradingView Lightweight Charts** : https://tradingview.github.io/lightweight-charts/

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez des problèmes :
1. Vérifier les logs dans les terminaux
2. Consulter les README dans `client/` et `server/`
3. Vérifier que toutes les dépendances sont installées
4. S'assurer que PostgreSQL est actif

---

**🎉 Bravo ! La Phase 1 est complète. Prêt pour la Phase 2 ?**
