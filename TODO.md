# TODO — Vues à refaire

Ces vues ont été **retirées** lors de la refonte UI/UX (juillet 2026) car elles
reposaient sur des API de Gameforge/OGame qui ont changé et **ne fonctionnent
plus**. Elles sont à reconstruire avec l'intégration corrigée.

> Le code d'origine reste consultable dans l'historique git (branche
> `chore/upgrade-deps-vite-react19`, avant le commit de refonte) et sur la
> branche `develop`.

---

## 1. Joueurs (`Players`)

**But :** lister les joueurs d'un univers, filtrer par statut (actif, inactif,
vacances, banni…), recherche floue par nom, et afficher le détail d'un joueur
(scores par catégorie, planètes et lunes avec coordonnées).

**Pourquoi c'est cassé :** appelait directement les endpoints XML publics via un
proxy CORS :
- `https://s{universe}-{lang}.ogame.gameforge.com/api/players.xml`
- `https://s{universe}-{lang}.ogame.gameforge.com/api/universe.xml`
- `https://s{universe}-{lang}.ogame.gameforge.com/api/playerData.xml?id={id}`

Gameforge a réorganisé son infrastructure (lobby unifié, nouveaux domaines,
sélection d'univers différente). Ces URLs et/ou le proxy `api.codetabs.com` ne
répondent plus de façon fiable.

**À refaire :**
- [ ] Identifier les nouveaux endpoints officiels (API `serverData` / lobby / liste des univers).
- [ ] Gérer la sélection d'univers via une **liste déroulante** alimentée dynamiquement (au lieu d'un numéro + code langue saisis à la main).
- [ ] Remplacer les codes de statut bruts (`A`, `i`, `I`, `v`, `b`…) par des libellés + icônes clairs.
- [ ] Prévoir une stratégie CORS pérenne (proxy maison / fonction serverless plutôt qu'un service tiers gratuit).

## 2. Mines / Production (`Mining`)

**But :** à partir des données « infocompte » collées par le joueur, calculer la
production et la consommation d'énergie de chaque mine (métal, cristal,
synthétiseur de deutérium) par planète.

**Pourquoi c'est cassé :**
- L'import reposait sur un **copier-coller du format « infocompte »** d'OGame (`Ogame.Building.parseInfoCompteData`) — barrière technique forte et format susceptible d'avoir changé.
- Récupérait la vitesse de l'univers via `https://s{universe}-{lang}.ogame.gameforge.com/api/serverData.xml` (même problème d'API que ci-dessus).

**À refaire :**
- [ ] Saisie **guidée** des niveaux de mines par planète (formulaire simple) plutôt qu'un collage de texte brut.
- [ ] Récupérer la vitesse d'univers via la nouvelle API (ou la demander explicitement).
- [ ] Afficher production/énergie avec les icônes de ressources et un thème cohérent avec le reste de l'app.
- [ ] Colonnes « énergie totale » / satellites solaires / centrale de fusion actuellement laissées en placeholder (`edit / Pas edit`) à compléter.

---

## Note technique
Les calculs métier restent fournis par la lib [`ogamejs`](https://www.npmjs.com/package/ogamejs)
(v3, ESM) : `Trader`, `Building`, `models`. Seule la **récupération des données**
côté OGame est à corriger, pas les formules.
