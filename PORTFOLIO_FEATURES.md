# 📊 Fonctionnalités Portfolio BRX.MA

## Vue d'ensemble

Le système de portefeuille amélioré offre une gestion complète des actifs avec suivi en temps réel, calcul de PnL, et historique détaillé.

## ✨ Nouvelles Fonctionnalités

### 1. Gestion Complète des Actifs

#### Ajout d'Actifs
- ✅ Modal intuitive pour ajouter des positions manuellement
- ✅ Support de 3 types d'actifs :
  - **Crypto** : Bitcoin, Ethereum, etc.
  - **Actions** : Titres de la Bourse de Casablanca (BVC)
  - **OPCVM** : Fonds d'investissement
- ✅ Champs détaillés :
  - Symbole (BTC, ATW, etc.)
  - Nom complet (optionnel)
  - Quantité
  - Prix d'achat en MAD
  - Date d'achat
  - Notes personnelles

#### Modification et Suppression
- ✅ Édition des positions existantes
- ✅ Suppression avec confirmation
- ✅ Mise à jour du prix moyen automatique

### 2. Valorisation en Temps Réel

#### Service de Prix
- ✅ **Prix Crypto** : Intégration CoinGecko API
  - Mise à jour automatique toutes les 5 minutes
  - Conversion automatique USD → MAD
  - Cache intelligent pour optimiser les appels API
- ⚠️ **Prix Actions BVC** : À implémenter (API à définir)
- ⚠️ **Prix OPCVM** : À implémenter

#### Actualisation
- ✅ Bouton d'actualisation manuelle
- ✅ Refresh automatique toutes les 30 secondes
- ✅ Indicateur visuel lors de la mise à jour

### 3. Graphique de Suivi 📈

#### Visualisation
- ✅ Graphique en aires (Area Chart) avec gradient
- ✅ Affichage de la valeur totale du portefeuille en MAD
- ✅ Tooltip détaillé au survol :
  - Date et heure
  - Valeur totale
  - Montant investi
  - P&L

#### Filtres Temporels
- ✅ **1 Semaine** : Suivi court terme
- ✅ **1 Mois** : Vue mensuelle (défaut)
- ✅ **1 An** : Analyse annuelle
- ✅ **Max** : Historique complet depuis la création

### 4. Calcul du PnL (Profit & Loss)

#### PnL Non Réalisé
- ✅ Calcul automatique par position :
  ```
  PnL = (Quantité × Prix Actuel) - Total Investi
  PnL % = (PnL / Total Investi) × 100
  ```
- ✅ Agrégation au niveau portefeuille
- ✅ Code couleur : Vert (profit) / Rouge (perte)
- ✅ Icônes de tendance

#### PnL Réalisé
- ✅ Calcul lors des ventes :
  ```
  PnL Réalisé = Prix de Vente - Prix d'Achat Moyen - Frais
  ```
- ✅ Historique complet dans les transactions
- ✅ Traçabilité totale

### 5. Log des Transactions

#### Affichage Détaillé
- ✅ Date et heure exacte
- ✅ Type (BUY / SELL)
- ✅ Symbole et type d'actif
- ✅ Quantité
- ✅ Prix unitaire
- ✅ Montant total
- ✅ Frais (0.5%)
- ✅ PnL réalisé (pour les ventes)

#### Filtres et Recherche
- ✅ Recherche par symbole
- ✅ Filtre par type d'actif (Crypto/Actions/OPCVM)
- ✅ Tri par date (plus récent en premier)

### 6. Statistiques du Portefeuille

#### Métriques Principales
1. **Solde Disponible** : Liquidités en MAD
2. **Valeur Investie** : Capital déployé
3. **Valeur Actuelle** : Valorisation des positions
4. **Profit/Perte** :
   - Montant en MAD
   - Pourcentage de variation
5. **Valeur Totale** : Solde + Positions

#### Snapshots Automatiques
- ✅ Sauvegarde périodique de l'état du portefeuille
- ✅ Permet la reconstruction de l'historique
- ✅ Base pour le graphique de suivi

## 🏗️ Architecture Technique

### Backend (Node.js + TypeScript + Prisma)

#### Base de Données
```prisma
- VirtualWallet : Portefeuille virtuel
- Position : Positions actuelles
- Transaction : Historique des transactions (enrichi)
- PortfolioSnapshot : Snapshots pour graphique
```

#### API Endpoints
```
GET    /api/portfolio/wallet/:userId
POST   /api/portfolio/positions/:userId
PUT    /api/portfolio/positions/:positionId
DELETE /api/portfolio/positions/:positionId
POST   /api/portfolio/buy/:userId
POST   /api/portfolio/sell/:userId
GET    /api/portfolio/history/:userId?period=1M
POST   /api/portfolio/snapshot/:userId
POST   /api/portfolio/wallet/:userId/reset
POST   /api/prices/update/:userId
```

#### Services
- **priceService.ts** : Récupération des prix en temps réel
  - CoinGecko pour les cryptos
  - Cache intelligent (5 min TTL)
  - Support multi-actifs

### Frontend (React + TypeScript + TailwindCSS)

#### Composants
- **PortfolioNew.tsx** : Page principale
- **AddAssetModal.tsx** : Modal d'ajout d'actifs
- **PortfolioChart.tsx** : Graphique avec Recharts

#### Services
- **portfolioAPI.ts** : Client API complet
  - Types TypeScript stricts
  - Gestion des erreurs
  - React Query pour le cache

## 🚀 Utilisation

### 1. Démarrer le Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Démarrer le Frontend
```bash
cd client-new
npm install
npm run dev
```

### 3. Accéder à l'Application
```
http://localhost:5173/portfolio
```

## 📝 Notes Importantes

### Limitations Actuelles
1. **Prix Actions BVC** : API non implémentée (mock data)
2. **Prix OPCVM** : API non implémentée (mock data)
3. **Authentification** : userId en dur (demo-user-001)
4. **Devise** : MAD uniquement

### Améliorations Futures
- [ ] Intégration API Bourse de Casablanca
- [ ] Support multi-devises
- [ ] Alertes de prix personnalisées
- [ ] Export Excel/PDF du portefeuille
- [ ] Analyse de performance avancée
- [ ] Authentification utilisateur complète
- [ ] Mode sombre/clair

## 🔧 Configuration

### Variables d'Environnement

**Backend** (`.env`)
```env
DATABASE_URL="postgresql://..."
PORT=5000
NODE_ENV=development
```

**Frontend** (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Formules de Calcul

### Prix Moyen d'Achat
```
Prix Moyen = Total Investi / Quantité Totale
```

### Mise à Jour lors d'un Achat
```
Nouveau Prix Moyen = (Ancien Total Investi + Nouvel Achat) / (Ancienne Quantité + Nouvelle Quantité)
```

### PnL Non Réalisé
```
PnL = (Quantité × Prix Actuel) - Total Investi
PnL % = (PnL / Total Investi) × 100
```

### PnL Réalisé (Vente)
```
Coût de Base = (Total Investi / Quantité Totale) × Quantité Vendue
PnL Réalisé = (Prix Vente × Quantité) - Coût de Base - Frais
```

### Frais de Transaction
```
Frais = 0.5% du montant total
```

## 🎨 Interface Utilisateur

### Design System
- **Framework** : TailwindCSS + DaisyUI
- **Icons** : React Icons (Feather Icons)
- **Charts** : Recharts
- **Colors** :
  - Success (Profit) : Green
  - Error (Loss) : Red
  - Primary : Blue
  - Secondary : Purple

### Responsive
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 📈 Roadmap

### Phase 1 - ✅ Complétée
- [x] Gestion CRUD des actifs
- [x] Valorisation temps réel (crypto)
- [x] Graphique de suivi
- [x] Calcul PnL
- [x] Log des transactions

### Phase 2 - 🚧 En Cours
- [ ] Intégration API BVC
- [ ] Support OPCVM
- [ ] Authentification JWT

### Phase 3 - 📅 Planifiée
- [ ] Alertes de prix
- [ ] Export de données
- [ ] Analyse avancée
- [ ] Application mobile

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature
3. Commit les changements
4. Push et créer une Pull Request

## 📄 Licence

Propriétaire - BRX.MA © 2024
