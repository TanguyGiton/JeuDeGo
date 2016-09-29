// JavaScript Document

function Goban(taille, conteneur) {
    this.taille = taille;
    this.coteCase = 30;
    this.longueurCote = (this.taille * this.coteCase) + 1;
    this.pierres = [];
    this.etat1Prec = [];
    this.etat2Prec = [];
    this.pret = true;

    $(conteneur).html('<div id="goban"></div>');

    this.objJquery = $('#goban');

    this.objJquery.css('width', this.longueurCote + 'px').css('height', this.longueurCote + 'px');

    var l, c;

    for (l = 0; l < this.taille; l++) {
        this.pierres[l] = [];
        for (c = 0; c < this.taille; c++) {
            this.pierres[l][c] = new Pierre(this, l, c);
        }
    }

    this.affichHoshis();
    this.sauvEtat();
}

Goban.prototype.affichHoshis = function () {
    switch (this.taille) {
        case 9:
            ecartHoshi = 4;
            nbHoshisLin = 2;
            break;
        case 13:
            ecartHoshi = 3;
            nbHoshisLin = 3;
            break;
        case 19:
            ecartHoshi = 6;
            nbHoshisLin = 3;
            break;
        default:
            nbHoshisLin = 0;
            ecartHoshi = 0;
            break;
    }

    var positionHoshisLin;
    var positionHoshiCol = -(this.coteCase * (ecartHoshi % 2 === 0 ? ecartHoshi / 2 : 0));

    for (l = 0; l < nbHoshisLin; l++) {

        positionHoshiLin = -(this.coteCase * (ecartHoshi % 2 === 0 ? ecartHoshi / 2 : 0));
        positionHoshiCol += (this.coteCase * ecartHoshi);

        for (c = 0; c < nbHoshisLin; c++) {

            positionHoshiLin += (this.coteCase * ecartHoshi);

            this.objJquery.append('<div class="hoshi" style="top: ' + positionHoshiCol + 'px; left: ' + positionHoshiLin + 'px;" >');

        }
    }
};

Goban.prototype.sauvEtat = function () {

    var l, c;
    for (l = 0; l < this.etat1Prec.length; l++) {
        this.etat2Prec[l] = [];
        for (c = 0; c < this.etat1Prec.length; c++) {
            this.etat2Prec[l][c] = this.etat1Prec[l][c];
        }
    }

    var l, c;
    for (l = 0; l < this.pierres.length; l++) {
        this.etat1Prec[l] = [];
        for (c = 0; c < this.pierres.length; c++) {
            this.etat1Prec[l][c] = this.pierres[l][c].couleur;
        }
    }
};

Goban.prototype.memeEtat = function () {

    if (this.etat2Prec.length === this.pierres.length) {
        var l, c;
        for (l = 0; l < this.taille; l++) {
            for (c = 0; c < this.taille; c++) {
                if (this.pierres[l][c].couleur != this.etat2Prec[l][c]) {
                    return false;
                }
            }
        }
    } else {
        return false;
    }

    return true;
};