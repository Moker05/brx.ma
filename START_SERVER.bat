@echo off
echo ========================================
echo Demarrage du serveur BRX.MA
echo ========================================
echo.

cd server

echo Etape 1: Generation du client Prisma...
call npx prisma generate

echo.
echo Etape 2: Creation des tables (si necessaire)...
call npx prisma db push

echo.
echo Etape 3: Chargement des donnees de demo...
call npm run prisma:seed

echo.
echo Etape 4: Demarrage du serveur...
echo Serveur accessible sur http://localhost:5000
echo.
call npm run dev
