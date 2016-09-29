// JavaScript Document

function Chaine(pierre, goban) {
    this.pierres = [pierre];
    this.goban = goban;
    this.libertes;
    this.nbLibertes;
}

Chaine.prototype.comptLibertes = function () {
    var length = this.pierres.length;
    var i;

    var libertes = [];
    var pierre;
    var coordX;
    var coordY;

    for (i = 0; i < length; i++) {
        pierre = this.pierres[i];
        coordX = pierre.coord.x;
        coordY = pierre.coord.y;

        if (coordX > 0 && !this.goban.pierres[coordY][coordX - 1].pose && libertes.indexOf(this.goban.pierres[coordY][coordX - 1]) === -1) {
            libertes.push(this.goban.pierres[coordY][coordX - 1]);
        }
        if (coordX < this.goban.taille - 1 && !this.goban.pierres[coordY][coordX + 1].pose && libertes.indexOf(this.goban.pierres[coordY][coordX + 1]) === -1) {
            libertes.push(this.goban.pierres[coordY][coordX + 1]);
        }
        if (coordY > 0 && !this.goban.pierres[coordY - 1][coordX].pose && libertes.indexOf(this.goban.pierres[coordY - 1][coordX]) === -1) {
            libertes.push(this.goban.pierres[coordY - 1][coordX]);
        }
        if (coordY < this.goban.taille - 1 && !this.goban.pierres[coordY + 1][coordX].pose && libertes.indexOf(this.goban.pierres[coordY + 1][coordX]) === -1) {
            libertes.push(this.goban.pierres[coordY + 1][coordX]);
        }
    }

    this.libertes = libertes;
    this.nbLibertes = this.libertes.length;

    return this.nbLibertes;
};

Chaine.prototype.ajouterPierre = function (pierre) {
    this.pierres.push(pierre);

    return this;
};

Chaine.prototype.collerChaine = function (chaine) {
    if (this === chaine) {
        return this;
    }

    var temp = this.pierres.concat(chaine.pierres);
    this.pierres = temp;

    var length = chaine.pierres.length;
    var i;
    for (i = 0; i < length; i++) {
        chaine.pierres[i].chaine = this;
    }
    return this;
};

Chaine.prototype.capture = function () {
    var length = this.pierres.length;
    var i;

    for (i = 0; i < length; i++) {
        this.pierres[i].capture();
    }

    for (key in this) {
        this[key] = null;
    }
};

Chaine.prototype.supprPierre = function (pierre) {
    var idPierre = this.pierres.indexOf(pierre);

    if (idPierre !== -1) {
        this.pierres.splice(idPierre, 1);
    }

    this.comptLibertes();
};