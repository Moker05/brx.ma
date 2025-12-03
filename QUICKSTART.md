# 🚀 Guide de Démarrage Rapide - BRX.MA Portfolio

## ✅ Réparations Effectuées

Tous les problèmes du portefeuille ont été corrigés :

- ✅ **Prisma réactivé** - Base de données opérationnelle
- ✅ **Historique du portefeuille** - Snapshots automatiques après chaque transaction
- ✅ **Mise à jour des prix** - Rafraîchissement automatique toutes les 2 minutes
- ✅ **Gestion des transactions** - AddPosition crée maintenant des transactions et déduit le solde
- ✅ **Configuration PostgreSQL** - Migration de SQLite vers PostgreSQL

## 📋 Installation PostgreSQL

### Méthode 1 : Automatique (Recommandé)

Double-cliquez sur `INSTALL_POSTGRES_WINDOWS.bat` ou exécutez dans PowerShell:

```powershell
.\setup-database.ps1
```

### Méthode 2 : Manuelle

1. **Installer PostgreSQL**
   ```powershell
   winget install PostgreSQL.PostgreSQL
   ```

2. **Créer la base de données** (après installation, rouvrir PowerShell)
   ```powershell
   psql -U postgres
   ```

   Puis dans psql:
   ```sql
   CREATE DATABASE brx_db;
   CREATE USER brx_user WITH PASSWORD 'brx_admin';
   GRANT ALL PRIVILEGES ON DATABASE brx_db TO brx_user;
   \q
   ```

3. **Configurer Prisma**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev --name init
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
