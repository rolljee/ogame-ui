# `ogame-api` — proxy CORS pour l'API OGame

Cloudflare Worker qui expose l'API publique de Gameforge au navigateur.

## Pourquoi

L'API publique de Gameforge **fonctionne** (vérifié le 25 juillet 2026, jeu en
version 13.0.0-r5), mais elle ne renvoie **aucun en-tête
`Access-Control-Allow-Origin`** — ni sur les `.xml` des univers, ni sur l'API
lobby. Un `fetch` depuis le navigateur est donc bloqué. Ce worker fait l'appel
côté serveur, normalise le XML en JSON et ajoute les en-têtes CORS.

Il évite aussi d'expédier les gros documents au navigateur :

| Ce que le navigateur devrait charger | Ce que le proxy renvoie |
| --- | --- |
| `players.xml` — 245 Ko | recherche `?search=tara` → **236 o** |
| `universe.xml` — 3,4 Mo | `?id=100010` → **2,7 Ko** |

Les planètes et les lunes viennent de `playerData.xml`, qui les contient déjà et
qui est **plus frais** qu'`universe.xml` (~2 jours d'écart sur les timestamps
observés). `universe.xml` n'est jamais téléchargé.

## Routes

Toutes en `GET`, réponses en JSON, `Cache-Control: public, max-age=3600`.

| Route | Paramètres | Renvoie |
| --- | --- | --- |
| `/universes` | `lang` (optionnel) | les univers ouverts, triés par langue puis numéro, avec leurs réglages |
| `/server-data` | `universe`, `lang` | réglages du serveur (`speed`, `topScore`, `debrisFactor`…) |
| `/players` | `universe`, `lang`, `search` | joueurs dont le nom correspond (50 max, nom exact en premier) |
| `/player` | `universe`, `lang`, `id` | scores par catégorie + planètes et lunes triées par coordonnées |
| `/alliances` | `universe`, `lang`, `search` | alliances par nom ou par tag, avec les ids des membres |

`search` est **obligatoire** sur `/players` et `/alliances` : un univers compte
des milliers de joueurs, on ne renvoie pas la liste entière.

Les recherches ignorent la casse et les accents (`elysee` trouve `Élysée`).

### Statuts de joueur

`players.xml` empile plusieurs indicateurs dans un seul attribut (`vIb`…). Le
proxy les décode en booléens : `active`, `vacation`, `inactive` (7 jours),
`longInactive` (28 jours), `banned`, `admin`, `outlaw`. L'attribut brut reste
disponible dans `status.raw`.

### Catégories de score

Les types 0 à 7 sont nommés (`total`, `economy`, `research`, `military`,
`militaryBuilt`, `militaryDestroyed`, `militaryLost`, `honour`). Gameforge émet
aussi des types 8 à 21 dont la signification n'est pas documentée : ils sont
transmis tels quels avec `key: null`, sans libellé inventé.

## Sécurité

`universe` et `lang` servent à construire un nom d'hôte
(`s{universe}-{lang}.ogame.gameforge.com`). Ils sont donc validés strictement —
`universe` doit correspondre à `^\d{1,4}$`, `lang` doit appartenir à la liste
des 24 communautés annoncées par le lobby — pour qu'une requête ne puisse pas
être détournée vers un hôte arbitraire. Idem pour `id` (`^\d{1,12}$`).

Le worker est sans état et en lecture seule : aucun secret, aucun stockage.

## Développement

```bash
npm run api:dev      # wrangler dev sur http://localhost:8787
npm test             # les tests du worker tournent avec ceux de l'app
```

Le front lit l'URL du proxy dans `VITE_API_URL` et retombe sur
`http://localhost:8787` par défaut (voir `src/api/ogame.js`).

### Origines autorisées

`ALLOWED_ORIGIN` (dans `wrangler.toml`) accepte `*` ou une **liste séparée par
des virgules**. Une origine listée est renvoyée telle quelle dans
`Access-Control-Allow-Origin`, parce qu'un navigateur refuse une liste ; une
origine inconnue reçoit la première de la liste, donc le navigateur bloque.

Les réponses portent `Vary: Origin` : elles sont cachées, et sans ça le cache
pourrait servir à une origine la copie destinée à une autre.

⚠️ Le CORS ne protège que les navigateurs. Un appel `curl` ou serveur à serveur
passe quoi qu'il arrive — ce n'est pas un mécanisme d'authentification, juste une
limite au détournement depuis un autre site.

## Déploiement

```bash
npx wrangler login   # une fois
npm run api:deploy
```

Puis pointer le front vers l'URL obtenue, dans un `.env.production` :

```
VITE_API_URL=https://ogame-api.<sous-domaine>.workers.dev
```

Pour restreindre l'accès au site une fois en place, remplacer `ALLOWED_ORIGIN`
dans `wrangler.toml` par `https://blog.rolljee.fr`.
