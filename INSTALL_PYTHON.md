  # 🐍 Guide d'Installation Python pour Windows

## Option 1 : Microsoft Store (Recommandé - Plus Simple)

1. Ouvrir le **Microsoft Store**
2. Rechercher "Python 3.12"
3. Cliquer sur **Obtenir/Installer**
4. Attendre la fin de l'installation

## Option 2 : python.org (Installation Manuelle)

1. Aller sur [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Télécharger **Python 3.12.x** (dernière version)
3. Lancer l'installateur
4. ⚠️ **IMPORTANT** : Cocher **"Add Python to PATH"**
5. Cliquer sur "Install Now"

## Option 3 : Chocolatey

Si vous avez Chocolatey installé :
```bash
choco install python
```

## Vérification de l'installation

Ouvrir un **nouveau terminal** (PowerShell ou CMD) et taper :

```bash
python --version
```

Vous devriez voir quelque chose comme :
```
Python 3.12.0
```

Et pour pip :
```bash
pip --version
```

## Installation des dépendances du projet

Une fois Python installé :

```bash
# 1. Aller dans le dossier scraper
cd scraper

# 2. Créer un environnement virtuel
python -m venv venv

# 3. Activer l'environnement (Windows)
venv\Scripts\activate

# Votre terminal devrait maintenant montrer (venv) au début de la ligne

# 4. Installer les dépendances
pip install -r requirements.txt
```

## Test de BVCscrap

```bash
# Toujours dans le dossier scraper avec venv activé
python -c "from BVCscrap import BVC; print('BVCscrap fonctionne!')"
```

Si vous voyez "BVCscrap fonctionne!", c'est bon !

## Lancer le microservice

```bash
# Dans le dossier scraper avec venv activé
python app.py
```

Vous devriez voir :
```
╔══════════════════════════════════════╗
║  BVC Scraper Microservice Started   ║
╚══════════════════════════════════════╝

🌐 Server: http://localhost:5001
🏥 Health: http://localhost:5001/health
📊 API: http://localhost:5001/api/stocks
```

## Tester l'API

Ouvrir un navigateur et aller sur :
- http://localhost:5001/health
- http://localhost:5001/api/stocks
- http://localhost:5001/api/stocks/ATW

Ou avec curl :
```bash
curl http://localhost:5001/health
```

## Problèmes courants

### "python n'est pas reconnu"
- Réinstaller Python et cocher "Add to PATH"
- Ou utiliser Microsoft Store

### "BVCscrap not found"
```bash
pip install BVCscrap
```

### Port 5001 déjà utilisé
Modifier dans `scraper/.env` :
```env
FLASK_PORT=5002
```

## Désactiver l'environnement virtuel

Quand vous avez fini :
```bash
deactivate
```

## Prochaines étapes

Une fois Python et le microservice fonctionnent :
1. ✅ Tester les endpoints
2. ✅ Vérifier les données de la Bourse de Casablanca
3. → Migrer le frontend vers TypeScript
4. → Migrer le backend vers TypeScript + Prisma
5. → Intégrer TradingView Lightweight Charts
