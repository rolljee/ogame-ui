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

Stack : **React 19 + Vite 8 + Sass**. Aucun framework CSS : le thème
« spatial » est un design system maison (`src/app.scss`).

## Déploiement

Un workflow GitHub Actions publie `dist/` sur la branche `gh-pages` à chaque
push sur `develop` (voir `.github/workflows/deploy.yml`). Site :
<https://blog.rolljee.fr/ogame-ui/>.

## Feuille de route

Les vues **Joueurs** et **Mines** ont été retirées car elles dépendaient d'API
OGame qui ont changé. Elles sont à reconstruire — détails dans [`TODO.md`](./TODO.md).
