# 🔐 Production Environment Variables Setup Guide

Complete guide for configuring production environment variables for BRX.MA platform.

## 📋 Table of Contents

1. [Backend Environment Variables](#backend-environment-variables)
2. [Frontend Environment Variables](#frontend-environment-variables)
3. [Security Best Practices](#security-best-practices)
4. [Secret Generation](#secret-generation)
5. [Deployment Checklist](#deployment-checklist)

---

## 🔧 Backend Environment Variables

### Location: `server/.env`

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=production
PORT=5000

# ============================================
# DATABASE CONFIGURATION (PostgreSQL)
# ============================================
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://brx_user:CHANGE_THIS_PASSWORD@postgres:5432/brx_db

# ============================================
# JWT AUTHENTICATION
# ============================================
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_MIN_32_CHARACTERS_12345678901234567890
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# PASSWORD HASHING
# ============================================
BCRYPT_ROUNDS=12

# ============================================
# CORS CONFIGURATION
# ============================================
# Production frontend URL
CORS_ORIGIN=https://brx.ma

# ============================================
# API RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=info

# ============================================
# EMAIL CONFIGURATION (SMTP)
# ============================================
# SendGrid Configuration (Recommended for production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.YOUR_SENDGRID_API_KEY_HERE
EMAIL_FROM=noreply@brx.ma

# ============================================
# APPLICATION URL
# ============================================
# For email verification and password reset links
APP_URL=https://brx.ma

# ============================================
# SESSION/COOKIE CONFIGURATION
# ============================================
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
COOKIE_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_MIN_32_CHARACTERS_12345678901234567890

# ============================================
# CASABLANCA BOURSE API (Optional)
# ============================================
BOURSE_API_URL=https://www.casablanca-bourse.com
BOURSE_API_KEY=

# ============================================
# REDIS CACHE (Optional but recommended)
# ============================================
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_THIS_IF_REDIS_HAS_PASSWORD

# ============================================
# CRON JOBS
# ============================================
# Format: minute hour day month weekday
CRON_UPDATE_STOCKS=*/5 * * * *
CRON_UPDATE_HISTORY=0 18 * * 1-5
```

---

## 🎨 Frontend Environment Variables

### Location: `client-new/.env.production`

```env
# ============================================
# BACKEND API URL
# ============================================
# Production API endpoint
VITE_API_URL=https://api.brx.ma

# ============================================
# APPLICATION ENVIRONMENT
# ============================================
VITE_APP_ENV=production

# ============================================
# TRADINGVIEW CONFIGURATION (Optional)
# ============================================
VITE_TRADINGVIEW_THEME=dark
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets to Git

Add to `.gitignore`:
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development
server/.env
client-new/.env.production
```

### 2. Use Strong Secrets

```bash
# Generate 32-byte (256-bit) random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate 64-byte (512-bit) random secret (even stronger)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate base64 secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Secret Length Requirements

| Secret | Minimum Length | Recommended |
|--------|----------------|-------------|
| JWT_SECRET | 32 characters | 64 characters |
| COOKIE_SECRET | 32 characters | 64 characters |
| Database Password | 16 characters | 32 characters |
| SMTP Password | As provided | - |

### 4. Use Environment-Specific Secrets

```bash
# Development
JWT_SECRET=dev-secret-only-for-local-testing

# Staging
JWT_SECRET=staging-secret-different-from-production

# Production
JWT_SECRET=prod-secret-ultra-secure-randomly-generated
```

### 5. Rotate Secrets Regularly

- **JWT_SECRET**: Rotate every 3-6 months (will invalidate all tokens)
- **COOKIE_SECRET**: Rotate every 6 months
- **Database Password**: Rotate annually
- **SMTP Password**: Rotate when employee leaves or yearly

---

## 🔑 Secret Generation

### Automated Secret Generation Script

Create `server/scripts/generateSecrets.ts`:

```typescript
import crypto from 'crypto';

console.log('=== BRX.MA Production Secrets ===\n');

console.log('JWT_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('COOKIE_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('DB_PASSWORD=' + crypto.randomBytes(32).toString('base64url'));
console.log('\n⚠️  Save these secrets securely! Never commit to Git!');
```

Run it:
```bash
cd server
tsx scripts/generateSecrets.ts
```

### Manual Generation

**Using OpenSSL:**
```bash
openssl rand -hex 32
openssl rand -base64 32
```

**Using Python:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 Deployment Checklist

### Pre-Deployment

- [ ] All secrets generated and stored securely
- [ ] `.env` files NOT committed to Git
- [ ] DATABASE_URL points to production database
- [ ] CORS_ORIGIN set to production domain
- [ ] APP_URL set to production domain
- [ ] SMTP configured with production credentials
- [ ] JWT_SECRET and COOKIE_SECRET are strong (64+ chars)
- [ ] NODE_ENV=production
- [ ] Redis configured (if using)

### Backend Checklist

```bash
# 1. Verify environment variables
cd server
cat .env  # Check all variables are set

# 2. Test database connection
npx prisma db pull

# 3. Run migrations
npx prisma migrate deploy

# 4. Test SMTP
npm run test-email your-email@example.com

# 5. Build backend
npm run build

# 6. Test production build
NODE_ENV=production npm start
```

### Frontend Checklist

```bash
# 1. Verify environment variables
cd client-new
cat .env.production  # Check VITE_API_URL

# 2. Build frontend
npm run build

# 3. Test production build
npm run preview

# 4. Check bundle size
ls -lh dist/assets/*.js
```

### Docker Deployment Checklist

```bash
# 1. Build images
docker-compose build

# 2. Test locally
docker-compose up -d

# 3. Check health
docker-compose ps
curl http://localhost:5000/health
curl http://localhost/health

# 4. Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# 5. Run migrations in container
docker exec -it brx-backend sh -c "npx prisma migrate deploy"

# 6. Stop and clean
docker-compose down
```

---

## 🌐 Cloud Provider Configurations

### Heroku

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set DATABASE_URL=postgresql://...
heroku config:set SMTP_HOST=smtp.sendgrid.net
heroku config:set SMTP_USER=apikey
heroku config:set SMTP_PASSWORD=SG.your-api-key

# View all configs
heroku config
```

### DigitalOcean App Platform

1. Go to Settings > Environment Variables
2. Add all variables from `server/.env.example`
3. Mark `JWT_SECRET`, `COOKIE_SECRET`, `SMTP_PASSWORD` as **Encrypted**

### AWS Elastic Beanstalk

```bash
# Using EB CLI
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=your-secret
eb setenv DATABASE_URL=postgresql://...

# Or use .ebextensions/env.config
```

### Google Cloud Run

```bash
# Using gcloud CLI
gcloud run deploy brx-backend \
  --set-env-vars NODE_ENV=production \
  --set-env-vars JWT_SECRET=your-secret \
  --set-env-vars DATABASE_URL=postgresql://...
```

### Railway

1. Go to Variables tab
2. Click "Raw Editor"
3. Paste all variables from `.env`
4. Click "Deploy"

---

## 🔐 Secret Management Tools

### Docker Secrets (Swarm Mode)

```bash
# Create secrets
echo "my-jwt-secret" | docker secret create jwt_secret -
echo "my-cookie-secret" | docker secret create cookie_secret -

# Use in docker-compose.yml
services:
  backend:
    secrets:
      - jwt_secret
      - cookie_secret
secrets:
  jwt_secret:
    external: true
  cookie_secret:
    external: true
```

### HashiCorp Vault

```bash
# Store secret
vault kv put secret/brx/prod \
  jwt_secret=your-secret \
  cookie_secret=your-secret \
  smtp_password=your-password

# Read secret
vault kv get -field=jwt_secret secret/brx/prod
```

### AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
  --name brx/prod/jwt-secret \
  --secret-string "your-secret"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id brx/prod/jwt-secret \
  --query SecretString \
  --output text
```

---

## ⚠️ Common Mistakes to Avoid

### 1. Using Weak Secrets

❌ **BAD:**
```env
JWT_SECRET=secret123
COOKIE_SECRET=password
```

✅ **GOOD:**
```env
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
COOKIE_SECRET=9876543210fedcba0987654321fedcba0987654321fedcba098765432110abcd
```

### 2. Hardcoding Secrets

❌ **BAD:**
```typescript
const JWT_SECRET = 'my-hardcoded-secret';
```

✅ **GOOD:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
```

### 3. Committing .env to Git

❌ **BAD:**
```bash
git add .env
git commit -m "Add config"
```

✅ **GOOD:**
```bash
# In .gitignore
.env
.env.local
.env.production
```

### 4. Same Secrets Across Environments

❌ **BAD:**
```env
# development
JWT_SECRET=my-secret

# production
JWT_SECRET=my-secret  # Same as dev!
```

✅ **GOOD:**
```env
# development
JWT_SECRET=dev-secret-for-local-testing-only

# production
JWT_SECRET=a1b2c3d4...completely-different-secret
```

### 5. Exposing Secrets in Frontend

❌ **BAD:**
```typescript
// client-new/src/config.ts
export const JWT_SECRET = 'my-secret';  // Exposed to browser!
```

✅ **GOOD:**
```typescript
// Backend only!
// server/src/utils/jwt.ts
const JWT_SECRET = process.env.JWT_SECRET;
```

---

## 📊 Environment Variables Summary

### Backend (17 variables)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NODE_ENV | ✅ Yes | development | Environment mode |
| PORT | ✅ Yes | 5000 | Server port |
| DATABASE_URL | ✅ Yes | - | PostgreSQL connection |
| JWT_SECRET | ✅ Yes | - | JWT signing key |
| JWT_ACCESS_EXPIRES_IN | No | 15m | Access token expiry |
| JWT_REFRESH_EXPIRES_IN | No | 30d | Refresh token expiry |
| BCRYPT_ROUNDS | No | 12 | Password hash rounds |
| CORS_ORIGIN | ✅ Yes | - | Allowed frontend URL |
| RATE_LIMIT_WINDOW_MS | No | 900000 | Rate limit window |
| RATE_LIMIT_MAX_REQUESTS | No | 100 | Max requests per window |
| LOG_LEVEL | No | info | Logging level |
| SMTP_HOST | ✅ Yes | - | SMTP server |
| SMTP_PORT | No | 587 | SMTP port |
| SMTP_USER | ✅ Yes | - | SMTP username |
| SMTP_PASSWORD | ✅ Yes | - | SMTP password |
| EMAIL_FROM | ✅ Yes | - | Sender email |
| APP_URL | ✅ Yes | - | Application URL |
| COOKIE_SECRET | ✅ Yes | - | Cookie encryption |
| REDIS_HOST | No | localhost | Redis host |
| REDIS_PORT | No | 6379 | Redis port |

### Frontend (2 variables)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | ✅ Yes | - | Backend API URL |
| VITE_APP_ENV | No | production | App environment |

---

## 🎯 Next Steps

After configuring environment variables:

1. ✅ **Test locally with production env**
   ```bash
   NODE_ENV=production npm start
   ```

2. ✅ **Run security audit**
   ```bash
   npm audit --production
   ```

3. ✅ **Set up CI/CD** (Prompt #10)
4. ✅ **Configure monitoring** (Prompt #11)
5. ✅ **Deploy to production**

---

**Last updated:** 2025-01-15
**Security Level:** Production-Ready 🔒
