// JavaScript Document

function Partie(conteneur, taille, nbJoueur) {
    this.conteneur = conteneur;
    this.joueurs = [];

    this.ajouterJoueur("Joueur 1");
    if (nbJoueur === 1) {
        this.ajouterJoueur("Joueur 2", false);
    } else {
        this.ajouterJoueur("Joueur 2", true);
    }

    this.goban;
    this.afficherGoban(taille);

    $(this.conteneur).append("<div id='text'></div>");
    this.text = $("#text");

    $(this.conteneur).append("<button id='passe'>Passer</div>");
    this.buttonPasse = $("#passe");
    this.aPasse = false;

    this.nbCoups = 0;
    this.tour = 0;
    this.coupSuivant(false);
}

Partie.prototype.afficherGoban = function (taille) {
    this.goban = new Goban(taille, this.conteneur);
};

Partie.prototype.ajouterJoueur = function (nom, isHuman) {

    if (this.joueurs.length === 0) {

        this.joueurs.push(new Joueur(nom, true, "black"));

    } else if (this.joueurs.length === 1) {

        this.joueurs.push(new Joueur(nom, isHuman, "white"));

    }
};

Partie.prototype.coupSuivant = function (passe) {
    if (this.aPasse && passe) {
        this.fin();
    } else {

        if (!this.aPasse && passe) {
            this.aPasse = true;
        } else {
            this.aPasse = false;
        }

        if (this.tour === 0) {
            this.coup = new Coup(this, this.joueurs[this.tour]);
            this.tour = 1;
        } else if (this.tour === 1) {
            this.coup = new Coup(this, this.joueurs[this.tour]);
            this.tour = 0;
        }
    }
};

Partie.prototype.fin = function () {
    alert("Fin de la partie !");

    alert(this.joueurs[0].nom + ' (' + this.joueurs[0].couleur + ') : ' + this.compterScore(this.joueurs[0].couleur) + ' points \r\n' + this.joueurs[1].nom + ' (' + this.joueurs[1].couleur + ') : ' + (this.compterScore(this.joueurs[1].couleur)) + ' points');

    window.location.reload();
};

Partie.prototype.compterScore = function (couleur) {

    var l, c;
    var partie = this;
    var nbTerritoires = 0;
    var nbPierres = 0;

    for (l = 0; l < partie.goban.taille; l++) {
        for (c = 0; c < partie.goban.taille; c++) {
            partie.goban.pierres[l][c].territoire = '';
        }
    }

    function recursif(coordY, coordX, couleurPierre, codeTestTerritoire) {
        if (coordX >= 0 && coordY >= 0 && coordX <= partie.goban.taille - 1 && coordY <= partie.goban.taille - 1) {
            var pierre = partie.goban.pierres[coordY][coordX];

            if (pierre.territoire === '') {

                if (pierre.pose && couleurPierre === pierre.couleur) {
                    return true;
                } else if (pierre.pose && couleurPierre !== pierre.couleur) {
                    return false;
                } else if (!pierre.pose) {
                    pierre.territoire = codeTestTerritoire;

                    return recursif(coordY, coordX - 1, couleurPierre, codeTestTerritoire) && recursif(coordY, coordX + 1, couleurPierre, codeTestTerritoire) && recursif(coordY - 1, coordX, couleurPierre, codeTestTerritoire) && recursif(coordY + 1, coordX, couleurPierre, codeTestTerritoire);
                }

            } else if (pierre.territoire === codeTestTerritoire) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    function changeTerritoire(codeTestTerritoire, couleur) {
        var l, c;

        for (l = 0; l < partie.goban.taille; l++) {
            for (c = 0; c < partie.goban.taille; c++) {
                if (partie.goban.pierres[l][c].territoire === codeTestTerritoire) {
                    partie.goban.pierres[l][c].objJquery.addClass('territoire-' + couleur);
                    nbTerritoires++;
                }
            }
        }
    }

    for (l = 0; l < this.goban.taille; l++) {
        for (c = 0; c < this.goban.taille; c++) {
            if (this.goban.pierres[l][c].territoire === '') {
                if (recursif(l, c, couleur, l + '' + c)) {
                    if (!this.goban.pierres[l][c].pose) {
                        changeTerritoire(l + '' + c, couleur);
                    } else {
                        nbPierres++;
                    }
                }
            }
        }
    }

    if (couleur === 'white') {
        return nbPierres + nbTerritoires + 7.5;
    } else {
        return nbPierres + nbTerritoires;
    }
};