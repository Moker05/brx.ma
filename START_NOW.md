# 🚀 Démarrage IMMÉDIAT (Sans Installation)

Le portefeuille va créer automatiquement les données de démo au premier lancement.

## 1. Démarrer le Serveur

```bash
cd server
npm run dev
```

Attendez de voir :
```
🚀 Server running on port 5000
```

## 2. Démarrer le Client

Dans un NOUVEAU terminal :
```bash
cd client-new
npm run dev
```

## 3. Tester

Ouvrir : http://localhost:5173/portfolio

Le serveur va automatiquement créer :
- ✅ Un wallet avec 50,000 MAD
- ✅ 3 positions de démo (BTC, ETH, ATW)

## Si Erreur "ERR_CONNECTION_REFUSED"

Le serveur n'est pas démarré. Relancer :
```bash
cd server
npm run dev
```

## Si Port 5000 Occupé

```bash
# Trouver et tuer le processus
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Ou changer le port dans server/.env
PORT=5001
```

C'est tout ! Pas besoin de PostgreSQL pour tester.
