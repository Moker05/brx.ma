# Commandes cURL pour tester l'authentification

## 1. LOGIN
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@brx.ma\",\"password\":\"Password123!\"}"
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "...",
      "email": "test@brx.ma",
      "name": "Test User"
    },
    "accessToken": "eyJhbGc..."
  }
}
```

**Copier le `accessToken` pour les requêtes suivantes**

---

## 2. REGISTER (Créer un nouveau compte)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"nouveau@brx.ma\",\"password\":\"Password123!\",\"name\":\"Nouvel Utilisateur\"}"
```

---

## 3. GET CURRENT USER (Remplacer YOUR_TOKEN)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Exemple avec un vrai token:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 4. REFRESH TOKEN
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

---

## 5. FORGOT PASSWORD
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@brx.ma\"}"
```

**Note:** Le token sera affiché dans les logs du serveur (console)

---

## 6. VERIFY EMAIL
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"TOKEN_FROM_LOGS\"}"
```

---

## 7. RESET PASSWORD
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"TOKEN_FROM_LOGS\",\"password\":\"NewPassword123!\"}"
```

---

## 8. LOGOUT
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

---

## Comptes de test disponibles

### Test User (portefeuille vide)
- **Email:** test@brx.ma
- **Password:** Password123!
- **Wallet:** 100,000 MAD

### Demo User (avec position BTC)
- **Email:** demo@brx.ma
- **Password:** Password123!
- **Wallet:** 550,000 MAD
- **Position:** 0.5 BTC @ 900,000 MAD

---

## Tester le Rate Limiter

Pour tester que le rate limiter fonctionne, exécuter 6 fois de suite:

```bash
# Répéter cette commande 6 fois rapidement
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"wrong@email.com\",\"password\":\"wrongpassword\"}"
```

**Après 5 tentatives, vous devriez voir:**
```json
{
  "success": false,
  "message": "Trop de tentatives. Veuillez réessayer dans 15 minutes."
}
```
