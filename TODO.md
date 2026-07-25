# TODO — Vues à refaire et fonctionnalités à ajouter

Deux vues ont été **retirées** lors de la refonte UI/UX (juillet 2026), au motif
que les API de Gameforge/OGame dont elles dépendaient ne fonctionnaient plus.
La vue Joueurs a été reconstruite ; la vue Mines / Production a été **abandonnée**
(décision du 25 juillet 2026, voir plus bas).

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
`/players`, `/player`, `/alliances`, `/alliance`. Client front dans
`src/api/ogame.js`.

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
- [x] **Jointures côté serveur** : Gameforge répartit l'information sur deux
      documents (`players.xml` ne connaît qu'un id d'alliance, `alliances.xml`
      que des ids de membres). Le proxy les recoupe, le navigateur ne voit
      jamais un id non résolu.

---

## 1. Joueurs (`Players`) — ✅ fait (`src/Players/`)

**But :** lister les joueurs d'un univers, filtrer par statut (actif, inactif,
vacances, banni…), recherche floue par nom, et afficher le détail d'un joueur
(scores par catégorie, planètes et lunes avec coordonnées).

La fusion avec `universe.xml` du bot (`mergePlanets`) s'est bien avérée
inutile : `playerData.xml` porte déjà les planètes et les lunes.

- [x] Sélection d'univers via **liste déroulante** (`UniversePicker`).
- [x] Statuts en booléens, avec libellés et icônes. `i` et `I` arrivent
      ensemble au-delà de 28 jours : seul le badge le plus long est affiché,
      mais le filtre « inactif » attrape bien les deux.
- [x] Lien cliquable vers la galaxie pour chaque coordonnée.
- [x] La recherche part sur **soumission** (Entrée ou bouton), pas à chaque
      frappe : le proxy doit lire `players.xml` en entier pour filtrer.
- [x] Les catégories de score non documentées par Gameforge (types 8 à 21,
      `key: null`) sont ignorées plutôt qu'affichées sous un libellé inventé.
- [x] Le tag de l'alliance sur chaque ligne de résultat. `players.xml` ne donne
      que l'id : le proxy croise avec `alliances.xml` côté serveur, donc le
      navigateur ne voit jamais un id non résolu.
- [x] **Annuaire complet** plutôt que recherche obligatoire : `/roster` renvoie
      tous les joueurs de l'univers d'un coup (56 Ko gzip sur s282), la vue filtre
      et trie en mémoire — nom, statut, **galaxie et système**, tri par nom ou par
      position, sans une requête de plus.
- [x] Les coordonnées viennent d'`universe.xml`, seul document à les donner pour
      tout le monde. Il est **scanné** (2 attributs) et non parsé : 7 ms au lieu de
      136 ms sur les 3,2 Mo de s172. Il est aussi le plus vieux des trois
      documents (85 h observées), donc la vue affiche l'âge des positions.

## 2. Alliances (`Alliances`) — ✅ fait (`src/Alliances/`)

**But :** trouver une alliance par son nom ou son tag, et voir son effectif
complet : chaque membre avec son statut, le fondateur, et la part de l'alliance
encore active.

- [x] Deux routes proxy plutôt qu'une : `/alliances` renvoie des résumés avec
      `memberCount` (les ids de membres seuls n'apprennent rien au navigateur),
      `/alliance?id=` renvoie l'alliance avec ses membres résolus en joueurs.
- [x] La jointure `alliances.xml` × `players.xml` est faite côté serveur, les
      deux documents étant cachés côté edge.
- [x] Un membre absent de `players.xml` (les deux documents sont générés à
      quelques minutes d'écart) garde sa ligne, étiquetée par son id, en fin de
      liste : le compte annoncé reste juste.
- [x] Répartition par statut : ce que le bot Discord ne peut pas montrer, et la
      vraie question quand on regarde une alliance (« combien jouent encore ? »).
- [x] Filtres de statut sur les membres, réutilisés depuis la vue Joueurs
      (`src/components/status.js`, `StatusBadges`).
- [x] La `homepage` d'alliance est du texte saisi par un tiers : seul un lien
      `http(s)` est rendu, jamais un `javascript:` ni une URL relative.

## 3. Mines / Production (`Mining`) — ❌ abandonné

Vue **non reconstruite**, décision du 25 juillet 2026 : peu d'intérêt en
pratique. Le jeu affiche déjà la production de chaque mine, et la seule valeur
ajoutée aurait été la simulation — pour un coût d'UI élevé (saisie des niveaux
de mines planète par planète, satellites solaires, centrale de fusion).

Les données ne sont pas le problème si le sujet revient un jour : la vitesse
d'univers est dans `economySpeed` (API lobby) ou `speed` (`serverData.xml`), et
les formules sont dans `Ogame.Building`.

---

## 4. Fonctionnalités à porter depuis le bot Discord

Comparaison avec [`rolljee/og-bot-discord`](https://github.com/rolljee/og-bot-discord).

| Bot | Fonction | Priorité |
| --- | --- | --- |
| `!ogc` | calculateur de commerce | ✅ fait |
| `!mb` | proba de moonbreak + pertes RIP estimées (1 à 4 attaquants) | ✅ fait (`src/Moonbreak/`) |
| `!ogs` | réglages serveur (vitesses, débris, galaxies, top score…) | ✅ fait (`src/ServerSettings/`) |
| `!oge` | fret d'expédition (capacité max, nb de GT/PT selon hyperespace) | ✅ fait (`src/Expeditions/`) |
| `!ogl` | lien galaxie + nb de clés/sondes pour le seuil de lune à 2 M de débris | ✅ fait (`src/MoonLock/`) |
| `!ogp` | planètes + lunes + points d'un joueur | ✅ fait — vue Joueurs (§1) |
| `!oga` | membres d'une alliance | ✅ fait (`src/Alliances/`) |

- [x] **Moonbreak** (`mb.js`) — porté dans `src/Moonbreak/formulas.js`, parité
      numérique vérifiée avec le bot. Un écart volontaire : le bot ne plafonne
      pas la probabilité par vague à 1 dans `getLosses`, ce qui donne des pertes
      négatives et des `NaN` dès ~6 RIP par vague sur une petite lune
      (`!mb 3464 200`). **Correctif remonté au bot** et mergé, voir §5.
- [x] Courbe de proba selon le nombre de RIP — la visualisation que Discord ne
      peut pas offrir, dans `src/Moonbreak/components/MoonbreakCurve.jsx` (SVG
      inline, sans dépendance). L'axe s'arrête au palier des 95 % : aller jusqu'à
      99 % l'étirerait à 585 RIP sur une lune de 8 944 km et écraserait toute la
      zone utile. Le seuil des 99 % reste donné en chiffre sous le graphique.
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
- [x] **Alliances** (`alliances.utils.js`) — porté dans `src/Alliances/`, voir
      §2. Le bot liste les membres à plat ; la vue y ajoute la répartition par
      statut et le filtrage, qu'une réponse Discord ne peut pas offrir.

---

## 5. Reste ouvert

Rien. Le dernier point ouvert est retombé :

- [x] **Correctif remonté au bot** — `getLosses` ne plafonnait pas la
      probabilité par vague à 1, d'où des pertes négatives et des `NaN` dès ~6
      RIP par vague sur une petite lune (`!mb 3464 200`).
      [`og-bot-discord` PR #2](https://github.com/rolljee/og-bot-discord/pull/2),
      mergée le 25 juillet 2026 (commit `ff13189`), avec un test de
      non-régression.

---

## Notes techniques

- Les calculs métier restent fournis par la lib
  [`ogamejs`](https://www.npmjs.com/package/ogamejs) : cette app est en **v4**
  (exports : `Trader`, `Building`, `Fleets`, `Research`, `i18n`, `models`) alors
  que le bot est en **v3** — revérifier les accès `Ogame.models` avant de
  recopier une formule.
- Le bot répond uniquement en français, en dur. Chaque vue portée demandera ses
  clés dans `src/i18n/translations.js` (FR + EN).
