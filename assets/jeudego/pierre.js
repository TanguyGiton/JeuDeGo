// JavaScript Document

function Pierre(goban, coordY, coordX) {
    this.goban = goban;
    this.pose = false;
    this.couleur = '';
    this.territoire = '';
    this.coord = {
        x: coordX,
        y: coordY
    };
    this.chaine;

    goban.objJquery.append('<div id="pierre-' + this.coord.y + '-' + this.coord.x + '" class="pierre pierre-vide"></div>');

    this.objJquery = $('#pierre-' + this.coord.y + '-' + this.coord.x);

    this.objJquery.css('top', this.coord.y * goban.coteCase + 'px').css('left', this.coord.x * goban.coteCase + 'px');

}

Pierre.prototype.setPose = function (couleur) {
    if (!this.pose) {

        this.couleur = couleur;
        this.pose = true;
        this.setChaine();

        if (this.chaine.comptLibertes() === 0) {

            this.pose = false;
            this.chaine.supprPierre(this);
            this.couleur = '';
            this.chaine = null;


            return false;
        } else {

            this.objJquery.removeClass('pierre-vide').removeClass('pierre-hover-' + couleur).addClass('pierre-' + couleur);
            this.objJquery.css('background', '');

            return true;
        }
    }
    return false;
};

Pierre.prototype.setChaine = function () {
    coordX = this.coord.x;
    coordY = this.coord.y;

    var chaine = [];

    if (coordX > 0 && this.goban.pierres[coordY][coordX - 1].pose && this.goban.pierres[coordY][coordX - 1].couleur === this.couleur) {
        chaine.push(this.goban.pierres[coordY][coordX - 1].chaine);
    }
    if (coordX < this.goban.taille - 1 && this.goban.pierres[coordY][coordX + 1].pose && this.goban.pierres[coordY][coordX + 1].couleur === this.couleur) {
        chaine.push(this.goban.pierres[coordY][coordX + 1].chaine);
    }
    if (coordY > 0 && this.goban.pierres[coordY - 1][coordX].pose && this.goban.pierres[coordY - 1][coordX].couleur === this.couleur) {
        chaine.push(this.goban.pierres[coordY - 1][coordX].chaine);
    }
    if (coordY < this.goban.taille - 1 && this.goban.pierres[coordY + 1][coordX].pose && this.goban.pierres[coordY + 1][coordX].couleur === this.couleur) {
        chaine.push(this.goban.pierres[coordY + 1][coordX].chaine);
    }

    switch (chaine.length) {
        case 0:
            this.chaine = new Chaine(this, this.goban);
            break;
        case 1:
            this.chaine = chaine[0].ajouterPierre(this);
            break;
        case 2:
            this.chaine = chaine[0].collerChaine(chaine[1]).ajouterPierre(this);
            break;
        case 3:
            this.chaine = chaine[0].collerChaine(chaine[1]).collerChaine(chaine[2]).ajouterPierre(this);
            break;
        case 4:
            this.chaine = chaine[0].collerChaine(chaine[1]).collerChaine(chaine[2]).collerChaine(chaine[3]).ajouterPierre(this);
            break;
    }

};

Pierre.prototype.capture = function () {
    var pierre = this;
    var couleur = this.couleur;
    this.couleur = '';
    pierre.objJquery.addClass('pierre-vide').fadeOut(200, function () {
        pierre.objJquery.removeClass('pierre-' + couleur).css('display', '');
    });
    this.pose = false;
    this.chaine = null;
};