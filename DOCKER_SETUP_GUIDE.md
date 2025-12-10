# 🐳 Docker Setup Guide - BRX.MA

Complete Docker containerization guide for BRX.MA platform (Backend + Database + Redis).

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

## 🚀 Quick Start

### Development Environment

```bash
# Start all services (PostgreSQL + Redis + Backend)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

---

## 📁 Docker Files Overview

### Backend Files

| File | Purpose |
|------|---------|
| `server/Dockerfile` | Production multi-stage build |
| `server/Dockerfile.dev` | Development with hot reload |
| `server/.dockerignore` | Exclude files from Docker build |
| `server/.env.example` | Environment variables template |

### Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Production configuration |
| `docker-compose.dev.yml` | Development configuration |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Docker Network              │
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │  PostgreSQL │  │    Redis     │ │
│  │   Database  │  │    Cache     │ │
│  │   :5432     │  │    :6379     │ │
│  └──────┬──────┘  └──────┬───────┘ │
│         │                │          │
│         └────────┬───────┘          │
│                  │                  │
│         ┌────────▼────────┐         │
│         │  Backend API    │         │
│         │    :5000        │         │
│         └─────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 Configuration

### Environment Variables

1. **Copy environment template:**
```bash
cp server/.env.example server/.env
```

2. **Update critical variables:**
```env
# Production Database URL
DATABASE_URL=postgresql://brx_user:brx_admin@postgres:5432/brx_db

# Generate secure JWT secrets (32+ characters)
JWT_SECRET=your-production-jwt-secret-min-32-chars
COOKIE_SECRET=your-production-cookie-secret-min-32-chars

# SMTP Configuration (SendGrid recommended)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key

# Application URL
APP_URL=https://brx.ma
CORS_ORIGIN=https://brx.ma
```

### Generate Secure Secrets

```bash
# Generate random 32-character secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎯 Development Workflow

### 1. Start Development Environment

```bash
# Start PostgreSQL + Redis + Backend with hot reload
docker-compose -f docker-compose.dev.yml up -d

# Check if all services are healthy
docker-compose -f docker-compose.dev.yml ps
```

Expected output:
```
NAME                 STATUS              PORTS
brx-postgres-dev     Up (healthy)        0.0.0.0:5432->5432/tcp
brx-redis-dev        Up (healthy)        0.0.0.0:6379->6379/tcp
brx-backend-dev      Up (healthy)        0.0.0.0:5000->5000/tcp
```

### 2. Run Database Migrations

```bash
# Access backend container
docker exec -it brx-backend-dev sh

# Run Prisma migrations
npx prisma migrate dev

# Seed database with test data
npm run prisma:seed

# Exit container
exit
```

### 3. Test Backend

```bash
# Health check
curl http://localhost:5000/health

# Test BVC stocks API
curl http://localhost:5000/api/bvc/stocks

# Test authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brx.ma","password":"Password123!","name":"Test User"}'
```

### 4. View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Backend only
docker-compose -f docker-compose.dev.yml logs -f backend

# PostgreSQL only
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### 5. Access Database

```bash
# Using docker exec
docker exec -it brx-postgres-dev psql -U brx_user -d brx_db

# Using Prisma Studio (UI)
docker exec -it brx-backend-dev npm run prisma:studio
# Open http://localhost:5555
```

### 6. Restart Services

```bash
# Restart all
docker-compose -f docker-compose.dev.yml restart

# Restart backend only
docker-compose -f docker-compose.dev.yml restart backend
```

### 7. Clean Up

```bash
# Stop and remove containers (keeps volumes)
docker-compose -f docker-compose.dev.yml down

# Remove containers AND volumes (⚠️ deletes all data)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🏭 Production Deployment

### 1. Build Production Images

```bash
# Build backend image
docker-compose build backend

# Check image size
docker images | grep brx
```

### 2. Start Production Stack

```bash
# Start all services
docker-compose up -d

# Check health
docker-compose ps
```

### 3. Run Initial Setup

```bash
# Run migrations
docker exec -it brx-backend sh -c "npx prisma migrate deploy"

# Seed database (if needed)
docker exec -it brx-backend sh -c "npm run prisma:seed"
```

### 4. Monitor Services

```bash
# Health checks
curl http://localhost:5000/health

# Container stats
docker stats brx-backend brx-postgres brx-redis

# Resource usage
docker system df
```

---

## 🔍 Troubleshooting

### Issue: Container fails to start

**Check logs:**
```bash
docker-compose logs backend
```

**Common causes:**
- Missing `.env` file
- Invalid DATABASE_URL
- Port already in use
- Insufficient memory

**Solutions:**
```bash
# Check if port 5000 is in use
netstat -tulpn | grep 5000  # Linux
netstat -ano | findstr 5000  # Windows

# Kill process using port
kill -9 <PID>  # Linux
taskkill /F /PID <PID>  # Windows

# Restart Docker
docker-compose down && docker-compose up -d
```

---

### Issue: Database connection refused

**Check PostgreSQL health:**
```bash
docker-compose ps postgres
docker-compose logs postgres
```

**Test connection:**
```bash
docker exec -it brx-postgres-dev psql -U brx_user -d brx_db -c "SELECT 1"
```

**Solutions:**
- Wait for PostgreSQL to be healthy (10-30 seconds)
- Check `DATABASE_URL` in `.env`
- Verify network connectivity: `docker network inspect brx_brx-network`

---

### Issue: Prisma Client not generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
# Rebuild backend container
docker-compose build --no-cache backend
docker-compose up -d backend
```

---

### Issue: Hot reload not working (dev mode)

**Check volume mounts:**
```bash
docker inspect brx-backend-dev | grep -A 10 Mounts
```

**Solution:**
```bash
# Restart with fresh build
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build -d
```

---

### Issue: Out of disk space

**Check Docker disk usage:**
```bash
docker system df
```

**Clean up:**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything (⚠️ dangerous)
docker system prune -a --volumes
```

---

## 📊 Performance Tuning

### PostgreSQL Optimization

Edit `docker-compose.yml`:
```yaml
postgres:
  environment:
    # Increase shared buffers (25% of RAM)
    POSTGRES_SHARED_BUFFERS: 256MB
    # Increase work memory
    POSTGRES_WORK_MEM: 16MB
    # Increase effective cache
    POSTGRES_EFFECTIVE_CACHE_SIZE: 1GB
```

### Backend Optimization

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

---

## 🔒 Security Best Practices

### 1. Non-root User
✅ Backend runs as `nodejs` user (UID 1001) - configured in Dockerfile

### 2. Read-only Filesystem
Add to `docker-compose.yml`:
```yaml
backend:
  read_only: true
  tmpfs:
    - /tmp
    - /app/logs
```

### 3. Security Scanning
```bash
# Scan image for vulnerabilities
docker scan brx-server_backend

# Use Trivy
trivy image brx-server_backend
```

### 4. Secrets Management
```bash
# Use Docker secrets (Swarm mode)
echo "my-secret" | docker secret create jwt_secret -
```

### 5. Network Isolation
```yaml
networks:
  brx-network:
    driver: bridge
    internal: true  # No external access
```

---

## 📈 Monitoring

### Health Checks

Built-in health checks:
- **Backend:** `GET /health` (every 30s)
- **PostgreSQL:** `pg_isready` (every 10s)
- **Redis:** `redis-cli ping` (every 10s)

### Prometheus Metrics (TODO)

Add to `docker-compose.yml`:
```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"
```

---

## 🚢 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build backend
        run: docker build -t brx-backend:latest ./server
      - name: Push to registry
        run: docker push brx-backend:latest
```

---

## 📚 Useful Commands

```bash
# Enter backend container shell
docker exec -it brx-backend sh

# View real-time logs
docker-compose logs -f --tail=100 backend

# Inspect container
docker inspect brx-backend

# Check network
docker network ls
docker network inspect brx_brx-network

# Backup database
docker exec brx-postgres pg_dump -U brx_user brx_db > backup.sql

# Restore database
cat backup.sql | docker exec -i brx-postgres psql -U brx_user -d brx_db

# Export volumes
docker run --rm -v brx_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# List all containers (including stopped)
docker ps -a

# Remove all stopped containers
docker container prune
```

---

## 🎓 Next Steps

After Docker setup:

1. ✅ **Frontend Dockerization** (Prompt #6)
2. ✅ **Production Environment Variables** (Prompt #7)
3. ✅ **CI/CD Pipeline** (Prompt #10)
4. ✅ **Kubernetes Deployment** (optional)
5. ✅ **Monitoring & Logging** (Prompt #11)

---

**Last updated:** 2025-01-15
**Docker version:** 24.0+
**Docker Compose version:** 2.0+
