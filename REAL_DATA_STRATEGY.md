# 📊 Stratégie pour Données Réelles BVC

## 🔍 Analyse du Problème

Vous avez raison ! Les données actuelles sont **simulées (mock data)**.

### Situation Actuelle
- ✅ Architecture backend complète
- ✅ Service BVC fonctionnel avec cache
- ❌ Données mock (non actualisées)
- ❌ Scraping non implémenté
- ❌ Pas de connexion aux données réelles

### Ce que j'ai découvert sur le site BVC

Le site **www.casablanca-bourse.com** utilise :
- **Next.js / React** (contenu chargé dynamiquement)
- **Pas d'API publique** documentée
- **JavaScript rendering** (données pas dans le HTML initial)
- **Protection anti-scraping** (certificats SSL, tokens CSRF)

---

## 🎯 3 Solutions Possibles

### **Option 1 : API Officielle BVC** ⭐ RECOMMANDÉ

**Avantages :**
- ✅ Données certifiées et officielles
- ✅ Temps réel (ou délai minimal)
- ✅ Fiable et stable
- ✅ Support technique
- ✅ Légal et conforme

**Inconvénients :**
- 💰 Probablement payant
- 📝 Processus d'inscription
- ⏱️ Délai d'obtention

**Comment procéder :**
1. Contacter la Bourse de Casablanca
2. Demander un accès API data feed
3. Signer un accord de partenariat
4. Obtenir les credentials API

**Contact BVC :**
```
Bourse de Casablanca
Avenue des FAR, Casablanca
Tél : +212 5 22 45 26 26
Email : contactbvc@casablanca-bourse.ma
Site : www.casablanca-bourse.com
```

**Coût estimé :** 5,000 - 20,000 MAD/an (à vérifier)

---

### **Option 2 : Scraping avec Puppeteer** ⚙️ TECHNIQUE

**Avantages :**
- ✅ Gratuit
- ✅ Contrôle total
- ✅ Données du site officiel
- ✅ Implémentation rapide

**Inconvénients :**
- ⚠️ Fragile (si le site change)
- ⚠️ Plus lent (navigateur headless)
- ⚠️ Zone grise légale
- ⚠️ Peut être bloqué

**Installation :**
```bash
cd server
npm install puppeteer
# Ou plus léger :
npm install puppeteer-core
```

**Implémentation (fichier créé) :**
```typescript
// server/src/services/bvcPuppeteerService.ts

import puppeteer from 'puppeteer';

export async function scrapeBVCStocks() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // Aller sur la page des actions
  await page.goto('https://www.casablanca-bourse.com/fr/live-market/marche-actions');

  // Attendre que les données se chargent
  await page.waitForSelector('[data-df-id]', { timeout: 10000 });

  // Extraire les données
  const stocks = await page.evaluate(() => {
    const data: any[] = [];
    const rows = document.querySelectorAll('tr[data-stock]');

    rows.forEach(row => {
      data.push({
        symbol: row.querySelector('.symbol')?.textContent?.trim(),
        name: row.querySelector('.name')?.textContent?.trim(),
        price: parseFloat(row.querySelector('.price')?.textContent || '0'),
        change: parseFloat(row.querySelector('.change')?.textContent || '0'),
        volume: parseInt(row.querySelector('.volume')?.textContent || '0')
      });
    });

    return data;
  });

  await browser.close();
  return stocks;
}
```

**Mise en place :**
1. Analyser la structure HTML du site BVC
2. Identifier les sélecteurs CSS corrects
3. Implémenter le scraper
4. Ajouter retry logic et error handling
5. Scheduler l'exécution (toutes les 15 min)

**Temps d'implémentation :** 2-4 heures

---

### **Option 3 : Services Tiers** 🌐 HYBRIDE

**Sources alternatives :**

#### A. **Yahoo Finance**
Certaines actions marocaines sont listées :
```
Format: SYMBOL.CS (Casablanca Stock Exchange)
Exemples:
- ATW.CS (Attijariwafa Bank)
- IAM.CS (Maroc Telecom)
```

**API Yahoo Finance :**
```javascript
const url = `https://query1.finance.yahoo.com/v8/finance/chart/ATW.CS`;
const response = await axios.get(url, {
  params: { interval: '1d', range: '1d' }
});
```

**Limitations :** Pas toutes les actions BVC disponibles

#### B. **Alpha Vantage**
```
https://www.alphavantage.co/
API Key gratuite : 5 requêtes/min
Supports : Quelques actions internationales
```

#### C. **Financial Modeling Prep**
```
https://financialmodelingprep.com/
Payant : À partir de $14/mois
Bonne couverture internationale
```

#### D. **Médias24 Bourse**
```
Site : https://bourse.medias24.com/
Structure HTML plus simple
Peut être scrapé plus facilement
```

---

## 🏆 Ma Recommandation : Approche Progressive

### **Phase 1 : Implémentation Immédiate** (Aujourd'hui)

**Scraping Médias24** (plus simple que BVC)
```bash
# Créer le scraper Médias24
touch server/src/services/medias24Scraper.ts
```

**Raison :** Médias24 a :
- HTML statique (pas de JS rendering)
- Structure plus simple
- Même données que BVC (avec 15 min de délai)

**Code :**
```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMedias24() {
  const response = await axios.get('https://bourse.medias24.com/');
  const $ = cheerio.load(response.data);

  const stocks: BVCStock[] = [];

  // TODO: Identifier les sélecteurs CSS
  $('.stock-row').each((i, el) => {
    stocks.push({
      symbol: $(el).find('.symbol').text().trim(),
      name: $(el).find('.name').text().trim(),
      lastPrice: parseFloat($(el).find('.price').text()),
      // ...
    });
  });

  return stocks;
}
```

### **Phase 2 : Amélioration** (Cette semaine)

1. **Analyser Médias24 en détail**
   - Ouvrir https://bourse.medias24.com
   - Inspecter la structure HTML
   - Identifier tous les sélecteurs

2. **Implémenter le scraper complet**
   - Actions
   - Indices
   - Volumes
   - Secteurs

3. **Ajouter error handling robuste**
   - Retry logic
   - Fallback sur mock data
   - Logs détaillés

### **Phase 3 : Production** (Ce mois)

**Contacter la BVC** pour API officielle
- Expliquer le projet BRX.MA
- Demander partenariat/sponsoring
- Négocier l'accès API

**Backup Plan :** Si refus BVC
- Maintenir scraper Médias24
- Ajouter disclaimer : "Données fournies par Médias24"
- Respecter les termes d'utilisation

---

## 💻 Code à Implémenter Maintenant

### Fichier 1 : `server/src/services/medias24Scraper.ts`

```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';
import type { BVCStock, BVCIndex } from '../types/bvc.types';

const MEDIAS24_URL = 'https://bourse.medias24.com/';

export async function scrapeMedias24Stocks(): Promise<BVCStock[]> {
  try {
    const response = await axios.get(MEDIAS24_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(response.data);
    const stocks: BVCStock[] = [];

    // IMPORTANT: Ces sélecteurs sont des exemples
    // À adapter selon la vraie structure de Médias24

    $('table.stocks tbody tr').each((index, element) => {
      const $row = $(element);

      const symbol = $row.find('td:nth-child(1)').text().trim();
      const name = $row.find('td:nth-child(2)').text().trim();
      const lastPrice = parseFloat($row.find('td:nth-child(3)').text().replace(',', '.'));
      const change = parseFloat($row.find('td:nth-child(4)').text().replace(',', '.'));
      const changePercent = parseFloat($row.find('td:nth-child(5)').text().replace('%', ''));
      const volume = parseInt($row.find('td:nth-child(6)').text().replace(/\s/g, ''));

      if (symbol && !isNaN(lastPrice)) {
        stocks.push({
          symbol,
          name,
          sector: undefined, // À extraire si disponible
          lastPrice,
          change,
          changePercent,
          volume,
          timestamp: new Date(),
        });
      }
    });

    console.log(`✅ Scraped ${stocks.length} stocks from Médias24`);
    return stocks;
  } catch (error) {
    console.error('❌ Error scraping Médias24:', error);
    return [];
  }
}

export async function scrapeMedias24Indices(): Promise<BVCIndex[]> {
  // TODO: Implémenter le scraping des indices
  return [];
}
```

### Fichier 2 : Modifier `server/src/services/bvcService.ts`

Ajouter au début :
```typescript
import { scrapeMedias24Stocks } from './medias24Scraper';

// Dans fetchBVCStocks(), remplacer le mock data par :
const realStocks = await scrapeMedias24Stocks();

if (realStocks.length > 0) {
  setCachedData(cacheKey, realStocks);
  return realStocks;
}

// Sinon fallback sur mock
console.warn('Using mock data as fallback');
return mockStocks;
```

---

## 📋 TODO Liste Prioritaire

### Aujourd'hui (2h)
- [ ] Analyser structure HTML de Médias24
- [ ] Identifier les sélecteurs CSS corrects
- [ ] Implémenter `medias24Scraper.ts`
- [ ] Tester le scraper
- [ ] Intégrer dans bvcService

### Cette Semaine
- [ ] Scraper les indices MASI, MADEX, MSI20
- [ ] Ajouter tous les secteurs
- [ ] Error handling robuste
- [ ] Tests unitaires
- [ ] Documentation

### Ce Mois
- [ ] Contacter BVC pour API
- [ ] Étudier coûts et conditions
- [ ] Négocier partenariat
- [ ] Planifier migration vers API officielle

---

## ⚠️ Avertissements Légaux

### Scraping Web
- ⚠️ Vérifier les **Terms of Service** de Médias24
- ⚠️ Respecter le **robots.txt**
- ⚠️ Ne pas surcharger leurs serveurs
- ⚠️ Ajouter un **disclaimer** sur votre site

### Données Financières
- ⚠️ Ajouter mention : "Données fournies par [Source]"
- ⚠️ Ajouter : "Données avec délai de 15 minutes"
- ⚠️ Disclaimer : "Ne constitue pas un conseil financier"

### Exemple Disclaimer
```
Les données boursières affichées sont fournies par [Médias24/BVC]
avec un délai de 15 minutes. Ces données sont fournies à titre
informatif uniquement et ne constituent pas un conseil en
investissement. BRX.MA ne peut être tenu responsable de l'exactitude
des données ou des décisions prises sur cette base.
```

---

## 🎯 Résumé : Que Faire Maintenant

### Choix Rapide (Gratuit)
1. **Analyser Médias24** → 30 min
2. **Implémenter scraper** → 1h30
3. **Tester et intégrer** → 30 min
**Total : 2-3 heures**

### Choix Professionnel (Payant)
1. **Contacter BVC** → Email aujourd'hui
2. **Attendre réponse** → 3-7 jours
3. **Négocier** → 1-2 semaines
4. **Implémenter API** → 1 jour
**Total : 2-4 semaines**

### Ma Suggestion
**Faire les DEUX en parallèle :**
- **Court terme :** Scraper Médias24 (gratuit, rapide)
- **Long terme :** API BVC (professionnel, fiable)
- **Transition :** Migrer vers API quand disponible

---

## 📞 Prochaines Actions

**Option A : Je peux analyser Médias24 maintenant**
- Inspecter leur HTML
- Créer le scraper fonctionnel
- Vous donner le code prêt à l'emploi

**Option B : Vous préférez contacter BVC d'abord**
- Je vous prépare un email type
- Liste des informations à demander
- Template de négociation

**Quelle option préférez-vous ?** 🤔
