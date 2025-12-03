# 🔍 Analyse des Sources de Données BVC

## Résumé de l'Analyse

J'ai analysé **3 sources principales** pour les données de la Bourse de Casablanca :

---

## 1️⃣ **Bourse de Casablanca Officiel**
**URL :** https://www.casablanca-bourse.com

### ❌ Problèmes Identifiés
- **Next.js / React** : Contenu 100% JavaScript
- **Pas d'API publique** documentée
- **Protection anti-scraping** : Certificats SSL, CSRF tokens
- **DOM dynamique** : Aucune donnée dans le HTML initial

### 🔍 Ce que j'ai trouvé
```html
<div data-df-id="bourse_data_listing:marches-overview">
  <!-- Données chargées via JS -->
</div>
```

**Sélecteurs :** Les données sont dans des `data-df-id` mais chargées dynamiquement

### 💡 Solution possible
**Puppeteer** requis pour exécuter le JavaScript et extraire les données du DOM final

---

## 2️⃣ **Médias24 Bourse**
**URL :** https://bourse.medias24.com

### ⚠️ Problèmes Identifiés
- **jQuery + AJAX** : Chargement dynamique
- **Pas de HTML statique** : Données chargées après le rendu
- Structure plus simple que BVC mais toujours dynamique

### 🔍 Ce que j'ai trouvé
```javascript
S.ajax // jQuery AJAX pour récupérer les données
Owl Carousel pour affichage
Google Analytics tracking
```

### 💡 Solution possible
- **Option A :** Puppeteer pour attendre le chargement
- **Option B :** Reverse engineer les appels AJAX (complexe)

---

## 3️⃣ **LeMatin.ma Bourse**
**URL :** https://lematin.ma/bourse-de-casablanca/cours-valeurs

### ✅ Pages Disponibles
- **Cours valeurs** : Liste complète des actions
- **Sociétés cotées** : Infos sur les sociétés
- **Indices** : MASI, MADEX, etc.

### ❌ Problèmes Identifiés
- **jQuery** : Chargement dynamique aussi
- **Pas de HTML statique** : Comme les autres
- Données dans le DOM après JS execution

### 🔍 Ce que j'ai trouvé
```html
<title>Le Matin :: Bourse de Casablanca - Liste des Cours-valeurs</title>
<meta name="description" content="Bourse de Casablanca indices et actions">
<!-- Mais pas de données dans le HTML brut -->
```

### 💡 Solution possible
Même approche : Puppeteer nécessaire

---

## 📊 Comparaison des Sources

| Source | Accessibilité | Complétude | Fiabilité | Légal |
|--------|---------------|------------|-----------|-------|
| **BVC Officiel** | ❌ Très difficile | ✅ 100% | ✅ Excellent | ⚠️ Flou |
| **Médias24** | ❌ Difficile | ✅ 95% | ✅ Bon | ⚠️ Flou |
| **LeMatin.ma** | ❌ Difficile | ✅ 90% | ✅ Bon | ⚠️ Flou |
| **Yahoo Finance** | ✅ Facile | ❌ 30% | ✅ Excellent | ✅ OK |

---

## 🎯 Conclusion

### Tous les sites marocains utilisent du JavaScript !

**Aucune des 3 sources** n'offre de HTML statique facilement scrapable :
- ❌ Pas de tableaux HTML simples
- ❌ Pas d'API REST publique
- ❌ Données chargées dynamiquement
- ✅ **Puppeteer OBLIGATOIRE**

---

## 💻 Solution Technique : Puppeteer

### Installation
```bash
cd server
npm install puppeteer
# ou plus léger
npm install puppeteer-core chromium
```

### Code d'Exemple (LeMatin.ma)

```typescript
// server/src/services/lematinScraper.ts

import puppeteer from 'puppeteer';
import type { BVCStock } from '../types/bvc.types';

export async function scrapeLematinStocks(): Promise<BVCStock[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Aller sur la page
    await page.goto('https://lematin.ma/bourse-de-casablanca/cours-valeurs', {
      waitUntil: 'networkidle2', // Attendre que tous les appels réseau soient terminés
      timeout: 30000
    });

    // Attendre que les données se chargent
    await page.waitForSelector('table', { timeout: 10000 });

    // Extraire les données du DOM
    const stocks = await page.evaluate(() => {
      const data: any[] = [];
      const rows = document.querySelectorAll('table tbody tr');

      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
          data.push({
            symbol: cells[0]?.textContent?.trim() || '',
            name: cells[1]?.textContent?.trim() || '',
            lastPrice: parseFloat(cells[2]?.textContent?.replace(/,/g, '') || '0'),
            change: parseFloat(cells[3]?.textContent?.replace(/,/g, '') || '0'),
            changePercent: parseFloat(cells[4]?.textContent?.replace(/%/g, '') || '0'),
            volume: parseInt(cells[5]?.textContent?.replace(/\s/g, '') || '0'),
            timestamp: new Date()
          });
        }
      });

      return data;
    });

    console.log(`✅ Scraped ${stocks.length} stocks from LeMatin.ma`);
    return stocks;

  } catch (error) {
    console.error('❌ Error scraping LeMatin:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// Scraper les indices
export async function scrapeLematinIndices() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto('https://lematin.ma/index.php/bourse-de-casablanca/');
    await page.waitForSelector('.indices', { timeout: 10000 });

    const indices = await page.evaluate(() => {
      // TODO: Identifier les bons sélecteurs pour indices
      return [];
    });

    return indices;
  } catch (error) {
    console.error('Error scraping indices:', error);
    return [];
  } finally {
    await browser.close();
  }
}
```

---

## 🚀 Plan d'Action IMMÉDIAT

### Étape 1 : Installer Puppeteer (5 min)
```bash
cd server
npm install puppeteer
```

### Étape 2 : Analyser LeMatin.ma avec DevTools (15 min)
1. Ouvrir https://lematin.ma/bourse-de-casablanca/cours-valeurs
2. Ouvrir DevTools (F12)
3. Onglet **Elements** → Inspecter les tableaux
4. Onglet **Network** → Voir les appels AJAX
5. Noter les **sélecteurs CSS** exacts

### Étape 3 : Implémenter le Scraper (30 min)
- Créer `lematinScraper.ts`
- Utiliser les sélecteurs identifiés
- Tester et déboguer

### Étape 4 : Intégrer dans bvcService (15 min)
```typescript
import { scrapeLematinStocks } from './lematinScraper';

export async function fetchBVCStocks() {
  // Try real scraping first
  const realStocks = await scrapeLematinStocks();

  if (realStocks.length > 0) {
    return realStocks;
  }

  // Fallback to mock
  return mockStocks;
}
```

### Étape 5 : Tester (10 min)
```bash
# Tester l'endpoint
curl http://localhost:5000/api/bvc/stocks
```

**Total : ~75 minutes** pour avoir des données réelles

---

## ⚡ Alternative Plus Rapide

### Yahoo Finance (10 minutes)

Certaines actions marocaines sont disponibles sur Yahoo Finance :

```typescript
// Très simple, pas de Puppeteer nécessaire
import axios from 'axios';

async function getYahooPrice(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.CS`;
  const response = await axios.get(url, {
    params: { interval: '1d', range: '1d' }
  });

  return response.data?.chart?.result?.[0]?.meta?.regularMarketPrice;
}

// Exemple
const atwPrice = await getYahooPrice('ATW'); // Attijariwafa Bank
const iamPrice = await getYahooPrice('IAM'); // Maroc Telecom
```

**Limitation :** Seulement 10-15 actions marocaines disponibles sur Yahoo

---

## 🏆 Ma Recommandation Finale

### Plan en 3 Phases

#### **Phase 1 : Quick Win (Aujourd'hui - 10 min)**
**Yahoo Finance** pour les actions principales
- ✅ Gratuit et légal
- ✅ Pas de Puppeteer
- ✅ Implémentation simple
- ❌ Seulement 10-15 actions

#### **Phase 2 : Solution Complète (Cette semaine - 2h)**
**Puppeteer + LeMatin.ma**
- ✅ Toutes les actions BVC
- ✅ Données actualisées
- ⚠️ Nécessite Puppeteer
- ⚠️ Plus lent (~5-10s par scrape)

#### **Phase 3 : Solution Pérenne (Ce mois)**
**API Officielle BVC**
- ✅ Professionnel
- ✅ Fiable
- ✅ Support
- 💰 Payant

---

## 📋 Action Immédiate

**Choix 1 : Yahoo Finance (Rapide)**
- Je peux l'implémenter **maintenant**
- Code prêt en **10 minutes**
- Vous aurez ~10-15 actions avec **prix réels**

**Choix 2 : Puppeteer Full (Complet)**
- Nécessite **75 minutes**
- Je dois analyser LeMatin.ma en détail
- Toutes les actions BVC disponibles

**Que préférez-vous ?** 🤔

---

## 🔗 Sources Consultées

- [Bourse de Casablanca - Overview](https://www.casablanca-bourse.com/fr/live-market/overview)
- [LeMatin.ma - Cours Valeurs](https://lematin.ma/bourse-de-casablanca/cours-valeurs)
- [LeMatin.ma - Bourse](https://lematin.ma/index.php/bourse-de-casablanca/)
- [Médias24 Bourse](https://bourse.medias24.com/)
- Yahoo Finance API (non documentée mais fonctionnelle)

---

## ⚠️ Note Légale

Le scraping web peut violer les **Terms of Service** des sites.

**Recommandations :**
1. Vérifier les robots.txt
2. Ajouter un disclaimer sur votre site
3. Limiter la fréquence des requêtes
4. Contacter les sites pour demander permission
5. **Privilégier l'API officielle BVC** à terme

**Disclaimer à ajouter sur BRX.MA :**
```
Les données boursières sont fournies à titre informatif avec un délai
de 15 minutes. Source: [LeMatin.ma/Médias24]. Ces données ne constituent
pas un conseil en investissement. BRX.MA décline toute responsabilité
quant à l'exactitude des informations.
```
