ZoumProfiler
============

Outil de profiling pour MountyHall


Démo
----

- http://zoumbox.org/mh/ZoumProfiler/ - version stable (master)
- http://zoumbox.org/mh/ZoumProfiler-develop/ - version en développement (develop)


Construction via Gulp
---------------------

    npm install gulp gulp-bower gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache gulp-clean bluebird --save-dev

- $ gulp clean ; pour nettoyer les artifacts
- $ gulp deps ; pour télécharger les dépendances JS
- $ gulp ; pour compiler
- $ gulp watch ; pour une recompilation à la volée

Les deps sont gérées via bower (fichier bower.json)


Architecture du code
--------------------

Le code est organisé en modules. Chaque module représente une directive qui est inclue dans le layout (index.html).

Les modules/directives utilisées sur un profil sont :

- header (infos générales d'un profil) ;
- fight (aptitudes au combat) ;
- caracteristiques ;
- competences ;
- sortileges (TBD) ;
- mouches (TBD) ;
- equipement (TBD) ;
- export (résumé/json/url de partage).

Il y a également 2 modules/directives transverses :

- import ;
- compare (comparaison de 2+ profils).

Dans src/common, on retrouve :

- directives ;
- filtres ;
- le service de base qui contient les données statiques nécessaires au bon lancement de l'application.


TODO
----

- Implémentation des modules/directives manquants ;
- Ajout de l'AN dans le module fight ;
- Encart de simulation (non persisté) dans le module fight où on saisi les ARM magiques/physique d'une cible pour voir ce que donnent les différentes attaques ;
- Continuer de remonter du code de base dans le "baseService" ;
- Persistence ;
- ...

