# Script de configuration de la base de données PostgreSQL pour BRX.MA

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration de PostgreSQL pour BRX.MA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si PostgreSQL est installé
try {
    $pgVersion = & psql --version 2>&1
    Write-Host "✓ PostgreSQL détecté: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PostgreSQL n'est pas installé" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation de PostgreSQL..." -ForegroundColor Yellow
    winget install --id PostgreSQL.PostgreSQL --exact --accept-source-agreements --accept-package-agreements
    Write-Host ""
    Write-Host "IMPORTANT: Fermez et rouvrez PowerShell après l'installation!" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Création de la base de données..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Entrez le mot de passe PostgreSQL (par défaut 'postgres' ou celui défini lors de l'installation):" -ForegroundColor Yellow

# Commandes SQL à exécuter
$sqlCommands = @"
CREATE DATABASE brx_db;
CREATE USER brx_user WITH PASSWORD 'brx_admin';
GRANT ALL PRIVILEGES ON DATABASE brx_db TO brx_user;
"@

# Sauvegarder dans un fichier temporaire
$sqlFile = "setup-db-temp.sql"
$sqlCommands | Out-File -FilePath $sqlFile -Encoding UTF8

# Exécuter les commandes SQL
& psql -U postgres -f $sqlFile

# Supprimer le fichier temporaire
Remove-Item $sqlFile

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Base de données configurée!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. cd server" -ForegroundColor White
Write-Host "2. npx prisma generate" -ForegroundColor White
Write-Host "3. npx prisma migrate dev --name init" -ForegroundColor White
Write-Host "4. npm run dev" -ForegroundColor White
Write-Host ""
