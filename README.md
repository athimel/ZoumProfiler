ZoumProfiler
============

Outil de profiling pour MountyHall


Démo
----

- http://profiler.zoumbox.org/ - version en développement (develop)


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

Il y a 5 modules principaux :

- profiling ;
- import ;
- compare (comparaison de 2+ profils) ;
- scheduler (outil tactique pour la chasse) ;
- monstrofinder (outil de recherche de monstre).


Chaque module peut inclure d'autre modules parmi :

- header (infos générales d'un profil) ;
- fight (aptitudes au combat) ;
- caracteristiques ;
- competences ;
- sortileges ;
- mouches (TBD) ;
- equipement (TBD) ;
- export (résumé/json/url de partage) ;
- share (partage de profil/vue).

Dans src/common, on retrouve :

- directives ;
- filtres ;
- les différents services :
  - base : contient les données statiques nécessaires au bon lancement de l'application ;
  - fight : permet le calcul des capacités au combat à partir des caractéristiques du troll ;
  - monsters : référentiel avec les noms, niveaux et templates des monstres ;
  - sharing : dédié aux fonctionnalités de partage (profils & vues) ;
  - users : gère le login/logout/whoami/list des utilisateurs.

Déploiement
-----------

Un simple serveur Apache suffit pour déployer le projet.

    $ gulp clean && gulp && mv dist/* /emplacement/du/projet/dans/apache

Attention : pour pouvoir utiliser la fonction d'import depuis MountyHall, il faut que le serveur supporte le PHP.
Le PHP sert à exposer un proxy permettant de contourner les problèmes de CORS.

Le stockage des utilisateurs, profils et vues sur le serveur nécessite d'avoir une instance installée et démarrée de MongoDB.
Il est nécessaire d'avoir à la racine du site déployé un fichier config.php, tel que :

    <?php
    $mongoUrl = "mongodb://your-mongo-host:27017";
    ?>


TODO >= 0.3
-----------

- Continuer de remonter du code de base dans le "baseService" ;
- Trouver un nouveau nom ;
- Visualiser les membres d'un groupe ;
- Mieux séparer les outils (boutons montrofinder et outils tactique -> bouton profiling) ;
- HTML offline ;
- ...

TODO ZoumProfiler
-----------------

- Sticky bloc *propre* pour les aptitudes au combat ;
- Implémentation des modules/directives manquants ;
- Conserver les infos fournies à l'import depuis les SP pour mise à jour (id+MDP spécifique) ;
- Format plus court pour le partage par URL ;
- Supprimer la cascade d'appels XHR toute moche à l'import via les SP ;
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

- Permettre la mise à jour d'une vue ;
- Améliorer les filtres sur la vue (performance, ...) ;
- Afficher des noms des trolls ;
- Afficher l'évaluation du troll (MK/TK/ATK) ;
- Filtre nival par slider double curseur ;
- Filtres par famille/... ;
- Tri sur colonnes ;
- Zone permettant de saisir le nom complet d'un monstre et qui affiche son nival avec le détail
- ...
