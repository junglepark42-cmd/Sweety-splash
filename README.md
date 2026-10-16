# Sweety Splash — La bataille des couleurs

Jeu tactile original pour la Splash Room Sweety Sweety. Deux modes : défi de deux minutes avec cibles colorées et création libre. Choix licorne/dinosaure, pinceau, ballons, rouleau, mélanges de pigments, tableau persistant et souvenir PNG signé.

## Jouer

URL prévue : https://junglepark42-cmd.github.io/Sweety-splash/

Tablette en paysage. Touche une cible avec sa couleur pour marquer davantage. Glisse le pinceau pour peindre. Le rouleau se débloque après huit cibles. Les dix dernières secondes offrent tous les outils. En création libre, tous les outils sont disponibles et le dernier geste peut être annulé.

Le tableau est conservé sur l'appareil via IndexedDB. « Mon tableau » permet de signer et télécharger une image PNG. Le son et le record sont conservés localement. Après une première ouverture connectée et la mise en cache, le jeu fonctionne hors ligne. Le navigateur peut proposer l'installation PWA.

## Développer et vérifier

Node 22 et Python avec Pillow. Aucun CDN ni bibliothèque nécessaire à l'exécution du jeu.

```sh
npm ci
npx playwright install --with-deps chromium
npm test
python tests/assets.py
npm run test:browser
node tests/real-play.cjs
```

`npm run serve` : http://127.0.0.1:8765/Sweety-splash/

Après modification des ressources : `python tools/build.py` régénère icônes, manifeste et cache versionné. `python tools/package.py` prépare uniquement les fichiers publics dans `dist/`. Le workflow teste la branche de développement, puis publie seulement `main` après réussite des mêmes contrôles. GitHub Pages doit utiliser la source **GitHub Actions**.

## Ressources et droits

Les mascottes et le décor sont des illustrations générées pour ce projet à partir des références fournies par le propriétaire du parc. Les éclaboussures, cibles, icônes et effets sont dessinés par le code. La musique et les sons sont synthétisés à l'exécution avec Web Audio, sans échantillon tiers. Les polices DejaVu Sans sont redistribuées avec leur licence dans `assets/FONT-LICENSE.txt`. Aucun fichier audio tiers ni publicité.

## Limites de validation

Les tests automatisés utilisent Chromium sur Linux avec entrées tactiles, plusieurs résolutions et fonctionnement hors ligne. Ils ne constituent pas un essai sur appareil Android physique. La fréquence de 60 FPS dépend du matériel. L'export utilise le téléchargement du navigateur ; son emplacement dépend d'Android. Effacer les données du site efface les records et le tableau local ; télécharger le PNG permet de conserver un souvenir indépendant.
