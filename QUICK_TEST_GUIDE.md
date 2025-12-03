# 🧪 Guide de Test Rapide - BRX.MA

## ✅ Vérification Backend (TERMINÉ)

Les serveurs sont **déjà en cours d'exécution** ✅

- **Backend :** `http://localhost:5000` ✅
- **Frontend :** `http://localhost:5173` ✅

---

## 🎯 Tests à Effectuer Maintenant

### 1️⃣ **Bande Déroulante (Ticker Tape)** - 30 secondes

**URL :** `http://localhost:5173` (n'importe quelle page)

**À vérifier :**
- [ ] La bande défile en haut de la page (sous le header)
- [ ] Affiche les indices : MASI, MADEX, MSI20
- [ ] Affiche les actions : ATW, BCP, IAM, etc.
- [ ] Couleurs : 🟢 Vert pour hausse, 🔴 Rouge pour baisse
- [ ] **Passer la souris dessus** → L'animation doit se mettre en pause
- [ ] Défilement fluide et continu (60fps)

**Screenshot suggéré :** Prendre une capture de la bande déroulante

---

### 2️⃣ **Page Marchés BVC** - 2 minutes

**URL :** `http://localhost:5173/markets/bvc`

#### **A. Indices Principaux**
- [ ] 3 cards avec gradient (bleu/violet)
- [ ] MASI : ~13,450
- [ ] MADEX : ~10,987
- [ ] MSI20 : ~945
- [ ] Variations en % affichées

#### **B. Statistiques du Marché**
- [ ] 4 cards avec icônes colorées
- [ ] En hausse : 6
- [ ] En baisse : 4
- [ ] Inchangés : 0
- [ ] Volume total : 624K

#### **C. Performance Sectorielle**
- [ ] Grid de 7 secteurs
- [ ] Banques, Télécommunications, Agroalimentaire, etc.
- [ ] Performance en % visible
- [ ] **Cliquer sur un secteur** → Le filtre doit s'appliquer

#### **D. Top Hausses**
- [ ] 5 actions affichées
- [ ] LHM (Lesieur) : +2.46%
- [ ] SID (Sidérurgie) : +2.09%
- [ ] IAM (Maroc Telecom) : +1.61%
- [ ] Cards cliquables (hover effect)

#### **E. Top Baisses**
- [ ] 5 actions en rouge
- [ ] BCP : -1.21%
- [ ] MNG (Managem) : -1.05%

#### **F. Plus Actifs (Volume)**
- [ ] 5 actions
- [ ] IAM en tête (210K volume)

#### **G. Toutes les Actions**
- [ ] **Tester la recherche** : Taper "ATW" → Doit filtrer
- [ ] **Tester le filtre secteur** : Sélectionner "Banques" → Doit afficher ATW, BCP, CIH, BOA
- [ ] **Bouton Actualiser** : Cliquer → Icône doit tourner

**Screenshot suggéré :** Vue complète de la page avec tous les éléments visibles

---

### 3️⃣ **Portfolio Amélioré** - 3 minutes

**URL :** `http://localhost:5173/portfolio`

#### **A. Ajouter une Action BVC**
1. Cliquer sur **"Ajouter un actif"**
2. Modal doit s'ouvrir
3. Remplir :
   - Type : **Action (BVC)**
   - Symbole : **ATW**
   - Nom : **Attijariwafa Bank**
   - Quantité : **10**
   - Prix d'achat : **520** MAD
   - Date : Aujourd'hui
4. Cliquer **"Ajouter l'actif"**
5. **Vérifier** :
   - [ ] L'actif apparaît dans "Positions actuelles"
   - [ ] Valeur investie : 5,200 MAD
   - [ ] Valeur actuelle calculée
   - [ ] PnL affiché (devrait être proche de 0 car prix mock = 520)

#### **B. Graphique de Suivi**
- [ ] Graphique visible (peut être vide si premier usage)
- [ ] 4 boutons de période : 1S, 1M, 1A, Max
- [ ] **Cliquer sur chaque bouton** → Doit changer (pas de données encore)

#### **C. Actualiser les Prix**
1. Cliquer sur **"Actualiser les prix"**
2. **Vérifier** :
   - [ ] Bouton affiche une animation de rotation
   - [ ] Prix de ATW mis à jour (devrait rester 520 MAD avec mock)
   - [ ] PnL recalculé

#### **D. Historique des Transactions**
- [ ] Transaction d'achat de ATW visible
- [ ] Date et heure correctes
- [ ] Type : BUY
- [ ] Quantité : 10
- [ ] Prix : 520 MAD
- [ ] Total : 5,200 MAD
- [ ] Frais : 26 MAD (0.5%)

**Screenshot suggéré :** Portfolio avec la nouvelle position ATW

---

### 4️⃣ **Test de Cache** - 30 secondes

#### **Vérifier la Performance**
1. Ouvrir **DevTools** (F12)
2. Onglet **Network**
3. Aller sur `/markets/bvc`
4. Observer le temps de réponse :
   - [ ] Première requête : ~50ms
   - [ ] Cliquer sur "Actualiser"
   - [ ] Deuxième requête (cache) : < 10ms

#### **Vérifier le Cache Backend**
```bash
curl http://localhost:5000/api/bvc/cache/stats
```
**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "size": 4,
    "keys": ["bvc:stocks", "bvc:indices", "bvc:market-summary", "bvc:sectors"],
    "ttl": 900000
  }
}
```

---

### 5️⃣ **Test Responsive** - 1 minute

#### **Mobile (< 768px)**
1. Ouvrir **DevTools** (F12)
2. Cliquer sur l'icône mobile (Ctrl+Shift+M)
3. Sélectionner **iPhone 12 Pro**
4. **Vérifier** :
   - [ ] Ticker tape visible et défile correctement
   - [ ] Page Marchés BVC : Grid passe en 1 colonne
   - [ ] Cards restent lisibles
   - [ ] Recherche et filtres accessibles

#### **Tablet (768px - 1024px)**
1. Sélectionner **iPad**
2. **Vérifier** :
   - [ ] Grid en 2 colonnes
   - [ ] Tout reste accessible

---

## 🐛 Tests de Cas d'Erreur

### **Test 1 : Recherche Sans Résultat**
1. Page Marchés BVC
2. Rechercher "XXXXX"
3. **Résultat attendu** : Aucune action trouvée (affichage vide propre)

### **Test 2 : Filtre Secteur Vide**
1. Créer un filtre pour un secteur sans actions (si possible)
2. **Résultat attendu** : Message approprié

### **Test 3 : Portfolio Vide**
1. Cliquer sur "Réinitialiser" (confirmer)
2. **Résultat attendu** :
   - [ ] Message "Aucune position ouverte"
   - [ ] Lien pour ajouter un actif
   - [ ] Solde reset à 100,000 MAD

---

## 📊 Checklist Finale

### **Backend**
- [x] Server running on port 5000
- [x] 7 API endpoints fonctionnels
- [x] Cache intelligent activé (15 min TTL)
- [x] CORS configuré
- [x] Mock data cohérentes

### **Frontend**
- [ ] Ticker Tape visible et animée
- [ ] Ticker Tape pause au survol
- [ ] Page Marchés BVC accessible
- [ ] Indices affichés correctement
- [ ] Top Gainers/Losers fonctionnels
- [ ] Secteurs cliquables et filtrent
- [ ] Recherche fonctionne
- [ ] Bouton Actualiser marche
- [ ] Portfolio peut ajouter actions BVC
- [ ] Graphique de suivi visible
- [ ] Filtres temporels fonctionnent
- [ ] PnL calculé correctement
- [ ] Transactions loggées

### **UX/Design**
- [ ] Couleurs appropriées (vert/rouge)
- [ ] Hover effects sur cards
- [ ] Loading states visibles
- [ ] Responsive mobile/tablet
- [ ] Icons cohérents
- [ ] Typographie lisible

### **Performance**
- [ ] Réponse API < 100ms
- [ ] Cache réduit les appels
- [ ] Animation 60fps
- [ ] Pas de lag au scroll

---

## 🎉 Résultat Attendu

Si tous les tests passent :

✅ **Ticker Tape** : Bande déroulante fonctionnelle sur toutes les pages
✅ **Page Marchés BVC** : Interface complète avec données live
✅ **Portfolio** : Intégration actions BVC avec calcul PnL
✅ **Performance** : Cache optimise les requêtes
✅ **Responsive** : Fonctionne sur tous les appareils

---

## 📸 Screenshots à Prendre

1. **Ticker Tape** en action (avec pause au survol)
2. **Page Marchés BVC** complète
3. **Portfolio** avec position ATW ajoutée
4. **DevTools Network** montrant cache performance
5. **Mobile view** responsive

---

## 🚀 Après les Tests

### Si tout fonctionne :
1. ✅ Valider l'implémentation
2. 📝 Documenter les bugs trouvés
3. 🎯 Passer au scraping réel des données BVC
4. 🚢 Préparer le déploiement

### Si des bugs :
1. 🐛 Noter les problèmes trouvés
2. 📋 Créer une liste de corrections
3. 🔧 Fixer les bugs prioritaires
4. 🔄 Re-tester

---

## ⏱️ Temps Total Estimé

- **Tests Backend** : 2 min (TERMINÉ ✅)
- **Tests Frontend** : 7 min
- **Tests Responsive** : 1 min
- **Tests Erreurs** : 2 min

**TOTAL : ~12 minutes de tests**

---

## 💡 Conseils

- Ouvrir les **DevTools** dès le début
- Activer l'onglet **Console** pour voir les logs
- Tester avec **connexion lente** (Throttling)
- Prendre des **screenshots** à chaque étape
- Noter les **observations** et suggestions d'amélioration

---

**Bon test ! 🧪✨**
