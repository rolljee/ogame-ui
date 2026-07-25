# TODO — Vues à refaire et fonctionnalités à ajouter

Deux vues ont été **retirées** lors de la refonte UI/UX (juillet 2026), au motif
que les API de Gameforge/OGame dont elles dépendaient ne fonctionnaient plus.

> **Ce diagnostic était faux** — voir « État réel de l'API » ci-dessous. L'API
> publique est vivante ; le seul blocage est le **CORS navigateur**. Les vues
> sont donc reconstructibles sans attendre quoi que ce soit de Gameforge.

> Le code d'origine reste consultable dans l'historique git (branche
> `chore/upgrade-deps-vite-react19`, avant le commit de refonte) et sur la
> branche `develop`.

---

## État réel de l'API (vérifié le 25 juillet 2026)

### L'API XML publique répond normalement

Testé sur `s172-fr` (univers FR réel), version de jeu `13.0.0-r5` :

| Endpoint | Statut | Taille |
| --- | --- | --- |
| `https://s{universe}-{lang}.ogame.gameforge.com/api/serverData.xml` | 200 | 60 Ko |
| `https://s{universe}-{lang}.ogame.gameforge.com/api/players.xml` | 200 | 245 Ko |
| `https://s{universe}-{lang}.ogame.gameforge.com/api/alliances.xml` | 200 | 82 Ko |
| `https://s{universe}-{lang}.ogame.gameforge.com/api/universe.xml` | 200 | **3,4 Mo** |

Les champs utiles sont tous présents : `topScore`, `debrisFactor`,
`cargoHyperspaceTechMultiplier`, `speed`, `speedFleet*`, `galaxies`, `systems`…

**Pourquoi ça semblait cassé :** l'univers `176` (utilisé dans les tests et dans
les exemples du README de `og-bot-discord`) **n'existe plus**. Les univers FR
actuels sont 172, 198, 253, 258, 260, 263… Un numéro d'univers mort donne un
échec de connexion, qui a été interprété à tort comme une réorganisation
d'infrastructure. Il n'y a pas eu de changement d'endpoints.

Preuve indépendante : le bot [`rolljee/og-bot-discord`](https://github.com/rolljee/og-bot-discord)
consomme exactement ces URLs en `fetch` direct, sans proxy, et tourne toujours en
production sur le Discord OGame FR.

### Le seul vrai blocage : le CORS

Aucun de ces endpoints ne renvoie d'en-tête `access-control-allow-origin` — un
`fetch` depuis le navigateur est donc bloqué. C'est ce que masquait le proxy
tiers `api.codetabs.com`, qui n'est pas fiable.

⚠️ L'API lobby (ci-dessous) renvoie des en-têtes CORS **partiels**
(`allow-methods`, `allow-credentials`, `allow-headers`) mais **jamais**
`allow-origin`, préflight `OPTIONS` compris. Elle n'est donc pas non plus
appelable directement depuis le navigateur.

### Bonne nouvelle : la liste des univers existe en JSON

`https://lobby.ogame.gameforge.com/api/servers` → 200, **401 univers**, 24
langues, avec les réglages déjà inclus :

```json
{ "language": "fr", "number": 172, "name": "Tucana", "playerCount": 466,
  "playersOnline": 4, "opened": "...", "serverClosed": 0,
  "settings": { "economySpeed": 8, "fleetSpeedWar": 2, "fleetSpeedPeaceful": 4,
                "debrisFieldFactorShips": 70, "planetFields": 30,
                "universeSize": 6, ... } }
```

C'est exactement le sélecteur d'univers dynamique demandé plus bas. Seul
`topScore` manque (il reste à lire dans `serverData.xml`).

---

## 0. Prérequis transverse — couche données (proxy)

**✅ Fait** — Cloudflare Worker dans [`worker/`](./worker/), documenté dans
[`worker/README.md`](./worker/README.md). Routes : `/universes`, `/server-data`,
`/players`, `/player`, `/alliances`. Client front dans `src/api/ogame.js`.

- [x] Fonction serverless proxifiant les endpoints Gameforge (Cloudflare Worker,
      `wrangler.toml` à la racine).
- [x] Parser le XML → JSON côté serveur (`fast-xml-parser`, qui tourne dans le
      runtime Workers contrairement à `xml2js`).
- [x] Cache agressif : 1 h côté edge (`cf.cacheTtl`) et côté navigateur
      (`Cache-Control`).
- [x] **Filtrer côté serveur** : `players.xml` 245 Ko → 236 o pour une
      recherche, et `universe.xml` (3,4 Mo) n'est plus téléchargé du tout —
      `playerData.xml` contient déjà les planètes et les lunes, et il est plus
      frais.
- [x] Abandonner `api.codetabs.com`.
- [x] Validation stricte de `universe` / `lang` / `id` : ils entrent dans un nom
      d'hôte, donc une injection permettrait d'atteindre un hôte arbitraire.
- [x] **Déployé** sur <https://ogame-api.rolljee.workers.dev> (compte Cloudflare,
      plan Free, sous-domaine `rolljee.workers.dev`). `VITE_API_URL` est dans
      `.env.production`.
- [x] `ALLOWED_ORIGIN` restreint à `https://blog.rolljee.fr` +
      `http://localhost:3000`, avec `Vary: Origin` sur les réponses cachées.

---

## 1. Joueurs (`Players`)

**But :** lister les joueurs d'un univers, filtrer par statut (actif, inactif,
vacances, banni…), recherche floue par nom, et afficher le détail d'un joueur
(scores par catégorie, planètes et lunes avec coordonnées).

**Les données sont prêtes** : `searchPlayers()` et `fetchPlayer()` dans
`src/api/ogame.js`. Il ne reste que l'UI. La fusion avec `universe.xml` du bot
(`mergePlanets`) est inutile : `playerData.xml` est déjà complet.

- [ ] Sélection d'univers via **liste déroulante** — `fetchUniverses({ lang })`
      renvoie déjà les univers ouverts, triés, avec leurs réglages.
- [ ] Statuts : le proxy renvoie déjà des booléens (`vacation`, `inactive`,
      `longInactive`, `banned`, `admin`, `outlaw`) au lieu des codes bruts. Reste
      à choisir libellés + icônes.
- [ ] Lien cliquable vers la galaxie pour chaque coordonnée.

## 2. Mines / Production (`Mining`)

**But :** à partir des niveaux de mines, calculer la production et la
consommation d'énergie de chaque mine (métal, cristal, synthétiseur de
deutérium) par planète.

La vitesse d'univers est disponible sans effort : `economySpeed` dans l'API
lobby, ou `speed` dans `serverData.xml`. Le point coûteux est l'UI, pas les
données.

- [ ] Saisie **guidée** des niveaux de mines par planète (formulaire simple)
      plutôt qu'un copier-coller du format « infocompte »
      (`Ogame.Building.parseInfoCompteData`) — barrière technique forte.
- [ ] Afficher production/énergie avec les icônes de ressources et un thème
      cohérent avec le reste de l'app.
- [ ] Colonnes « énergie totale » / satellites solaires / centrale de fusion
      laissées en placeholder (`edit / Pas edit`) à écrire entièrement.

---

## 3. Fonctionnalités à porter depuis le bot Discord

Comparaison avec [`rolljee/og-bot-discord`](https://github.com/rolljee/og-bot-discord).

| Bot | Fonction | Priorité |
| --- | --- | --- |
| `!ogc` | calculateur de commerce | ✅ fait |
| `!mb` | proba de moonbreak + pertes RIP estimées (1 à 4 attaquants) | ✅ fait (`src/Moonbreak/`) |
| `!ogs` | réglages serveur (vitesses, débris, galaxies, top score…) | ✅ fait (`src/ServerSettings/`) |
| `!oge` | fret d'expédition (capacité max, nb de GT/PT selon hyperespace) | ✅ fait (`src/Expeditions/`) |
| `!ogl` | lien galaxie + nb de clés/sondes pour le seuil de lune à 2 M de débris | ✅ fait (`src/MoonLock/`) |
| `!ogp` | planètes + lunes + points d'un joueur | = vue Joueurs (§1) |
| `!oga` | membres d'une alliance | 3 — `searchAlliances()` est prête |

- [x] **Moonbreak** (`mb.js`) — porté dans `src/Moonbreak/formulas.js`, parité
      numérique vérifiée avec le bot. Un écart volontaire : le bot ne plafonne
      pas la probabilité par vague à 1 dans `getLosses`, ce qui donne des pertes
      négatives et des `NaN` dès ~6 RIP par vague sur une petite lune
      (`!mb 3464 200`). **Correctif à remonter au bot.**
- [ ] Courbe de proba selon le nombre de RIP — la visualisation que Discord ne
      peut pas offrir. Pas encore faite.
- [x] **Réglages serveur** (`serverData.js`) — première vue branchée sur le
      proxy, avec `UniversePicker` (réutilisable) et le hook `useApiData`.
      Affiche aussi le taux d'échange officiel de l'univers, directement
      utilisable dans le calculateur de commerce.
- [x] **Fret d'expédition** (`expeditions.js`) — porté dans
      `src/Expeditions/formulas.js`, parité numérique vérifiée avec le bot.
      Deux ajouts : le pathfinder devient un interrupteur (le bot le suppose
      toujours présent) et le plancher de 200 unités du bot est omis, il ne peut
      jamais s'appliquer avec une base minimale de 40 000.
- [x] **Verrou de lune / lien galaxie** (`create-link.js`) — porté dans
      `src/MoonLock/`, parité numérique vérifiée avec le bot. `Ogame.models`
      n'a pas bougé entre la v3 et la v4 : `Destroyable[1]` (chasseur léger) et
      `Destroyable[15]` (sonde) sont toujours aux mêmes identifiants, et
      `Ogame.i18n.getName()` fournit les noms FR/EN sans clés à écrire.
      Ajouts par rapport au bot : les coordonnées sont validées contre la taille
      réelle de l'univers, et le lien est copiable.
- [ ] **Alliances** (`alliances.utils.js`).

---

## Notes techniques

- Les calculs métier restent fournis par la lib
  [`ogamejs`](https://www.npmjs.com/package/ogamejs) : cette app est en **v4**
  (exports : `Trader`, `Building`, `Fleets`, `Research`, `i18n`, `models`) alors
  que le bot est en **v3** — revérifier les accès `Ogame.models` avant de
  recopier une formule.
- Le bot répond uniquement en français, en dur. Chaque vue portée demandera ses
  clés dans `src/i18n/translations.js` (FR + EN).
