# 🤖 Prompts Copilot pour Production-Ready BRX.MA

**Objectif**: Rendre l'application prête pour la production en **qualité idéale**
**Nombre de prompts**: **12 prompts ultra-détaillés**
**Temps estimé**: 2-3 jours avec Copilot
**Ordre d'exécution**: Séquentiel (1 → 12)

---

## 📋 Vue d'ensemble des Prompts

| # | Prompt | Priorité | Durée | Complexité |
|---|--------|----------|-------|------------|
| 1 | Fix TypeScript Backend | 🔴 CRITIQUE | 2h | ⭐⭐⭐ |
| 2 | Fix TypeScript Frontend | 🔴 CRITIQUE | 2h | ⭐⭐⭐⭐ |
| 3 | Intégration Auth Backend | 🔴 CRITIQUE | 4h | ⭐⭐⭐⭐⭐ |
| 4 | Configuration Email SMTP | 🟠 MAJEUR | 1h | ⭐⭐ |
| 5 | Docker Backend | 🟠 MAJEUR | 2h | ⭐⭐⭐ |
| 6 | Docker Frontend + Nginx | 🟠 MAJEUR | 2h | ⭐⭐⭐ |
| 7 | Variables Environnement Prod | 🟠 MAJEUR | 1h | ⭐⭐ |
| 8 | Tests Backend (Jest) | 🟡 IMPORTANT | 4h | ⭐⭐⭐⭐ |
| 9 | Tests Frontend (Vitest) | 🟡 IMPORTANT | 3h | ⭐⭐⭐ |
| 10 | CI/CD GitHub Actions | 🟡 IMPORTANT | 2h | ⭐⭐⭐ |
| 11 | Monitoring & Logging | 🟡 IMPORTANT | 2h | ⭐⭐⭐ |
| 12 | Documentation API Swagger | 🟢 BONUS | 2h | ⭐⭐ |

**TOTAL**: ~27 heures de développement avec Copilot

---

## 🔴 PROMPT #1: Fix TypeScript Backend (CRITIQUE)

### Contexte
Le build backend échoue avec 25+ erreurs TypeScript. Ces erreurs bloquent complètement le déploiement.

### Prompt pour Copilot

```
# TÂCHE: Corriger toutes les erreurs TypeScript du backend BRX.MA

## Contexte
Le projet backend utilise TypeScript strict mode. Le build échoue actuellement avec npm run build.

## Erreurs à corriger

### 1. Erreurs "Not all code paths return a value" (TS7030)
Fichiers affectés:
- src/controllers/auth.controller.ts
- src/controllers/bvc.controller.ts (lignes 17, 67)
- src/controllers/cryptoController.ts (lignes 67, 89)
- src/controllers/opcvm.controller.ts (lignes 35, 71, 93)
- src/controllers/portfolio.controller.ts (lignes 129, 256, 314, 425, 535, 590)

**Solution requise**:
Pour chaque fonction async, assurer qu'il y a un return explicite ou que res.json() est toujours appelé.

Exemple AVANT:
```typescript
export const getStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await getStocksFromDB();
    res.json({ success: true, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
```

Exemple APRÈS:
```typescript
export const getStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const stocks = await getStocksFromDB();
    res.json({ success: true, data: stocks });
    return; // Explicite
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
    return; // Explicite
  }
};
```

### 2. Variables non utilisées (TS6133)
Fichiers affectés:
- src/controllers/auth.controller.ts:14 (refreshTokenSchema)
- src/controllers/bvc.controller.ts:17 (req)
- src/middleware/auth.middleware.ts:60 (res)
- src/middleware/errorHandler.ts:18 (req, next)
- src/data/opcvm-mock.ts:1 (OPCVMCategory)

**Solution**: Supprimer les imports/variables non utilisés OU les préfixer avec underscore si nécessaires pour le typage.

Exemple:
```typescript
// AVANT
export const handler = async (req: Request, res: Response, next: NextFunction) => {
  // req et next non utilisés
};

// APRÈS
export const handler = async (_req: Request, res: Response, _next: NextFunction) => {
  // Underscore indique volontairement non utilisé
};
```

### 3. Middleware auth (TS7030)
Fichier: src/middleware/auth.ts:8

Assurer que le middleware retourne toujours void et appelle next() ou envoie une réponse.

## Instructions

1. **Ouvrir le terminal** et exécuter:
   ```bash
   cd server
   npm run build
   ```

2. **Pour CHAQUE erreur** affichée:
   - Ouvrir le fichier concerné
   - Localiser la ligne exacte
   - Appliquer la correction appropriée
   - Tester avec `npm run build` à nouveau

3. **Vérifier** qu'il n'y a plus d'erreurs:
   ```bash
   npm run build
   # ✅ Devrait afficher: "Successfully compiled"
   ```

4. **Tester** que le serveur démarre:
   ```bash
   npm run dev
   # ✅ Devrait démarrer sans erreur
   ```

## Critères de succès
- ✅ `npm run build` réussit sans erreur
- ✅ Dossier `dist/` est généré
- ✅ `npm run dev` démarre le serveur
- ✅ Aucun warning TypeScript critique

## Fichiers à ne PAS modifier
- prisma/schema.prisma
- package.json (sauf si absolument nécessaire)
- .env

## Notes importantes
- Préserver la logique métier existante
- Ne pas changer les signatures d'API
- Garder la compatibilité avec le frontend
- Utiliser `: Promise<void>` pour les handlers Express
```

---

## 🔴 PROMPT #2: Fix TypeScript Frontend (CRITIQUE)

### Prompt pour Copilot

```
# TÂCHE: Corriger toutes les erreurs TypeScript du frontend BRX.MA

## Contexte
Le projet frontend utilise React 19 + TypeScript + Vite. Le build échoue avec 45+ erreurs.

## Erreurs à corriger (par ordre de priorité)

### 1. Module './MarketsBVC' introuvable (BLOQUANT)
Fichier: src/pages/Markets/index.ts:2

**Erreur**:
```typescript
export { MarketsBVC } from './MarketsBVC'; // ❌ Fichier supprimé
```

**Solution**: Supprimer cette ligne (le fichier MarketsBVC.tsx n'existe plus).

### 2. React Query v5 - Migration (CRITIQUE)
Fichiers affectés:
- src/hooks/useSocial.ts:8
- src/components/social/CreatePostForm.tsx:38

**Erreurs**:
- `keepPreviousData` n'existe plus
- `isLoading` n'existe plus

**Solution**: Mettre à jour pour React Query v5

AVANT:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['posts', symbol],
  queryFn: () => fetchPosts(symbol),
  keepPreviousData: true,
});
```

APRÈS:
```typescript
const { data, isPending } = useQuery({
  queryKey: ['posts', symbol],
  queryFn: () => fetchPosts(symbol),
  placeholderData: (previousData) => previousData,
});
```

Changements React Query v5:
- `isLoading` → `isPending`
- `keepPreviousData` → `placeholderData`

### 3. AdvancedChart.tsx - LightweightCharts API (MAJEUR)
Fichier: src/components/charts/AdvancedChart.tsx

**Erreurs**:
- Ligne 94: `priceToCoordinate` n'existe pas
- Ligne 205: `coordinateToPrice` n'existe pas
- Lignes 485, 496, 507: `.blur()` n'existe pas sur Element

**Solution API LightweightCharts**:

AVANT:
```typescript
const coordinate = priceScale.priceToCoordinate(price);
```

APRÈS:
```typescript
// LightweightCharts v4.2+ utilise priceToCoordinate via chart.timeScale()
const coordinate = chart.timeScale().priceToCoordinate(price);
```

Pour `.blur()`:
```typescript
// AVANT
document.activeElement.blur();

// APRÈS
if (document.activeElement instanceof HTMLElement) {
  document.activeElement.blur();
}
```

### 4. Imports de types React (verbatimModuleSyntax)
Fichiers affectés:
- src/components/composite/EmptyState.tsx:2
- src/components/composite/StatCard.tsx:2
- src/components/opcvm/PerformanceSimulator.tsx:1
- src/context/AuthContext.tsx:1

**Erreur**: 'ReactNode' is a type and must be imported using a type-only import

**Solution**:

AVANT:
```typescript
import { ReactNode } from 'react';
```

APRÈS:
```typescript
import type { ReactNode } from 'react';
```

### 5. Imports React non utilisés
Fichiers affectés:
- src/components/charts/StockChartModal.tsx:1
- src/components/charts/TradingViewChart.tsx:1
- src/components/social/CommentItem.tsx:1
- src/pages/Social/CommunityFeed.tsx:1
- Et 10+ autres fichiers

**Solution**: Supprimer `import React from 'react';` (pas nécessaire en React 17+)

### 6. Variables non utilisées
Exemples:
- src/components/charts/AdvancedChart.tsx:52 (activeTab, setActiveTab)
- src/pages/ComponentDemo.tsx:5 (FiMoon)
- src/pages/Portfolio/PortfolioNew.tsx:39 (refetchWallet)

**Solution**: Supprimer ou préfixer avec underscore

### 7. Types any/unknown
Fichiers:
- src/pages/Social/CommunityFeed.tsx:26 ('posts' is of type 'unknown')
- src/pages/Social/StockDiscussion.tsx:20 ('posts' is of type 'unknown')

**Solution**: Typer correctement les données de useQuery

```typescript
interface Post {
  id: string;
  content: string;
  // ... autres champs
}

const { data: posts } = useQuery<Post[]>({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});
```

### 8. Markets.tsx - Erreurs de données
Lignes 274, 278

**Erreur**: Property 'length', 'slice' does not exist on type '{}'

**Solution**: Vérifier le type de données retourné par useQuery et s'assurer que c'est un array.

## Instructions

1. **Créer une branche**:
   ```bash
   git checkout -b fix/typescript-frontend
   ```

2. **Tester le build actuel**:
   ```bash
   cd client-new
   npm run build 2>&1 | tee build-errors.txt
   ```

3. **Corriger dans cet ordre**:
   - Module MarketsBVC (1 minute)
   - Imports de types (10 minutes)
   - React Query v5 (30 minutes)
   - AdvancedChart.tsx (60 minutes)
   - Variables non utilisées (20 minutes)
   - Types any/unknown (30 minutes)

4. **Vérifier après chaque correction**:
   ```bash
   npm run build
   ```

5. **Test final**:
   ```bash
   npm run build
   npm run preview
   # Tester l'application sur http://localhost:4173
   ```

## Critères de succès
- ✅ `npm run build` réussit
- ✅ Dossier `dist/` généré
- ✅ Application fonctionne en preview
- ✅ Aucune erreur TypeScript
- ✅ Maximum 10 warnings (acceptable)

## Ressources
- React Query v5 migration: https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5
- LightweightCharts docs: https://tradingview.github.io/lightweight-charts/
```

---

## 🔴 PROMPT #3: Intégration Auth Backend (CRITIQUE)

### Prompt pour Copilot

```
# TÂCHE: Intégrer complètement le système d'authentification backend

## Contexte
Le service d'authentification (auth.service.ts) est déjà créé avec toutes les fonctions nécessaires, mais le controller (auth.controller.ts) utilise encore un stockage in-memory temporaire. Il faut refactoriser le controller pour utiliser le service et ajouter les routes manquantes.

## Référence
Voir le fichier `INTEGRATION_AUTH_PROMPT.md` pour le plan détaillé complet.

## Tâches

### 1. Refactoriser auth.controller.ts

**Fichier**: server/src/controllers/auth.controller.ts

**Supprimer** (lignes 8-18):
```typescript
interface InMemoryUser {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
}
const inMemoryUsers: InMemoryUser[] = [];
let userIdCounter = 1;
```

**Ajouter les imports**:
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
import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
```

**Réécrire la fonction `register`**:
```typescript
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = validateRequest<RegisterDto>(registerSchema, req.body);

    // Utiliser le service
    const user = await registerUser(data.email, data.password, data.name);

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokensForUser(user);

    // Sauvegarder le refresh token en DB
    await saveRefreshToken(user.id, refreshToken);

    // Retourner avec tokens
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      },
    });
    return;
  } catch (error) {
    console.error('Register error:', error);

    if (error instanceof Error && error.message === 'Email already registered') {
      res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
    });
    return;
  }
};
```

**Réécrire la fonction `login`**: (similaire à register)

**Réécrire `getCurrentUser`**:
```typescript
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
      return;
    }

    // Récupérer depuis la DB
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
    return;
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
    });
    return;
  }
};
```

**Réécrire `logout`**:
```typescript
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Récupérer le refresh token du body ou du cookie
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Supprimer le cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
    return;
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
    });
    return;
  }
};
```

### 2. Ajouter les nouvelles fonctions

**Fonction `refreshToken`**:
```typescript
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token requis',
      });
      return;
    }

    // Vérifier et consommer le token
    const decoded = await verifyAndConsumeRefreshToken(refreshToken);

    // Révoquer l'ancien token
    await revokeRefreshToken(refreshToken);

    // Générer de nouveaux tokens
    const newTokens = generateTokensForUser({
      id: decoded.userId,
      email: decoded.email,
    });

    // Sauvegarder le nouveau refresh token
    await saveRefreshToken(decoded.userId, newTokens.refreshToken);

    res.status(200).json({
      success: true,
      data: newTokens,
    });
    return;
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
    return;
  }
};
```

**Fonction `forgotPassword`**:
```typescript
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email requis',
      });
      return;
    }

    // Créer le token de reset (ne pas révéler si l'email existe)
    try {
      await createPasswordResetToken(email);
    } catch (e) {
      // Ignorer l'erreur pour ne pas révéler si l'email existe
      console.log('Password reset requested for:', email);
    }

    // Toujours retourner success (sécurité)
    res.status(200).json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    });
    return;
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande de réinitialisation',
    });
    return;
  }
};
```

**Fonction `resetPassword`**:
```typescript
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message: 'Token et mot de passe requis',
      });
      return;
    }

    // Consommer le token et récupérer userId
    const userId = await consumeAuthToken(token, 'RESET');

    // Hash le nouveau password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 12));

    // Mettre à jour le password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Révoquer tous les refresh tokens de cet utilisateur
    await revokeAllRefreshTokensForUser(userId);

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    });
    return;
  } catch (error) {
    console.error('Reset password error:', error);

    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('expired'))) {
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation',
    });
    return;
  }
};
```

**Fonction `verifyEmail`**:
```typescript
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Token requis',
      });
      return;
    }

    // Consommer le token
    const userId = await consumeAuthToken(token, 'VERIFY');

    // Marquer l'email comme vérifié
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès',
    });
    return;
  } catch (error) {
    console.error('Verify email error:', error);

    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('expired'))) {
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
    });
    return;
  }
};
```

### 3. Mettre à jour les routes

**Fichier**: server/src/routes/auth.routes.ts

**Ajouter les imports**:
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
import { authRateLimiter, passwordResetRateLimiter } from '../middleware/rateLimiter.middleware';
```

**Ajouter les routes**:
```typescript
// Refresh token
router.post('/refresh', refreshToken);

// Forgot password (strict rate limit)
router.post('/forgot-password', passwordResetRateLimiter, forgotPassword);

// Reset password
router.post('/reset-password', authRateLimiter, resetPassword);

// Verify email
router.post('/verify-email', verifyEmail);
```

**Appliquer rate limiter sur routes existantes**:
```typescript
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
```

### 4. Mettre à jour validation.ts

**Fichier**: server/src/utils/validation.ts

**Ajouter les schémas**:
```typescript
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

## Instructions d'exécution

1. **Sauvegarder le controller actuel**:
   ```bash
   cp server/src/controllers/auth.controller.ts server/src/controllers/auth.controller.ts.backup
   ```

2. **Refactoriser** auth.controller.ts étape par étape

3. **Mettre à jour** auth.routes.ts

4. **Mettre à jour** validation.ts

5. **Tester**:
   ```bash
   npm run build
   npm run dev
   ```

6. **Tester les routes** avec le fichier test-auth.http

## Critères de succès
- ✅ Build réussit
- ✅ 8 routes auth fonctionnent (register, login, me, logout, refresh, forgot-password, reset-password, verify-email)
- ✅ Tokens sauvegardés en DB
- ✅ Email verification fonctionne (logs si SMTP non configuré)
- ✅ Password reset fonctionne
- ✅ Rate limiter actif

## Tests à effectuer
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test"}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 3. Get Me (avec le token du login)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Refresh
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# 5. Forgot Password
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Vérifier les logs du serveur pour le token

# 6. Reset Password (avec le token des logs)
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_FROM_LOGS","password":"NewPassword123!"}'
```
```

---

## 🟠 PROMPT #4: Configuration Email SMTP

### Prompt pour Copilot

```
# TÂCHE: Configurer l'envoi d'emails SMTP avec SendGrid

## Contexte
Le système d'envoi d'emails est déjà codé (email.util.ts) mais les variables SMTP ne sont pas configurées. Il faut choisir un provider et le configurer.

## Provider recommandé: SendGrid

**Pourquoi SendGrid?**
- ✅ 100 emails/jour gratuits (parfait pour démarrer)
- ✅ Très facile à configurer
- ✅ API simple
- ✅ Bon déliverabilité

## Instructions

### 1. Créer un compte SendGrid

1. Aller sur https://signup.sendgrid.com/
2. Créer un compte gratuit
3. Vérifier votre email
4. Aller dans Settings → API Keys
5. Créer une nouvelle API Key avec "Full Access"
6. **COPIER LA CLÉ** (elle ne sera plus visible!)

### 2. Mettre à jour .env

**Fichier**: server/.env

```env
# Email Configuration (SMTP via SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.VOTRE_CLE_API_ICI
EMAIL_FROM=noreply@brx.ma

# Application URL
APP_URL=http://localhost:5173
```

**IMPORTANT**:
- SMTP_USER est toujours "apikey" (littéralement)
- SMTP_PASSWORD est votre clé API SendGrid

### 3. Vérifier l'expéditeur dans SendGrid

1. Dans SendGrid, aller dans Settings → Sender Authentication
2. Ajouter "noreply@brx.ma" comme expéditeur vérifié
3. SendGrid va envoyer un email de vérification
4. Cliquer sur le lien de vérification

**Alternative si vous n'avez pas de domaine**:
Utiliser votre email perso en attendant:
```env
EMAIL_FROM=votre.email@gmail.com
```

### 4. Tester l'envoi d'email

**Créer un script de test**:

Fichier: server/src/scripts/testEmail.ts

```typescript
import { sendVerificationEmail } from '../utils/email.util';

async function testEmail() {
  try {
    console.log('📧 Testing email send...');

    await sendVerificationEmail(
      'VOTRE_EMAIL_TEST@gmail.com',
      'test-token-123456'
    );

    console.log('✅ Email sent successfully!');
    console.log('Check your inbox at VOTRE_EMAIL_TEST@gmail.com');
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
}

testEmail();
```

**Exécuter**:
```bash
cd server
npx tsx src/scripts/testEmail.ts
```

**Vérifier**:
- ✅ Console affiche "Email sent successfully!"
- ✅ Email reçu dans la boîte (vérifier spam aussi)
- ✅ Lien de vérification bien formaté

### 5. Personnaliser les templates d'email

**Fichier**: server/src/utils/email.util.ts

**Améliorer le HTML**:

```typescript
export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.APP_URL || 'http://localhost:5173'}/verify-email?token=${encodeURIComponent(token)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 BRX.MA</h1>
        </div>
        <div class="content">
          <h2>Bienvenue sur BRX.MA!</h2>
          <p>Merci de vous être inscrit sur notre plateforme de trading virtuel.</p>
          <p>Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte:</p>
          <center>
            <a href="${verifyUrl}" class="button">Vérifier mon email</a>
          </center>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Ou copiez ce lien dans votre navigateur:<br>
            <a href="${verifyUrl}">${verifyUrl}</a>
          </p>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            Ce lien expire dans 24 heures.
          </p>
        </div>
        <div class="footer">
          <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
          <p>&copy; 2025 BRX.MA - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, 'Vérifiez votre email - BRX.MA', html);
}
```

**Faire pareil** pour `sendResetPasswordEmail`.

### 6. Ajouter des logs améliorés

Dans email.util.ts:

```typescript
export async function sendEmail(to: string, subject: string, html: string) {
  if (!SMTP_USER) {
    console.warn('⚠️  SMTP not configured, skipping email send to', to);
    console.log('📧 Email subject:', subject);
    console.log('📄 Email body preview:', html.substring(0, 200));
    return;
  }

  try {
    console.log('📧 Sending email to:', to);
    console.log('📬 Subject:', subject);

    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw error;
  }
}
```

## Alternatives à SendGrid

### Option 2: Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASSWORD=VOTRE_CLE_API_MAILGUN
```

### Option 3: Gmail (DEV ONLY)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=VOTRE_APP_PASSWORD  # Pas le mot de passe normal!
```

**Pour Gmail App Password**:
1. Activer 2FA sur votre compte Google
2. Aller dans compte.google.com/apppasswords
3. Créer un mot de passe d'application
4. Utiliser ce password dans SMTP_PASSWORD

## Critères de succès
- ✅ `npx tsx src/scripts/testEmail.ts` envoie un email
- ✅ Email bien reçu (pas dans spam)
- ✅ Lien de vérification fonctionne
- ✅ Template HTML propre
- ✅ Logs clairs dans la console

## Sécurité
- ❌ Ne JAMAIS commit les clés API
- ✅ Ajouter `.env` dans `.gitignore` (déjà fait)
- ✅ Créer `.env.example` sans les vraies valeurs
```

---

Je continue avec les 8 autres prompts? Ou voulez-vous que je me concentre sur certains en particulier?

Les prompts restants sont:
- #5: Docker Backend
- #6: Docker Frontend + Nginx
- #7: Variables Environnement Production
- #8: Tests Backend (Jest)
- #9: Tests Frontend (Vitest)
- #10: CI/CD GitHub Actions
- #11: Monitoring & Logging
- #12: Documentation API Swagger