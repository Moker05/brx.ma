# 🐍 BVCscrap Microservice

Microservice Python Flask pour récupérer les données de la Bourse de Casablanca via la bibliothèque BVCscrap.

## 📋 Prérequis

- Python 3.8+
- pip

## 🚀 Installation

### 1. Installer Python

**Windows:**
```bash
# Télécharger depuis https://www.python.org/downloads/
# Ou via Microsoft Store
# Ou via chocolatey:
choco install python

# Ou via winget:
winget install Python.Python.3.12
```

**Vérifier l'installation:**
```bash
python --version
pip --version
```

### 2. Créer un environnement virtuel

```bash
cd scraper
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

## 📦 Dépendances

- **Flask** : Framework web léger
- **Flask-CORS** : Support CORS
- **BVCscrap** : Bibliothèque pour scraper la Bourse de Casablanca
- **python-dotenv** : Gestion des variables d'environnement

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### Liste des actions
```
GET /api/stocks
```

### Détails d'une action
```
GET /api/stocks/:symbol
Exemple: /api/stocks/ATW
```

### Historique d'une action
```
GET /api/stocks/:symbol/history?start=YYYY-MM-DD&end=YYYY-MM-DD
Exemple: /api/stocks/ATW/history?start=2024-01-01&end=2024-11-26
```

### Données intraday
```
GET /api/stocks/:symbol/intraday
```

### Secteurs
```
GET /api/sectors
```

### Indices (MASI, MADEX)
```
GET /api/indices
```

## 🎯 Format des réponses

### Stock Detail
```json
{
  "symbol": "ATW",
  "name": "ATTIJARIWAFA BANK",
  "price": 485.50,
  "change": 2.35,
  "changePercent": 0.49,
  "volume": 125430,
  "sector": "Banques",
  "open": 483.15,
  "high": 486.00,
  "low": 482.50,
  "previousClose": 483.15,
  "timestamp": "2024-11-26T15:30:00Z"
}
```

### Historical Data (OHLCV)
```json
{
  "symbol": "ATW",
  "data": [
    {
      "date": "2024-11-26",
      "open": 483.15,
      "high": 486.00,
      "low": 482.50,
      "close": 485.50,
      "volume": 125430
    }
  ]
}
```

## 🔧 Configuration

Créer un fichier `.env` :

```env
FLASK_ENV=development
FLASK_PORT=5001
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
CACHE_TTL=900  # 15 minutes en secondes
```

## 🚀 Lancement

```bash
# Development
python app.py

# Production (avec gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

Le service sera accessible sur `http://localhost:5001`

## 📊 Architecture

```
scraper/
├── app.py              # Point d'entrée Flask
├── bvc_wrapper.py      # Wrapper pour BVCscrap
├── requirements.txt    # Dépendances Python
├── .env               # Variables d'environnement
└── README.md          # Ce fichier
```

## 🧪 Tests

```bash
# Tester un endpoint
curl http://localhost:5001/health
curl http://localhost:5001/api/stocks/ATW
```

## ⚠️ Notes importantes

1. **BVCscrap est archivé** (Sept 2024) - peut cesser de fonctionner si les sites sources changent
2. **Rate limiting** : Respecter les limites des sites sources
3. **Cache** : Implémenter un cache pour éviter trop de requêtes
4. **Erreurs** : Les sites sources peuvent être indisponibles

## 🔄 Mise à jour de BVCscrap

Si BVCscrap ne fonctionne plus :

```bash
# Option 1: Forker et maintenir vous-même
git clone https://github.com/AmineAndam04/BVCscrap
cd BVCscrap
# Faire vos modifications
pip install -e .

# Option 2: Construire votre propre scraper
# Voir bvc_wrapper.py pour un exemple
```

## 🌐 Déploiement

### Railway
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login et deploy
railway login
railway init
railway up
```

### Render
1. Connecter votre repo GitHub
2. Créer un nouveau Web Service
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

### Docker
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "app:app"]
```

## 📈 Monitoring

- **Logs** : Winston pour Node.js, Python logging
- **Uptime** : UptimeRobot (gratuit)
- **Errors** : Sentry (gratuit tier)

## 🤝 Support

Si vous rencontrez des problèmes avec BVCscrap :
1. Vérifier que le site source (LeBoursier.ma, Bourse de Casablanca) est accessible
2. Vérifier la structure HTML du site (peut avoir changé)
3. Consulter les issues GitHub de BVCscrap
4. Envisager de construire votre propre scraper

## 📚 Ressources

- [BVCscrap GitHub](https://github.com/AmineAndam04/BVCscrap)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Bourse de Casablanca](https://www.casablanca-bourse.com/)
- [LeBoursier.ma](https://www.leboursier.ma/)
