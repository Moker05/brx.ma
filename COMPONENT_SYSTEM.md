# 🎨 BRX.MA - Système de Composants

## 📋 Vue d'Ensemble

Ce document décrit le système de composants créé pour BRX.MA, basé sur une architecture modulaire et extensible inspirée de Shadcn/ui.

## 🏗️ Architecture

### Hiérarchie des Composants

```
src/
├── lib/
│   ├── utils.ts                 # Utilitaires (cn, formatters)
│   └── hooks/                   # Hooks personnalisés
│
├── components/
│   ├── composite/               # Composants composés réutilisables
│   │   ├── StatCard.tsx         # Carte KPI
│   │   ├── PriceDisplay.tsx     # Affichage prix avec variation
│   │   ├── EmptyState.tsx       # État vide
│   │   └── LoadingState.tsx     # État de chargement
│   │
│   ├── portfolio/               # Composants Portfolio
│   │   ├── PortfolioHeader.tsx  # Header avec actions
│   │   ├── PortfolioStats.tsx   # Grid de statistiques
│   │   ├── PortfolioChart.tsx   # Graphique (existant)
│   │   └── AddAssetModal.tsx    # Modal ajout (existant)
│   │
│   ├── trading/                 # Composants Trading
│   │   └── (à créer)
│   │
│   ├── bvc/                     # Composants BVC
│   │   └── (à créer)
│   │
│   └── layout/                  # Composants Layout
│       ├── Header.tsx           # (existant)
│       ├── Sidebar.tsx          # (existant)
│       └── Layout.tsx           # (existant)
```

## 📦 Composants Créés

### 1. Utilitaires (`lib/utils.ts`)

#### `cn()` - Merge de classes Tailwind
```tsx
import { cn } from '@/lib/utils';

// Exemple d'utilisation
<div className={cn('btn', isPrimary && 'btn-primary', className)} />
```

#### Formatters
```tsx
import {
  formatCurrency,      // 1234.56 → "1 234,56"
  formatCrypto,        // 0.5 → "0.50000000"
  formatPercent,       // 2.5 → "+2.50%"
  formatCompact,       // 1500000 → "1.5M"
  getPnLColorClass,    // value >= 0 → "text-success"
} from '@/lib/utils';
```

### 2. Composants Composite

#### `StatCard` - Carte de statistique
```tsx
import { StatCard } from '@/components/composite';

<StatCard
  title="Solde disponible"
  value="550,000.00 MAD"
  subtitle="Disponible pour investir"
  trend={{ value: 2.5, label: '30 derniers jours' }}
  variant="default" // ou "gradient" ou "glass"
/>
```

**Props:**
- `title`: string - Titre de la carte
- `value`: string | number - Valeur principale
- `subtitle?`: string - Sous-titre optionnel
- `icon?`: ReactNode - Icône optionnelle
- `trend?`: { value: number, label?: string } - Tendance avec pourcentage
- `variant?`: 'default' | 'gradient' | 'glass'
- `className?`: string

#### `PriceDisplay` - Affichage de prix
```tsx
import { PriceDisplay } from '@/components/composite';

<PriceDisplay
  value={900000}
  currency="MAD"
  changePercent={2.5}
  size="lg"
  showIcon={true}
/>
```

**Props:**
- `value`: number - Valeur du prix
- `currency?`: string - Devise (défaut: "MAD")
- `change?`: number - Changement absolu
- `changePercent?`: number - Changement en pourcentage
- `size?`: 'sm' | 'md' | 'lg'
- `showIcon?`: boolean - Afficher icône trending
- `className?`: string

#### `EmptyState` - État vide
```tsx
import { EmptyState } from '@/components/composite';
import { FiInbox } from 'react-icons/fi';

<EmptyState
  icon={<FiInbox />}
  title="Aucune position"
  description="Ajoutez un actif pour commencer à suivre votre portefeuille"
  action={<button className="btn btn-primary">Ajouter un actif</button>}
/>
```

**Props:**
- `title`: string - Titre
- `description?`: string - Description
- `icon?`: ReactNode - Icône
- `action?`: ReactNode - Bouton d'action
- `className?`: string

#### `LoadingState` - État de chargement
```tsx
import { LoadingState } from '@/components/composite';

<LoadingState
  message="Chargement du portefeuille..."
  size="lg"
/>
```

**Props:**
- `message?`: string - Message de chargement
- `size?`: 'sm' | 'md' | 'lg'
- `className?`: string

### 3. Composants Portfolio

#### `PortfolioHeader` - Header du portfolio
```tsx
import { PortfolioHeader } from '@/components/portfolio/PortfolioHeader';

<PortfolioHeader
  onAddPosition={() => setIsModalOpen(true)}
  onUpdatePrices={handleUpdatePrices}
  onReset={handleReset}
  isUpdatingPrices={mutation.isPending}
/>
```

**Props:**
- `onAddPosition`: () => void - Callback ajout position
- `onUpdatePrices`: () => void - Callback refresh prix
- `onReset`: () => void - Callback reset wallet
- `isUpdatingPrices?`: boolean - État de chargement

#### `PortfolioStats` - Statistiques du portfolio
```tsx
import { PortfolioStats } from '@/components/portfolio/PortfolioStats';

<PortfolioStats
  stats={{
    availableBalance: 550000,
    totalInvested: 450000,
    totalCurrentValue: 450000,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0,
    totalValue: 1000000,
  }}
  periodPnL={{
    change: 5000,
    percent: 2.5,
  }}
/>
```

**Props:**
- `stats`: PortfolioStatsData - Données statistiques
- `periodPnL?`: { change: number, percent: number } - P&L de la période

## 🎯 Exemple d'Utilisation: Page Portfolio Refactorisée

### Avant (532 lignes)
```tsx
export const PortfolioNew = () => {
  // 100+ lignes de state, hooks, fonctions
  // 400+ lignes de JSX dupliqué

  return (
    <div>
      {/* 200 lignes de stats cards répétitives */}
      {/* 200 lignes de tables */}
    </div>
  );
};
```

### Après (< 150 lignes)
```tsx
import {
  PortfolioHeader,
  PortfolioStats,
  PortfolioChart,
} from '@/components/portfolio';
import { LoadingState, EmptyState } from '@/components/composite';

export const PortfolioNew = () => {
  const [userId] = useState('demo-user-001');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('1M');

  // Queries
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => getWallet(userId),
  });

  const { data: history } = useQuery({
    queryKey: ['history', userId, selectedPeriod],
    queryFn: () => getPortfolioHistory(userId, selectedPeriod),
  });

  // Mutations
  const updatePricesMutation = useMutation({
    mutationFn: () => updatePositionPrices(userId),
  });

  if (isLoading) {
    return <LoadingState message="Chargement du portefeuille..." />;
  }

  if (!wallet) {
    return (
      <EmptyState
        title="Erreur de chargement"
        description="Impossible de charger le portefeuille"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioHeader
        onAddPosition={() => setIsAddModalOpen(true)}
        onUpdatePrices={() => updatePricesMutation.mutate()}
        onReset={handleReset}
        isUpdatingPrices={updatePricesMutation.isPending}
      />

      <PortfolioStats
        stats={wallet.portfolio}
        periodPnL={periodPnL}
      />

      <PortfolioChart
        data={history || []}
        period={selectedPeriod}
      />

      {/* ... autres composants */}
    </div>
  );
};
```

## 📝 Conventions de Code

### 1. Imports
```tsx
// Ordre des imports
import React from 'react';                    // React
import { useState } from 'react';             // React hooks
import { useQuery } from '@tanstack/react-query';  // External libs
import { cn, formatCurrency } from '@/lib/utils';  // Internal utils
import { StatCard } from '@/components/composite'; // Internal components
import { FiPlus } from 'react-icons/fi';      // Icons
import type { Position } from '@/types';      // Types
```

### 2. Naming
- **Composants**: PascalCase (`StatCard`, `PortfolioStats`)
- **Fichiers**: Même nom que le composant (`StatCard.tsx`)
- **Props**: Suffixe `Props` (`StatCardProps`)
- **Hooks**: Préfixe `use` (`usePortfolio`)
- **Utils**: camelCase (`formatCurrency`)

### 3. Props Interface
```tsx
// ✅ Bon
export interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

// ❌ Mauvais
type Props = {
  title: string;
  value: any;  // Éviter any
};
```

### 4. Composants
```tsx
// ✅ Bon - Export nommé
export const StatCard = ({ title, value }: StatCardProps) => {
  return <div>...</div>;
};

// ❌ Mauvais - Export par défaut
export default function StatCard(props) {
  return <div>...</div>;
}
```

## 🚀 Prochaines Étapes

### À Créer
1. **Composants Trading**
   - `OrderTicket.tsx` - Formulaire d'ordre
   - `OrderBook.tsx` - Carnet d'ordres
   - `PriceChart.tsx` - Graphique de prix

2. **Composants BVC**
   - `StockCard.tsx` - Carte action BVC
   - `IndexCard.tsx` - Carte indice (MASI, MADEX)
   - `SectorHeatmap.tsx` - Heatmap des secteurs

3. **Hooks Custom**
   - `usePortfolio.ts` - Logique portfolio
   - `useMarketData.ts` - Données marché
   - `usePriceUpdates.ts` - Mise à jour prix

### À Refactoriser
1. `PortfolioNew.tsx` - Utiliser nouveaux composants
2. `Markets.tsx` - Créer composants BVC
3. `Crypto.tsx` - Utiliser PriceDisplay

## 🎨 Design Tokens

### Couleurs
```css
/* Primary */
primary: #4ade80 (green)
secondary: #60a5fa (blue)
accent: #f59e0b (amber)

/* Feedback */
success: #22c55e
error: #f87171
warning: #fbbf24
info: #38bdf8

/* Neutral */
base-100: #050505 (brx-onyx)
base-200: #0b0b0b
base-300: #121212
```

### Typography
```css
font-display: 'Manrope'  /* Headings */
font-body: 'Inter'       /* Body text */
```

### Spacing
```css
gap-2: 0.5rem
gap-4: 1rem
gap-6: 1.5rem
```

## 📚 Ressources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **DaisyUI**: https://daisyui.com/components
- **React Icons**: https://react-icons.github.io/react-icons
- **TanStack Query**: https://tanstack.com/query

---

**✅ Système de composants créé et prêt à l'emploi !**
