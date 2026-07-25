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

## Proxy API (`worker/`)

Les vues qui lisent des données OGame passent par un Cloudflare Worker, parce
que l'API de Gameforge n'envoie pas d'en-tête CORS. Il normalise le XML en JSON
et évite d'expédier les gros documents au navigateur.

```bash
npm run api:dev      # proxy local sur http://localhost:8787
npm run api:deploy   # déploiement (npx wrangler login au préalable)
```

Le front lit l'URL du proxy dans `VITE_API_URL` (défaut :
`http://localhost:8787`). Détails, routes et modèle de sécurité dans
[`worker/README.md`](./worker/README.md).

## Branches et déploiement

- `develop` — branche d'intégration. Chaque pull request et chaque push y
  déclenche les tests puis un build de vérification, sans déploiement
  (`.github/workflows/ci.yml`).
- `master` — branche de release. Un push publie `dist/` sur la branche
  `gh-pages` (`.github/workflows/deploy.yml`). Site :
  <https://blog.rolljee.fr/ogame-ui/>.

## Feuille de route

Les vues **Joueurs** et **Mines** ont été retirées lors de la refonte, au motif
que les API OGame dont elles dépendaient avaient changé. **Ce diagnostic était
faux** : l'API publique de Gameforge répond normalement (vérifié le 25 juillet
2026), et le seul blocage est le **CORS navigateur** — il faut donc un proxy.
Détails, endpoints testés et fonctionnalités à ajouter dans
[`TODO.md`](./TODO.md).
