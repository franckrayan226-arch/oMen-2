# MemeForge

## Présentation

Générateur de mèmes en ligne : on choisit un modèle, on ajoute un texte en haut et en bas, on règle la mise en forme, et on exporte en PNG.

Sa particularité : un frontend JavaScript natif associé à un backend Python/Flask qui gère les modèles, la sauvegarde et la galerie côté serveur — les créations sont donc conservées d'une session à l'autre.

## Objectif

Produire un mème propre en quelques secondes, sur mobile comme sur ordinateur, sans compte et sans installation.

Le problème résolu : les générateurs purement front ne gardent rien, et le résultat est souvent exporté à la taille de l'écran, donc basse définition. Ici, le dessin se fait à la résolution d'origine de l'image et les créations sont conservées sur le serveur.

## Fonctionnalités

- Bibliothèque de modèles pré-chargée au démarrage du serveur (Drake, Distracted Boyfriend, Doge, Change My Mind, etc.)
- Import d'une image par fichier ou par glisser-déposer sur la zone de dessin
- Texte haut et bas, automatiquement passé en majuscules
- Réglages : taille de police (20 à 120), couleur, police (Impact, Arial Black, Comic Sans, Courier), épaisseur du contour
- Export PNG **à la résolution native du modèle** (ou de l'image importée), pas à la résolution de l'écran
- Partage direct (Web Share API sur mobile) avec repli sur la presse-papiers, puis téléchargement
- Galerie serveur : sauvegarde, affichage, réutilisation et suppression des mèmes
- Interface responsive (barre latérale et galerie repliées en mobile), thème sombre

## Technologies

- **Frontend** : JavaScript natif (sans framework), HTML5 Canvas, CSS
- **Backend** : Python 3, Flask 3, `requests` (téléchargement des modèles), gunicorn pour la production
- Modèles récupérés depuis imgflip au premier lancement et stockés en local
- Déploiement sur Render

## Architecture

```
Navigateur
   │  index.html + style.css + app.js
   │  dessin sur <canvas> à la résolution native
   │
   ├── GET  /api/templates   liste des modèles disponibles
   ├── GET  /templates/<f>   image du modèle
   ├── GET  /api/gallery     liste des mèmes sauvegardés
   ├── POST /api/save        enregistre le PNG (base64 → disque)
   ├── POST /api/delete      supprime un mème
   └── GET  /uploads/<f>     affiche un mème sauvegardé

Flask (app.py)
   ├── templates/   modèles imgflip téléchargés au boot
   └── uploads/     mèmes générés par les visiteurs
```

## Mon rôle

Développement complet du projet, seul :

- Conception de l'interface et intégration (HTML/CSS, thème sombre, responsive)
- Moteur de rendu Canvas : superposition des textes, contours, réglages en direct
- Import d'image (fichier et glisser-déposer), export à la résolution native
- Partage mobile (Web Share API) et repli presse-papiers
- Backend Flask : API REST, téléchargement initial des modèles, stockage et suppression des fichiers
- Galerie serveur et synchronisation avec l'interface
- Déploiement sur Render

## Démonstration

- Application : https://meme-forge-f6zd.onrender.com

Exécution en local, si besoin :

```bash
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

Le serveur télécharge les modèles au premier lancement (30 secondes environ), puis affiche l'application.

## Limites / améliorations

- **Galerie sans protection** : la sauvegarde et la suppression sont accessibles à tous les visiteurs, sans compte ni limitation de débit. À sécuriser avant d'ouvrir le service au public (authentification, quotas, validation stricte des noms de fichiers).
- **Aucune limite de taille** : une image envoyée en base64 est écrite telle quelle sur le disque ; un quota et une compression en amont éviteraient d'atteindre la capacité du serveur.
- **Démarrage à froid** : l'hébergement gratuit s'endort après une période d'inactivité ; la première visite prend alors quelques dizaines de secondes le temps que les modèles soient rechargés.
- **Dépendance externe** : les modèles viennent d'un hébergeur tiers au premier lancement ; s'il devient indisponible, la bibliothèque reste vide.
- **Pas de tests ni de linter** : le projet n'a ni couverture de tests ni vérification automatisée du code.
- **Fonctionnalités manquantes** : pas de déplacement ou de rotation du texte, pas de calques multiples, pas de sauvegarde en compte utilisateur — les trois additions les plus attendues.
