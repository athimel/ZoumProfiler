angular.module('zoumProfilerApp')
    .factory('base', function () {
        var base = {};

        base.config = { maxPi: 18290 };

        base.races = ['Darkling', 'Durakuir', 'Kastar', 'Nkrwapu', 'Skrim', 'Tomawak'];

        base.caracs = [
            {id: 'TOUR', type: 'T', coef: 1, min: 470, max: 720, cost: 18},
            {id: 'PV', type: 'D1', coef: 1, min: 30, max: 580, step: 10, minDurakuir: 40, cost: 16, costDurakuir: 12, costNkrwapu: 15},
            {id: 'VUE', type: 'D1', coef: 1, min: 3, max: 58, step: 1, minTomawak: 4, cost: 16, costTomawak: 12, costNkrwapu: 15},
            {id: 'ATT', type: 'D6', coef: 3.5, min: 3, max: 58, step: 1, minSkrim: 4, cost: 16, costSkrim: 12, costNkrwapu: 15},
            {id: 'ESQ', type: 'D6', coef: 3.5, min: 3, max: 50, step: 1, cost: 16, costNkrwapu: 15},
            {id: 'DEG', type: 'D3', coef: 2, min: 3, max: 58, step: 1, minKastar: 4, cost: 16, costKastar: 12, costNkrwapu: 15},
            {id: 'REG', type: 'D3', coef: 2, min: 1, max: 42, step: 1, minDarkling: 2, cost: 30, costDarkling: 22, costNkrwapu: 29},
            {id: 'ARM', type: 'D3', coef: 2, min: 1, max: 35, step: 1, cost: 30, costNkrwapu: 29}
        ];

        base.comps = [
            { id: 'cdm', levels: 5, cost: 10, name: "Connaissance des monstres", type: "Connaissance", short: "CdM" },
            { id: 'idc', levels: 1, cost: 10, name: "Identification des champignons", type: "Connaissance", short: "IdC" },
            { id: 'insultes', levels: 3, cost: 10, name: "Insultes", type: "Utile" },
            { id: 'miner', levels: 1, cost: 10, name: "Miner", type: "Utile" },
            { id: 'tailler', levels: 1, cost: 10, name: "Tailler", type: "Artisanat" },
            { id: 'pistage', levels: 1, cost: 10, name: "Pistage", type: "Utile" },
            { id: 'bidouiller', levels: 1, cost: 20, name: "Bidouille", type: "Artisanat" },
            { id: 'course', levels: 1, cost: 20, name: "Course", type: "Déplacement" },
            { id: 'de', levels: 1, cost: 20, name: "Déplacement Éclair", type: "Déplacement", short: "DE" },
            { id: 'ca', levels: 1, cost: 20, name: "Contre-Attaquer", type: "Combat" },
            { id: 'dressage', levels: 1, cost: 20, name: "Dressage", type: "Utile" },
            { id: 'parer', levels: 2, cost: 20, name: "Parer", type: "Combat" },
            { id: 'interposer', levels: 2, cost: 20, name: "S'interposer", type: "Combat" },
            { id: 'he', levels: 1, cost: 20, name: "Hurlement Effrayan", type: "Combat", short: "HE" },
            { id: 'lancer', levels: 1, cost: 30, name: "Lancer de potions", type: "Combat" },
            { id: 'marquage', levels: 1, cost: 30, name: "Marquage", type: "Utile" },
            { id: 'reparation', levels: 1, cost: 30, name: "Réparation", type: "Artisanat" },
            { id: 'grattage', levels: 1, cost: 30, name: "Grattage", type: "Artisanat" },
            { id: 'baroufle', levels: 4, cost: 30, name: "Baroufle", type: "Utile" },
            { id: 'planter', levels: 1, cost: 40, name: "Planter un champignon", type: "Artisanat" },
            { id: 'retraite', levels: 2, cost: 40, name: "Retraite", type: "Combat" },
            { id: 'melange', levels: 1, cost: 40, name: "Mélange Magique", type: "Artisanat" },
            { id: 'shamaner', levels: 1, cost: 50, name: "Shamaner", type: "Utile" },
            { id: 'ap', levels: 7, cost: 50, name: "Attaque Précise", type: "Combat", short: "AP" },
            { id: 'charger', levels: 1, cost: 50, name: "Charger", type: "Combat" },
            { id: 'piege_feu', levels: 1, cost: 50, name: "Construire un piège à feu", type: "Artisanat" },
            { id: 'piege_glue', levels: 1, cost: 50, name: "Construire un piège à glue", type: "Artisanat" },
            { id: 'cdb', levels: 7, cost: 50, name: "Coup de Butoir", type: "Combat", short: "CdB" },
            { id: 'rotobaffe', levels: 6, cost: 80, name: "Rotobaffe", type: "Combat" },
            { id: 'painthure', levels: 1, cost: 100, name: "Painthure de Guerre", type: "Utile" },
            { id: 'em', levels: 1, cost: 100, name: "Ecriture Magique", type: "Artisanat", short: "EM" },
            { id: 'frene', levels: 1, cost: 100, name: "Frénésie", type: "Combat", short: "Fréné" },
            { id: 'necro', levels: 1, cost: 100, name: "Nécromancie", type: "Artisanat" },
            { id: 'golem_cuir', levels: 1, cost: 150, name: "Golémologie de cuir", type: "Artisanat" },
            { id: 'golem_metal', levels: 1, cost: 150, name: "Golémologie de métal", type: "Artisanat" },
            { id: 'golem_mithril', levels: 1, cost: 150, name: "Golémologie de mithril", type: "Artisanat" },
            { id: 'golem_papier', levels: 1, cost: 150, name: "Golémologie de papier", type: "Artisanat" },

            { id: 'am', levels: 1, cost: 0, name: 'Accélération du Métabolisme', reservedFor: base.races[2], type: "Utile", short: "AM" },
            { id: 'bs', levels: 1, cost: 0, name: 'Botte Secrète', reservedFor: base.races[4], type: "Attaque", short: "BS" },
            { id: 'balayage', levels: 1, cost: 0, name: 'Balayage', reservedFor: base.races[0], type: "Combat" },
            { id: 'camou', levels: 1, cost: 0, name: 'Camouflage', reservedFor: base.races[5], type: "Utile" },
            { id: 'ra', levels: 1, cost: 0, name: 'Régénération Accrue', reservedFor: base.races[1], type: "Utile", short: "RA" }
        ];

        base.sorts = [
            { id: 'vampi', name: 'Vampirisme', reservedFor: base.races[2], short: "Vampi" },
            { id: 'rp', name: 'Rafale Psychique', reservedFor: base.races[1], short: "RP" },
            { id: 'projo', name: 'Projectile Magique', reservedFor: base.races[5], short: "Projo" },
            { id: 'hypno', name: 'Hypnotisme', reservedFor: base.races[4], short: "Hypno" },
            { id: 'siphon', name: 'Siphon des âmes', reservedFor: base.races[0] }
        ];

        function _makeCompSortMap(compsOrSorts) {
            var resultMap = {};
            angular.forEach(compsOrSorts, function (compOrSort) {
                var levels = compOrSort.levels;
                if (!levels) {
                    levels = 1;
                }
                for (var i = 1; i <= levels; i++) {
                    var newCompOrSort = compOrSort;
                    if (levels > 1) {
                        newCompOrSort = angular.copy(compOrSort);
                        newCompOrSort.id = compOrSort.id + i;
                        newCompOrSort.level = i;
                        newCompOrSort.cost = compOrSort.cost * i;
                        newCompOrSort.name += " - niveau " + i;
                        if (newCompOrSort.short) {
                            newCompOrSort.short = newCompOrSort.short + i;
                        }
                    }

                    if (i > 1) {
                        newCompOrSort.requires = compOrSort.id + (i - 1);
                    }
                    if (i < levels) {
                        newCompOrSort.requiredFor = compOrSort.id + (i + 1);
                    }

                    resultMap[newCompOrSort.id] = newCompOrSort;
                }
            });
            return resultMap;
        }

        base.compsMap = _makeCompSortMap(base.comps); // { "cdb1" : { ... } }
        base.sortsMap = _makeCompSortMap(base.sorts); // { "vampi" : { ... } }

        base.combatCompsSortsMap = {
            // comps
            ca: true, ap: true, charger: true, cdb: true, rotobaffe: true, frene: true, bs: true, piege_feu: true,
            // sorts
            vampi: true, rp: true, projo: true, siphon: true
        };

        base.levels = {};
        var count = 0;
        for (var i = 2; i <= 60; i++) {
            count += i * 10;
            base.levels['n' + i] = count;
        }

        var tourValue = 720;
        base.tourValues = [tourValue];
        for (var idx = 0; idx < 44; idx++) {
            tourValue -= Math.max(30 - 3 * idx, 2.5);
            base.tourValues.push(Math.floor(tourValue));
        }

        function _degCritique0(profile, nbD3Deg, includeBP, includeBM) {
            var critique = (nbD3Deg + Math.floor(nbD3Deg / 2) ) * 2;
            if (angular.isDefined(includeBP) && includeBP === true) {
                critique += profile.bp['DEG']
            }
            if (angular.isDefined(includeBM) && includeBM === true) {
                critique += profile.bm['DEG'];
            }
            return critique;
        }

        base.degCritiqueComp = function(profile, nbD3Deg) {
            return _degCritique0(profile, nbD3Deg, true, true);
        };

        base.degCritiqueSort = function(profile, nbD3Deg) {
            return _degCritique0(profile, nbD3Deg, false, true);
        };

        base.degCritiqueNoBonus = function(profile, nbD3Deg) {
            return _degCritique0(profile, nbD3Deg, false, false);
        };

        base.getCompId = function(comp, lvl) {
            var result = comp.id;
            if (comp.levels > 1) {
                result += lvl;
            }
            return result;
        };

        base.getCompOrSort = function(compOrSortId) {
            var result = base.compsMap[compOrSortId];
            if (!result) {
                result = base.sortsMap[compOrSortId];
            }
            if (!result) {
                console.error("Unknown comp/sort: " + compOrSortId)
            }
            return result;
        };

        base.getAttForAp = function(compApWithLevel, profile) {
            var d6AttAp = profile.caracs['ATT'];
            var bonusD6AttAp = Math.min(compApWithLevel.level * 3, Math.floor(profile.caracs['ATT'] / 2));
            return (d6AttAp + bonusD6AttAp) * 3.5 + profile.bp['ATT'] + profile.bm['ATT'];
        };

        base.getDegForCdB = function(compCdbWithLevel, profile) {
            var result = {};
            var d3DegCdb = profile.caracs['DEG'];
            var bonusD3DegCdb = Math.min(compCdbWithLevel.level * 3, Math.floor(profile.caracs['DEG'] / 2));
            result.DEG = (d3DegCdb + bonusD3DegCdb) * 2 + profile.bp['DEG'] + profile.bm['DEG'];
            result.DEG_CRITIQ = base.degCritiqueComp(profile, d3DegCdb) + bonusD3DegCdb * 2;
            return result;
        };

        return base;
    });
