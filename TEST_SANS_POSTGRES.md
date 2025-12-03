# 🚀 Test Rapide SANS PostgreSQL

Si vous n'avez pas encore installé PostgreSQL, vous pouvez tester avec SQLite immédiatement.

## Option 1 : Test avec SQLite (RAPIDE - 2 minutes)

### 1. Modifier la configuration

Ouvrir `server/.env` et remplacer :
```env
DATABASE_URL="file:./dev.db"
```

Ouvrir `server/prisma/schema.prisma` et remplacer la ligne 9 :
```prisma
datasource db {
  provider = "sqlite"
}
```

### 2. Lancer le serveur

```bash
cd server
npx prisma db push
npm run prisma:seed
npm run dev
```

### 3. Lancer le client

Dans un autre terminal :
```bash
cd client-new
npm run dev
```

### 4. Tester

Ouvrir http://localhost:5173/portfolio

✅ Vous devriez voir :
- Solde : 550,000 MAD
- Position : 0.5 BTC acheté le 01/12/2025

---

## Option 2 : Installation PostgreSQL (RECOMMANDÉ)

Suivre [SETUP_POSTGRESQL.md](SETUP_POSTGRESQL.md)

---

## Dépannage Rapide

### ERR_CONNECTION_REFUSED
**Cause :** Le serveur backend n'est pas démarré

**Solution :**
```bash
cd server
npm run dev
```

Vérifier que vous voyez :
```
🚀 Server running on port 5000
```

### Port 5000 occupé
```bash
# Tuer le processus
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Ou changer le port dans server/.env
PORT=5001
```

### Prisma errors
```bash
cd server
npm install
npx prisma generate
npx prisma db push
```
