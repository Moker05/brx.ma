# Guide de Test - Authentification BRX.MA

## Méthodes de test disponibles

### 1️⃣ REST Client (VSCode) - **RECOMMANDÉ**

La façon la plus simple et rapide!

**Installation:**
1. Installer l'extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) dans VSCode
2. Ouvrir le fichier `test-auth.http`
3. Cliquer sur "Send Request" au-dessus de chaque requête

**Avantages:**
- Les tokens sont automatiquement extraits et réutilisés
- Syntaxe simple et lisible
- Pas besoin d'outils externes
- Historique des requêtes

---

### 2️⃣ Script Batch Automatique (Windows)

Exécuter tous les tests en une seule commande!

```bash
cd server
test-auth.bat
```

Ce script teste automatiquement:
1. Login
2. Get Current User
3. Register
4. Forgot Password
5. Logout

---

### 3️⃣ Postman Collection

Importer la collection dans Postman pour une interface graphique complète.

**Installation:**
1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner `BRX-Auth.postman_collection.json`
4. Utiliser la collection!

**Avantages:**
- Interface graphique
- Tests automatiques
- Variables d'environnement
- Scripts de pré/post-requête

---

### 4️⃣ cURL (Ligne de commande)

Pour les tests manuels rapides.

Voir le fichier `test-auth-commands.md` pour toutes les commandes.

**Exemple rapide:**

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d @test-login.json

# Get Current User (remplacer YOUR_TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Comptes de test disponibles

### 🧪 Test User (Portefeuille vide)
```
Email:    test@brx.ma
Password: Password123!
Wallet:   100,000 MAD
Verified: ✅
```

### 🎯 Demo User (Avec position BTC)
```
Email:    demo@brx.ma
Password: Password123!
Wallet:   550,000 MAD
Position: 0.5 BTC @ 900,000 MAD
Total:    1,000,000 MAD
Verified: ✅
```

---

## Routes d'authentification disponibles

| Route | Méthode | Description | Rate Limit |
|-------|---------|-------------|------------|
| `/api/auth/register` | POST | Créer un compte | 5 req/15min |
| `/api/auth/login` | POST | Se connecter | 5 req/15min |
| `/api/auth/me` | GET | Info utilisateur | - |
| `/api/auth/refresh` | POST | Rafraîchir le token | - |
| `/api/auth/logout` | POST | Se déconnecter | - |
| `/api/auth/forgot-password` | POST | Demander reset password | 3 req/1h |
| `/api/auth/reset-password` | POST | Réinitialiser password | 5 req/15min |
| `/api/auth/verify-email` | POST | Vérifier l'email | - |

---

## Exemples de réponses

### ✅ Login réussi
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "e66c6197-7c94-444b-a8e8-5d9c45cab268",
      "email": "test@brx.ma",
      "name": "Test User"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### ✅ Get Current User
```json
{
  "success": true,
  "data": {
    "id": "e66c6197-7c94-444b-a8e8-5d9c45cab268",
    "email": "test@brx.ma",
    "name": "Test User",
    "emailVerified": true,
    "createdAt": "2025-12-07T19:35:18.164Z",
    "updatedAt": "2025-12-07T19:35:18.164Z"
  }
}
```

### ❌ Erreur - Credentials invalides
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

### ❌ Erreur - Rate limit dépassé
```json
{
  "success": false,
  "message": "Trop de tentatives. Veuillez réessayer dans 15 minutes."
}
```

### ❌ Erreur - Token expiré
```json
{
  "success": false,
  "message": "Token invalide ou expiré. Veuillez vous reconnecter."
}
```

---

## Tester le Rate Limiter

Pour vérifier que la protection contre le brute force fonctionne:

**Méthode 1: Script automatique**
```bash
# Windows
for /L %i in (1,1,6) do curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"fake@test.com\",\"password\":\"wrong\"}"
```

**Résultat attendu:**
- Tentatives 1-5: "Email ou mot de passe incorrect"
- Tentative 6+: "Trop de tentatives. Veuillez réessayer dans 15 minutes."

---

## Tester les tokens de vérification

### Forgot Password
```bash
# 1. Demander un reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@brx.ma\"}"

# 2. Copier le token depuis les logs du serveur
# Chercher: "Password reset token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# 3. Réinitialiser le password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"PASTE_TOKEN_HERE\",\"password\":\"NewPassword123!\"}"
```

### Verify Email
```bash
# 1. Créer un nouveau compte (génère automatiquement un token)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"verify@brx.ma\",\"password\":\"Password123!\",\"name\":\"To Verify\"}"

# 2. Copier le token depuis les logs
# Chercher: "Email verification token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# 3. Vérifier l'email
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"PASTE_TOKEN_HERE\"}"
```

---

## Debugging

### Problème: "Cannot find module"
```bash
cd server
npm install
```

### Problème: "Connection refused"
```bash
# Vérifier que le serveur tourne
curl http://localhost:5000/health

# Si non, démarrer le serveur
npm run dev
```

### Problème: "Database error"
```bash
# Régénérer Prisma Client
npx prisma generate

# Re-seed la base
npm run prisma:seed
```

### Voir les logs du serveur
Les tokens de vérification et reset password sont affichés dans les logs:
```
Console du serveur (où npm run dev tourne)
```

---

## Fichiers de test créés

- `test-auth.http` - Tests REST Client (VSCode)
- `test-auth.bat` - Script automatique Windows
- `test-auth-commands.md` - Commandes cURL
- `BRX-Auth.postman_collection.json` - Collection Postman
- `test-login.json` - Données de login test
- `README-AUTH-TESTS.md` - Ce fichier

---

## Configuration JWT

Les tokens ont les durées suivantes (configurables dans `.env`):

- **Access Token:** 15 minutes (`JWT_ACCESS_EXPIRES_IN=15m`)
- **Refresh Token:** 30 jours (`JWT_REFRESH_EXPIRES_IN=30d`)
- **Verification Token:** 24 heures
- **Reset Password Token:** 1 heure

---

## Sécurité implémentée

✅ Hashing bcrypt (12 rounds)
✅ JWT avec signature HMAC-SHA256
✅ Refresh tokens persistés en DB
✅ Rate limiting (5 tentatives/15min pour login)
✅ Rate limiting strict (3 tentatives/1h pour reset password)
✅ HttpOnly cookies pour refresh tokens
✅ Tokens à usage unique (verify/reset)
✅ Révocation automatique des refresh tokens au logout
✅ Pas de fuite d'informations (messages d'erreur génériques)

---

## Support

En cas de problème:
1. Vérifier que le serveur tourne (`npm run dev`)
2. Vérifier les logs du serveur
3. Consulter `INTEGRATION_AUTH_PROMPT.md` pour la documentation complète
4. Re-seed la base si nécessaire (`npm run prisma:seed`)
