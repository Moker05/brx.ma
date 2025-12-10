# Prompt d'Intégration Complète - Système d'Authentification BRX.MA

## Contexte
Le service d'authentification (`auth.service.ts`) a été développé avec toutes les fonctionnalités nécessaires (register, login, refresh tokens, verify email, reset password), mais le controller (`auth.controller.ts`) utilise encore un stockage in-memory temporaire et n'utilise pas ce service.

## Objectif
Intégrer complètement le système d'authentification en connectant le controller au service, en ajoutant toutes les routes manquantes, et en configurant les middlewares de sécurité.

---

## Tâche 1: Refactoriser `auth.controller.ts`

### Fichier: `server/src/controllers/auth.controller.ts`

**Actions requises:**
1. Supprimer complètement le code in-memory (lignes 8-18)
2. Importer les fonctions du service:
   ```typescript
   import {
     registerUser,
     authenticateUser,
     generateTokensForUser,
     saveRefreshToken,
     revokeRefreshToken,
     revokeAllRefreshTokensForUser,
     verifyAndConsumeRefreshToken,
     createPasswordResetToken,
     consumeAuthToken
   } from '../services/auth.service';
   ```

3. **Réécrire la fonction `register`:**
   - Utiliser `registerUser(email, password, name)`
   - Générer les tokens avec `generateTokensForUser(user)`
   - Sauvegarder le refresh token avec `saveRefreshToken(userId, refreshToken)`
   - Retourner `accessToken` et `refreshToken` (+ user info)
   - Gérer les erreurs proprement (email déjà utilisé, etc.)

4. **Réécrire la fonction `login`:**
   - Utiliser `authenticateUser(email, password)`
   - Générer les tokens avec `generateTokensForUser(user)`
   - Sauvegarder le refresh token
   - Retourner `accessToken` et `refreshToken`
   - Gérer les erreurs (credentials invalides)

5. **Réécrire `getCurrentUser`:**
   - Utiliser `prisma.user.findUnique()` pour récupérer l'user depuis la DB
   - Retourner les infos utilisateur sans le password

6. **Réécrire `logout`:**
   - Récupérer le refresh token depuis le cookie ou le body
   - Utiliser `revokeRefreshToken(token)` pour invalider le token
   - Retourner success message

7. **Ajouter les nouvelles fonctions:**

   ```typescript
   /**
    * Refresh access token
    * POST /api/auth/refresh
    */
   export const refreshToken = async (req: Request, res: Response): Promise<void> => {
     // Récupérer refresh token depuis cookie httpOnly ou body
     // Vérifier avec verifyAndConsumeRefreshToken(token)
     // Générer nouveaux tokens
     // Révoquer l'ancien refresh token
     // Sauvegarder le nouveau refresh token
     // Retourner les nouveaux tokens
   };

   /**
    * Request password reset
    * POST /api/auth/forgot-password
    */
   export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
     // Valider l'email
     // Utiliser createPasswordResetToken(email)
     // Retourner success (même si email n'existe pas - sécurité)
   };

   /**
    * Reset password with token
    * POST /api/auth/reset-password
    */
   export const resetPassword = async (req: Request, res: Response): Promise<void> => {
     // Récupérer token et newPassword du body
     // Utiliser consumeAuthToken(token, 'RESET')
     // Hash le nouveau password avec bcrypt
     // Mettre à jour le password dans la DB
     // Révoquer tous les refresh tokens de l'user
     // Retourner success
   };

   /**
    * Verify email with token
    * POST /api/auth/verify-email
    */
   export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
     // Récupérer token du body
     // Utiliser consumeAuthToken(token, 'VERIFY')
     // Marquer l'email comme vérifié (ajouter champ emailVerified dans User model)
     // Retourner success
   };
   ```

---

## Tâche 2: Mettre à jour les routes

### Fichier: `server/src/routes/auth.routes.ts`

**Actions requises:**
1. Importer les nouvelles fonctions du controller:
   ```typescript
   import {
     register,
     login,
     getCurrentUser,
     logout,
     refreshToken,
     forgotPassword,
     resetPassword,
     verifyEmail
   } from '../controllers/auth.controller';
   ```

2. Ajouter les nouvelles routes:
   ```typescript
   /**
    * @route   POST /api/auth/refresh
    * @desc    Refresh access token
    * @access  Public (requires refresh token)
    */
   router.post('/refresh', refreshToken);

   /**
    * @route   POST /api/auth/forgot-password
    * @desc    Request password reset email
    * @access  Public
    */
   router.post('/forgot-password', forgotPassword);

   /**
    * @route   POST /api/auth/reset-password
    * @desc    Reset password with token
    * @access  Public
    */
   router.post('/reset-password', resetPassword);

   /**
    * @route   POST /api/auth/verify-email
    * @desc    Verify email with token
    * @access  Public
    */
   router.post('/verify-email', verifyEmail);
   ```

3. Appliquer le rate limiter sur toutes les routes publiques (voir Tâche 4)

---

## Tâche 3: Ajouter les variables d'environnement manquantes

### Fichier: `server/.env`

**Actions requises:**
Ajouter ces variables à la fin du fichier `.env`:

```env
# JWT Tokens Configuration
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Password Hashing
BCRYPT_ROUNDS=12

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply.brx.ma@gmail.com
SMTP_PASSWORD=your_app_specific_password_here
EMAIL_FROM=noreply@brx.ma

# Application URL (for email links)
APP_URL=http://localhost:5173

# Session/Cookie Configuration
COOKIE_SECRET=brx_cookie_secret_development_change_in_production
```

**Notes importantes:**
- Pour `SMTP_USER` et `SMTP_PASSWORD`: Créer un compte Gmail test pour le développement
- Générer un "App Password" depuis Google Account Security
- En production, utiliser un vrai service SMTP (SendGrid, Mailgun, AWS SES)

---

## Tâche 4: Créer le middleware Rate Limiter

### Nouveau fichier: `server/src/middleware/rateLimiter.middleware.ts`

**Actions requises:**
Créer ce fichier avec le contenu suivant:

```typescript
import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication routes
 * Prevents brute force attacks
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window per IP
  message: {
    success: false,
    message: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for general API routes
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for password reset
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour per IP
  message: {
    success: false,
    message: 'Trop de demandes de réinitialisation. Veuillez réessayer dans 1 heure.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Installer la dépendance:**
```bash
npm install express-rate-limit
npm install --save-dev @types/express-rate-limit
```

**Appliquer dans `auth.routes.ts`:**
```typescript
import { authRateLimiter, passwordResetRateLimiter } from '../middleware/rateLimiter.middleware';

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/forgot-password', passwordResetRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
```

---

## Tâche 5: Mettre à jour le Prisma Schema

### Fichier: `server/prisma/schema.prisma`

**Actions requises:**
Ajouter le champ `emailVerified` au modèle User:

```prisma
model User {
  id            String      @id @default(uuid())
  email         String      @unique
  password      String      // bcrypt hashed
  name          String?
  emailVerified Boolean     @default(false)  // ← AJOUTER CETTE LIGNE
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relations existantes...
  portfolios    Portfolio[]
  watchlists    Watchlist[]
  virtualWallet VirtualWallet?
  profile       UserProfile?
  ratingsGiven  UserRating[] @relation("RatingsGiven")
  refreshTokens RefreshToken[]  // ← AJOUTER CETTE LIGNE
  authTokens    AuthToken[]     // ← AJOUTER CETTE LIGNE

  @@map("users")
}
```

**Générer la migration:**
```bash
npx prisma migrate dev --name add-email-verification
```

---

## Tâche 6: Ajouter le support des cookies HttpOnly

### Fichier: `server/src/index.ts`

**Actions requises:**
1. Installer `cookie-parser`:
   ```bash
   npm install cookie-parser
   npm install --save-dev @types/cookie-parser
   ```

2. Importer et utiliser le middleware:
   ```typescript
   import cookieParser from 'cookie-parser';

   app.use(cookieParser(process.env.COOKIE_SECRET));
   ```

3. Dans les controllers, utiliser les cookies pour les refresh tokens:
   ```typescript
   // Dans login et register:
   res.cookie('refreshToken', refreshToken, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'strict',
     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
   });

   // Dans logout:
   res.clearCookie('refreshToken');
   ```

---

## Tâche 7: Créer un script de test

### Nouveau fichier: `server/src/scripts/createTestUser.ts`

**Actions requises:**
Créer ce fichier pour faciliter la création d'utilisateurs de test:

```typescript
import { registerUser } from '../services/auth.service';
import { prisma } from '../utils/prisma';

async function createTestUser() {
  const testEmail = 'test@brx.ma';
  const testPassword = 'Test123456!';
  const testName = 'Test User';

  try {
    // Supprimer l'utilisateur test s'il existe déjà
    await prisma.user.delete({ where: { email: testEmail } }).catch(() => {});

    // Créer le nouvel utilisateur
    const user = await registerUser(testEmail, testPassword, testName);

    // Marquer l'email comme vérifié directement
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    console.log('👤 Name:', testName);
    console.log('✉️  Email verified: Yes');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
```

**Ajouter un script npm dans `package.json`:**
```json
"scripts": {
  "create-test-user": "ts-node src/scripts/createTestUser.ts"
}
```

**Exécuter:**
```bash
npm run create-test-user
```

---

## Tâche 8: Mettre à jour la validation

### Fichier: `server/src/utils/validation.ts`

**Actions requises:**
Ajouter les schémas de validation pour les nouvelles routes:

```typescript
import { z } from 'zod';

// Existants: registerSchema, loginSchema

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requis'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token requis'),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
```

---

## Tâche 9: Tests manuels

### Créer un fichier de tests REST

**Nouveau fichier: `server/tests/auth.http`**

```http
### Variables
@baseUrl = http://localhost:5000
@email = test@brx.ma
@password = Test123456!

### 1. Register
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}",
  "name": "Test User"
}

### 2. Login
# @name login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}"
}

### 3. Get Current User
@accessToken = {{login.response.body.data.token}}
GET {{baseUrl}}/api/auth/me
Authorization: Bearer {{accessToken}}

### 4. Refresh Token
@refreshToken = {{login.response.body.data.refreshToken}}
POST {{baseUrl}}/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}

### 5. Forgot Password
POST {{baseUrl}}/api/auth/forgot-password
Content-Type: application/json

{
  "email": "{{email}}"
}

### 6. Verify Email (use token from email)
POST {{baseUrl}}/api/auth/verify-email
Content-Type: application/json

{
  "token": "PASTE_TOKEN_FROM_EMAIL_HERE"
}

### 7. Reset Password (use token from email)
POST {{baseUrl}}/api/auth/reset-password
Content-Type: application/json

{
  "token": "PASTE_TOKEN_FROM_EMAIL_HERE",
  "password": "NewPassword123!"
}

### 8. Logout
POST {{baseUrl}}/api/auth/logout
Authorization: Bearer {{accessToken}}
```

---

## Checklist de vérification finale

Avant de considérer l'intégration comme complète, vérifier:

- [ ] Le controller utilise `auth.service.ts` (plus d'in-memory)
- [ ] Toutes les 8 routes fonctionnent (register, login, me, logout, refresh, forgot-password, reset-password, verify-email)
- [ ] Les refresh tokens sont stockés en DB et révoqués au logout
- [ ] Les emails de vérification et reset sont envoyés (vérifier les logs si SMTP non configuré)
- [ ] Le rate limiter bloque après trop de tentatives
- [ ] Les cookies httpOnly fonctionnent pour les refresh tokens
- [ ] Le champ `emailVerified` est bien mis à jour
- [ ] La migration Prisma a été exécutée
- [ ] L'utilisateur test peut se connecter
- [ ] Les erreurs sont bien gérées (messages clairs)
- [ ] Les tokens JWT sont valides et expirent correctement

---

## Ordre d'exécution recommandé

1. Tâche 5 (Prisma Schema + migration) - **COMMENCER ICI**
2. Tâche 3 (Variables d'environnement)
3. Tâche 4 (Rate limiter middleware)
4. Tâche 8 (Validation schemas)
5. Tâche 1 (Refactoriser controller) - **TÂCHE PRINCIPALE**
6. Tâche 2 (Mettre à jour routes)
7. Tâche 6 (Cookie parser)
8. Tâche 7 (Script de test user)
9. Tâche 9 (Tests manuels)

---

## Note finale

Cette intégration complète transformera le système d'authentification d'un POC in-memory en un système production-ready avec:
- ✅ Sécurité renforcée (rate limiting, httpOnly cookies, bcrypt)
- ✅ Gestion complète du cycle de vie des tokens
- ✅ Vérification email et reset password
- ✅ Persistance en base de données
- ✅ Gestion d'erreurs robuste

Temps estimé: 2-3 heures de développement + tests
