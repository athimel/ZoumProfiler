angular.module('ZoumProfiler')
    .factory('monsters', function () {
        var monsters = {};

        monsters.families = {
            Animal: {
                "Chauve-Souris":3,
                "Chauve-Souris Géante":4,
                "Cheval à Dents de Sabre":23,
                Dindon:1,
                "Dindon du Chaos":1,
                "Geck'oo":15,
                "Geck'oo majestueux":40,
                Glouton:20,
                Gnu:1,
                "Gnu Sauvage":1,
                "Gnu Domestique":1,
                Gowap:1,
                "Gowap Apprivoisé":1,
                "Gowap Sauvage":1,
                "Lapin Blanc":1,
                "Rat":1,
                "Rat Géant":2,
                Sagouin:3,
                "Tubercule Tueur":14
            },
            Insecte: {
                Ankheg: 10,
                "Anoploure Purpurin":36,
                "Araignée":1,
                "Araignée Géante":2,
                Coccicruelle:22,
                "Essaim Cratérien":30,
                "Essaim Sanguinaire":25,
                Foudroyeur:38,
                Labeilleux:26,
                "Limace Géante":10,
                "Mante Fulcreuse":30,
                "Mille-Pattes":13,
                "Mille-Pattes Géant":14,
                "Nuage d'Insectes":7,
                "Nuée de Vermine":13,
                Pititabeille:0,
                "Scarabée":3,
                "Scarabée Géant":4,
                "Scorpion Géant":10,
                Strige:2,
                "Thri-kreen":10
            },
            "Mort-Vivant": {
                "Ame-en-peine":8,
                Banshee:16,
                Capitan:35,
                Croquemitaine:6,
                Ectoplasme:18,
                Fantôme:24,
                Goule:4,
                Liche:50,
                Mohrg:35,
                Momie:4,
                "Nâ-Hàniym-Hééé":0,
                Nécrochore:37,
                Nécromant:39,
                Nécrophage:8,
                Ombre:2,
                Spectre:14,
                Squelette:1,
                Vampire:29,
                Zombie:2
            },
            Monstre: {
                "Amibe":8,
                "Amibe Géante":9,
                "Anaconda des Catacombes":8,
                Basilisk:11,
                Behir:14,
                Beholder:50,
                Bondin:9,
                "Bouj'Dla":19,
                "Bouj'Dla Placide":37,
                Bulette:19,
                Carnosaure:25,
                Chimère:13,
                Chonchon:24,
                Cockatrice:5,
                Crasc:10,
                "Crasc Médius":17,
                "Crasc Maexus":24,
                "Cube Gélatineux":32,
                Djinn:29,
                Effrit:27,
                "Esprit-Follet":16,
                Familier:1,
                "Feu Follet":20,
                Fungus:8,
                "Fungus Géant":9,
                "Fungus Violet":4,
                Gargouille:3,
                Gorgone:11,
                Grouilleux:4,
                Grylle:31,
                Harpie:4,
                Hydre:50,
                "Lézard":4,
                "Lézard Géant":5,
                Manticore:9,
                Mimique:6,
                "Monstre Rouilleur":3,
                "Mouch'oo":14,
                "Mouch'oo Sauvage":14,
                "Mouch'oo Majestueux":33,
                "Mouch'oo Majestueux Sauvage":33,
                Naga:10,
                "Ombre de Roches":13,
                Phoenix:32,
                "Plante Carnivore":4,
                Slaad:5,
                "Tertre Errant":20,
                Trancheur:35,
                Tutoki:4,
                "Ver Carnivore":11,
                "Ver Carnivore Géant":12,
                Vouivre:33,
                Worg:5
            },
            Démon: {
                "Abishaii Bleu":19,
                "Abishaii Noir":10,
                "Abishaii Rouge":23,
                "Abishaii Vert":15,
                Balrog:50,
                Barghest:36,
                Behemoth:34,
                "Chevalier du Chaos":20,
                Daemonite:27,
                Diablotin:5,
                "Elementaire d'Air":23,
                "Elémentaire d'Air":23,
                "Elementaire d'Eau":17,
                "Elémentaire d'Eau":17,
                "Elementaire de Feu":21,
                "Elémentaire de Feu":21,
                "Elementaire de Terre":21,
                "Elémentaire de Terre":21,
                "Elementaire du Chaos":26,
                "Elémentaire du Chaos":26,
                "Elementaire Magmatique":0,
                "Elémentaire Magmatique":0,
                Erinyes:7,
                "Grosse Erinyes":8,
                Fumeux:22,
                Gritche:39,
                Hellrot:18,
                Incube:13,
                Marilith:33,
                "Molosse Satanique":8,
                "Palefroi Infernal":29,
                "Pseudo-Dragon":5,
                Shai:28,
                Succube:13,
                Xorn:14
            },
            Humanoïde: {
                Ashashin:35,
                Boggart:3,
                Caillouteux:1,
                "Champi-Glouton":3,
                Ettin:8,
                "Flagelleur Mental":33,
                Furgolin:10,
                "Géant de Pierre":13,
                "Géant des Gouffres":22,
                Gnoll:5,
                Goblin:4,
                Goblours:4,
                "Golem de cuir":1,
                "Golem de mithril":1,
                "Golem de métal":1,
                "Golem de papier":1,
                "Golem d'Argile":15,
                "Golem de Chair":8,
                "Golem de Fer":31,
                "Golem de Pierre":23,
                Gremlins:3,
                "Homme-Lézard":4,
                Hurleur:8,
                Kobold:2,
                "Loup-Garou":8,
                Lutin:4,
                Méduse:6,
                Mégacéphale:38,
                Minotaure:7,
                Ogre:7,
                Orque:3,
                "Ours-Garou":18,
                Raquettou:1,
                "Rat-Garou":3,
                Rocketeux:5,
                Sorcière:17,
                Sphinx:30,
                "Tigre-Garou":12,
                Titan:26,
                "Veskan du Chaos":14,
                "Veskan Du Chaos":14,
                Yéti:8,
                "Yuan-ti":15
            }
        };

        //Alchimiste
        //Agressif				+1
        //Alpha				+11
        //Archaique			-1
        //Archiatre			+2
        //Attentionné			+2
        //Barbare				+1
        //Berserker			+3
        //Champion			+4
        //Cogneur			+2
        //Colossal			+7
        //Coriace				+1
        //Corrompu			+1
        //Cracheur			+2
        //de Premier Cercle	-1
        //de Second Cercle	+0
        //de Troisième Cercle	+2
        //de Quatrième Cercle	+4
        //de Cinquième Cercle	+5
        //des Abysses			+3
        //Effrayé				-1
        //Enragé				+3
        //Esculape			+2
        //Ethéré				+3
        //Fanatique			+2
        //Fou					+1
        //Fouisseur			+0
        //Frénétique			+3
        //Frondeur			+2
        //Fustigateur			+2
        //Gardien				+20
        //Gargantuesque		+3
        //Gigantesque			+1
        //Grand Frondeur		+4
        //Gros				+0
        //Guérisseur			+2
        //Guerrier				+1
        //Héros				+5
        //Homochrome	 	+0
        //Homomorphe	 	+0
        //Implacable			+3
        //Invocateur			+5	(avant +3)
        //Maitre				+8
        //Lobotomisateur		+2
        //Malade				-1
        //Médicastre			+2
        //Mentat				+2
        //Morticole			+2
        //Mutant				+2
        //Nécromant			+5
        //Ouvrier				+0
        //Paysan				-1
        //Petit				-1
        //Planque	 			+0
        //Prince				+8
        //Psychophage		+2
        //Reine				+11
        //Ronfleur				+2
        //Scout				+2 (avant +1)
        //Shaman				+0
        //Soldat				+2 (avant +3)
        //Sorcier				+0
        //Spectral	 			+0
        //Strident				+3
        //Traqueur			+1
        //Voleur				+2
        //Vorace				+1
        monsters.templates = {
            Alchimiste:0,
            Agressif:1,
            Agressive:1,
            Alpha:11,
            Archaïque:-1,
            Archiatre:2,
            Attentionné:2,
            Attentionnée:2,
            Barbare:1,
            Berserker:3,
            Berserkere:3,
            Champion:4,
            Championne:4,
            Cogneur:2,
            Cogneuse:2,
            Colossal:7,
            Colossale:7,
            Coriace:1,
            Corrompu:1,
            Corrompue:1,
            Cracheur:2,
            Cracheuse:2,
            "de Premier Cercle":-1,
            "de Second Cercle":0,
            "de Troisième Cercle":2,
            "de Quatrième Cercle":4,
            "de Cinquième Cercle":5,
            "des Abysses":3,
            Effrayé:-1,
            Effrayée:-1,
            Enragé:3,
            Enragée:3,
            Esculape:2,
            Ethéré:3,
            Fanatique:2,
            Fou:1,
            Fouisseur:0,
            Fouisseuse:0,
            Frénétique:3,
            Frondeur:2,
            Frondeuse:2,
            Fustigateur:2,
            Fustigatrice:2,
            Gardien:20,
            Gargantuesque:3,
            Gigantesque:1,
            "Grand Frondeur":4,
            Gros:0,
            Grosse:0,
            Guérisseur:2,
            Guérisseuse:2,
            Guerrier:1,
            Guerrière:1,
            Héros:5,
            Homochrome:0,
            Homomorphe:0,
            Implacable:3,
            Invocateur:5,
            Invocatrice:5,
            Maitre:8,
            Maître:8,
            Maîtresse:8,
            Lobotomisateur:2,
            Lobotomisatrice:2,
            Malade:-1,
            Médicastre:2,
            Mentat:2,
            Morticole:2,
            Mutant:2,
            Mutante:2,
            Nécromant:5,
            Nécromante:5,
            Ouvrier:0,
            Ouvrière:0,
            Paysan:-1,
            Petit:-1,
            Petite:-1,
            Planque:0,
            Planqué:0,
            Prince:8,
            Princesse:8,
            Psychophage:2,
            Reine:11,
            Ronfleur:2,
            Ronfleuse:2,
            Scout:2,
            Shaman:0,
            Soldat:2,
            Sorcier:0,
            Sorcière:0,
            Spectral:0,
            Spectrale:0,
            Strident:3,
            Stridente:3,
            Traqueur:1,
            Traqueuse:1,
            Voleur:2,
            Voleuse:2,
            Vorace:1
        };
        //+0	Bébé			Initial		Nouveau	Larve		Nouveau		Naissant
        //+1	Enfançon		Novice		Jeune		Immature	Jeune		Récent
        //+2	Jeune			Mineur		Adulte		Juvénile		Adulte		Ancien
        //+3	Adulte			Favori		Vétéran		Imago		Vétéran		Vénérable
        //+4	Mature			Majeur		Briscard		Développé	Briscard		Séculaire
        //+5	Chef de Harde	Supérieur	Doyen		Mûr			Doyen		Antique
        //+6	Ancien			Suprême	Légendaire	Accompli	Légendaire	Ancestral
        //+7	Ancêtre			Ultime		Mythique	Achevé		Mythique	Antédiluvien

        monsters.ages = {
            Animal: {Bébé:0, Enfançon:1, Jeune:2, Adulte:3, Mature:4, "Chef de Harde":5, "Chef de harde":5, Ancien:6, Ancienne:6, Ancêtre:7},
            Démon: {Initial:0, Initiale:0, Novice:1, Mineur:2, Mineure:2, Favori:3, Favorite:3, Majeur:4, Majeure:4, Supérieur:5, Supérieure:5, Suprême:6, Ultime:7},
            Humanoïde: {Nouveau:0, Nouvelle:0, Jeune:1, Adulte:2, Vétéran:3, Briscard:4, Briscarde:4, Doyen:5, Doyenne:5, Légendaire:6, Mythique:7},
            Insecte: {Larve:0, Immature:1, Juvénile:2, Imago:3, Développé:4, Développée:4, Mûr:5, Mûre:5, Accompli:6, Accomplie:6, Achevé:7, Achevée:7},
            Monstre: {Nouveau:0, Nouvelle:0, Jeune:1, Adulte:2, Vétéran:3, Briscard:4, Briscarde:4, Doyen:5, Doyenne:5, Légendaire:6, Mythique:7},
            "Mort-Vivant": {Naissant:0, Naissante:0, Récent:1, Récente:1, Ancien:2, Ancienne:2, Vénérable:3, Séculaire:4, Antique:5, Ancestral:6, Ancestrale:6, Antédiluvien:7, Antédiluvienne:7}
        };

        return monsters;
    });
