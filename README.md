# OGame Tools

Petit outil web (fan-made) pour OGame. Actuellement : un **calculateur de
commerce** qui convertit une ressource (métal, cristal, deutérium) en les deux
autres selon un taux d'échange et une répartition. Interface bilingue (FR / EN),
pensée pour être utilisable sans connaissance technique.

Les calculs métier proviennent de la lib [`ogamejs`](https://www.npmjs.com/package/ogamejs).

## Développement

```bash
npm install
npm run dev      # serveur local (Vite)
npm run build    # build de production dans dist/
npm run preview  # prévisualise le build
```

## Tests

Vitest + Testing Library, en environnement jsdom (configuration dans la section
`test` de `vite.config.js`).

```bash
npm test            # une passe
npm run test:watch  # mode watch
npm run test:coverage
```

Les tests vivent à côté du code qu'ils couvrent (`*.test.js{,x}`). Les
composants se rendent via l'utilitaire `renderWithI18n` de
`src/test/utils.jsx`, qui fournit le contexte i18n et fixe la langue.

Stack : **React 19 + Vite 8 + Sass**. Aucun framework CSS : le thème
« spatial » est un design system maison (`src/app.scss`).

## Branches et déploiement

- `develop` — branche d'intégration. Chaque pull request et chaque push y
  déclenche les tests puis un build de vérification, sans déploiement
  (`.github/workflows/ci.yml`).
- `master` — branche de release. Un push publie `dist/` sur la branche
  `gh-pages` (`.github/workflows/deploy.yml`). Site :
  <https://blog.rolljee.fr/ogame-ui/>.

## Feuille de route

Les vues **Joueurs** et **Mines** ont été retirées car elles dépendaient d'API
OGame qui ont changé. Elles sont à reconstruire — détails dans [`TODO.md`](./TODO.md).
