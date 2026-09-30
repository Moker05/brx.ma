# Vidéo FABRA CONTROLE (Remotion)

Vidéo promotionnelle de ~57 s (1720 images, 1920×1080, 30 fps) générée avec [Remotion](https://www.remotion.dev/).

## Scènes

| # | Scène | Fichier |
|---|-------|---------|
| 1 | Intro (logo) | `src/scenes/Opening.tsx` |
| 2 | Accroche « Contrôler aujourd'hui… » | `src/scenes/Opening.tsx` |
| 3 | Qui sommes-nous | `src/scenes/Opening.tsx` |
| 4 | Métiers | `src/scenes/Services.tsx` |
| 5 | Fiche de contrôle | `src/scenes/Services.tsx` |
| 6 | Contrôles réglementaires | `src/scenes/Services.tsx` |
| 7 | Méthode | `src/scenes/Closing.tsx` |
| 8 | Bénéfices | `src/scenes/Closing.tsx` |
| 9 | Références | `src/scenes/Closing.tsx` |
| 10 | Outro / contact | `src/scenes/Closing.tsx` |

Durées et transitions : `src/Root.tsx`. Couleurs et polices : `src/theme.ts`.

## Utilisation

```bash
cd video
npm install
npm run dev      # Remotion Studio (aperçu dans le navigateur)
npm run render   # => out/fabra-controle.mp4
```

## Logo

`public/logo-square.png` est un **logo provisoire** (« FC »). Remplacez-le par le vrai logo carré
FABRA CONTROLE (PNG, idéalement 800×800, fond blanc) avant le rendu final.
