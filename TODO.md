# Plan: Uniformiser la navbar sur toutes les pages

## Analyse
- **Pages avec la NAVBAR CORRECTE (déjà à jour)** : index.html, 404.html, contact.html, equipes.html, rejoindre.html, commissions.html, mentions-legales.html, mini-basket.html, sdbb-tonic-marche.html, presentation-sdbb.html, partenaires.html, boutique.html, planning.html, devenir-partenaire.html, photos.html, evenements.html
- **Pages avec l'ANCIENNE NAVBAR (obsolète)** : coach.html, projet-club.html, conseil-administration.html, labels.html, reglement-sdbb.html, inscription-2026-2027.html, inscription-2025-2026.html

## Différences entre l'ancienne et la nouvelle navbar
1. **Planning des matchs** : Ancienne version utilise Google Docs URL, nouvelle version utilise `planning.html`
2. **Photos** : Ancienne version n'a pas `<!-- <li><a href="photos.html">Photos</a></li> -->` commenté dans "Découvrir"
3. **Structure générale** : Ancienne version a des lignes vides et des espaces de formatage différents

## Étapes
- [x] Étape 1: Analyser toutes les pages et identifier les différences
- [x] Étape 2: Mettre à jour **coach.html** avec la nouvelle navbar
- [x] Étape 3: Mettre à jour **projet-club.html** avec la nouvelle navbar
- [x] Étape 4: Mettre à jour **conseil-administration.html** avec la nouvelle navbar
- [x] Étape 5: Mettre à jour **labels.html** avec la nouvelle navbar
- [x] Étape 6: Mettre à jour **reglement-sdbb.html** avec la nouvelle navbar
- [x] Étape 7: Mettre à jour **inscription-2026-2027.html** avec la nouvelle navbar
- [x] Étape 8: Mettre à jour **inscription-2025-2026.html** avec la nouvelle navbar

## Résultat
✅ **Terminé** — Les 7 fichiers ont été uniformisés avec la navbar commune incluant :
- Lien `planning.html` pour le planning des matchs
- Commentaire `<!-- <li><a href="photos.html">Photos</a></li> -->` dans Découvrir
- `class="active"` sur la page courante de chaque fichier
- Suppression des lignes vides superflues
- Espace résiduel supprimé dans la Créneaux d'entraînements (`inscription-2026-2027.html`)

