ZoumProfiler
============

Outil de profiling pour MountyHall


Construction via Gulp
npm install gulp gulp-bower gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache gulp-clean --save-dev

$ gulp clean pour nettoyer les artifacts
$ gulp deps pour télécharger les dépendances JS
$ gulp pour compiler
$ gulp watch pour une recompilation à la volée

Les deps sont gérées via bower (fichier bower.json)



Le code est organisé en modules
- pehiks
- mouches
- matériel
- comparaison de profils

La mise en composant est juste ébauchée, il faut bouger le code aux bons endroits
L'idée est de déplacer dans le profilService le code de chargement/sauvegarde des profils
et dans pehiksageController tout ce qui concerne la gestion des pehiks  et dans ComparaisageService.. you know
de manière à avoir le controler de base quasi vide, juste en boostrap/gestion des modules



