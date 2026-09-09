# Run doc — Omen previews (this thread)

Deux storefronts Vite + React + Tailwind + Zustand :
- `omen-wellness` — port **3002**
- `omen-shoes-vite` — port **3001**

## Reproduce artifacts (les deux sites)

1. Installer les dépendances (skip si `<site>/node_modules/.bin/vite` existe) :

   ```
   cd omen-wellness && npm install
   cd ../omen-shoes-vite && npm install
   ```

2. Aucun fichier env requis. `VITE_STORE_ID_*` optionnels (fallback local au checkout).
3. Assets déjà committs dans `public/img/` — pas d'étape de génération.

## Run a server

1. Vérifier que le port est libre : `netstat -ano | findstr :3001` (ou :3002). S'il est pris,
   tuer le pid stale ou lancer `npm run dev -- --port <libre>` depuis le dossier du site.

2. Démarrer détaché (PowerShell, cwd quelconque — chemins absolus, stdout/stderr dans deux fichiers) :

   **Omen Sneaker (3001)** :

   ```
   powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\hp\Desktop\oMen 2\apps\omen-shoes-vite' -RedirectStandardOutput 'C:\Users\hp\Desktop\oMen 2\apps\.freebuff\shoes-preview.log' -RedirectStandardError 'C:\Users\hp\Desktop\oMen 2\apps\.freebuff\shoes-preview.log.err' -WindowStyle Hidden -PassThru).Id"
   ```

   **Omen Wellness (3002)** :

   ```
   powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\hp\Desktop\oMen 2\apps\omen-wellness' -RedirectStandardOutput 'C:\Users\hp\Desktop\oMen 2\apps\.freebuff\preview.log' -RedirectStandardError 'C:\Users\hp\Desktop\oMen 2\apps\.freebuff\preview.log.err' -WindowStyle Hidden -PassThru).Id"
   ```

3. Vérifier : le pid imprimé répond à `Get-Process -Id <pid>`, puis `curl http://localhost:3001/`
   (ou :3002) renvoie 200 (Vite peut mettre ~20 s ; surveiller le log pour "Local:").

4. Enregistrer la preview avec l'URL et le pid imprimé. `register_preview` avec `replace: true`
   pour basculer d'un site à l'autre dans le même onglet — les deux serveurs peuvent tourner
   simultanément, seule l'affichage change.

Note : ne jamais lancer les deux sites sur le même port.
