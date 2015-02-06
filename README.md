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

Déploiement
-----------

Un simple serveur Apache suffit pour déployer le projet.

    $ gulp clean && gulp && mv dist/* /emplacement/du/projet/dans/apache

Attention : pour pouvoir utiliser la fonction d'import depuis MountyHall, il faut que le serveur supporte le PHP.
Le PHP sert à exposer un proxy permettant de contourner les problèmes de CORS.


TODO ZoumProfiler
-----------------

- Sticky bloc *propre* pour les aptitudes au combat ;
- Implémentation des modules/directives manquants ;
- Continuer de remonter du code de base dans le "baseService" ;
- Rejoindre/quitter un groupe ;
- Conserver les infos fournies à l'import depuis les SP pour mise à jour (id+MDP spécifique) ;
- Format plus court pour le partage par URL ;
- ...

TODO Outil tactique
-------------------

- Dans le simulateur, proposer des listes d'attaques par groupes de DEG ;
- Permettre d'avoir plusieurs plans ;
- Partager les plans ;
- Persister les plans ;
- ...

TODO Recherche de monstres
--------------------------

- Charger les vues à la demande uniquement ;
- Afficher les trolls et lieux dans la preview ;
- Gestion des autorisations (owner+partage) ;
- Permettre la mise à jour d'une vue ;
- ...

