@echo off
echo ========================================
echo Installation PostgreSQL pour BRX.MA
echo ========================================
echo.

echo Etape 1: Installation de PostgreSQL via winget
echo -----------------------------------------------
winget install --id PostgreSQL.PostgreSQL --exact --accept-source-agreements --accept-package-agreements

echo.
echo ========================================
echo Installation terminee!
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo 1. Ouvrir un nouveau PowerShell
echo 2. Executer: psql -U postgres
echo 3. Copier-coller ces commandes dans psql:
echo.
echo    CREATE DATABASE brx_db;
echo    CREATE USER brx_user WITH PASSWORD 'brx_admin';
echo    GRANT ALL PRIVILEGES ON DATABASE brx_db TO brx_user;
echo    \q
echo.
echo 4. Executer dans le projet:
echo    cd server
echo    npx prisma generate
echo    npx prisma migrate dev --name init
echo    npm run dev
echo.
pause
