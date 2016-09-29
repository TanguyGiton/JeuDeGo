// JavaScript Document

function Coup(partie, joueur) {

    this.joueur = joueur;
    this.partie = partie;
    this.coord = {
        x: -1,
        y: -1
    };
    this.passe = false;

    partie.text.hide();
    partie.text.html("C'est au tour de " + this.joueur.nom + " de jouer !");
    partie.text.fadeIn(300);

    if (this.joueur.isHuman) {
        this.human();
    } else {
        this.IA(500);
    }
}

Coup.prototype.human = function () {
    var idElement;
    var coup = this;
    var coord;

    $('.pierre.pierre-vide').mouseenter(function (e) {

        $(this).addClass('pierre-hover-' + coup.joueur.couleur);

    }).mouseleave(function (e) {

        $(this).removeClass('pierre-hover-' + coup.joueur.couleur);

    }).click(function (e) {

        idElement = $(this).attr("id");
        coord = idElement.split('-');

        coup.coord.x = parseInt(coord[2], 10);
        coup.coord.y = parseInt(coord[1], 10);

        coup.evaluate();

    });

    this.partie.buttonPasse.click(function (e) {

        coup.passe = true;
        coup.fin();

    });
};

Coup.prototype.IA = function (delai) {
    if (!this.partie.aPasse) {

        var coup = this;

        setTimeout(function () {
            do {
                coup.coord.x = Math.floor(Math.random() * coup.partie.goban.taille);
                coup.coord.y = Math.floor(Math.random() * coup.partie.goban.taille);
            } while (coup.partie.goban.pierres[coup.coord.y][coup.coord.x].pose);

            coup.evaluate();

        }, delai);

    } else {
        this.passe = true;
        this.fin();
    }
};

Coup.prototype.evaluate = function () {

    var goban = this.partie.goban;

    goban.pierres[this.coord.y][this.coord.x].pose = true;
    goban.pierres[this.coord.y][this.coord.x].couleur = this.joueur.couleur;

    var chainesCapturees = [];

    if (this.coord.x > 0 && goban.pierres[this.coord.y][this.coord.x - 1].pose && goban.pierres[this.coord.y][this.coord.x - 1].couleur !== this.joueur.couleur) {
        if (goban.pierres[this.coord.y][this.coord.x - 1].chaine.comptLibertes() === 0) {
            chainesCapturees.push(goban.pierres[this.coord.y][this.coord.x - 1]);
        }

    }

    if (this.coord.x < goban.taille - 1 && goban.pierres[this.coord.y][this.coord.x + 1].pose && goban.pierres[this.coord.y][this.coord.x + 1].couleur !== this.joueur.couleur) {

        if (goban.pierres[this.coord.y][this.coord.x + 1].chaine.comptLibertes() === 0) {
            chainesCapturees.push(goban.pierres[this.coord.y][this.coord.x + 1]);
        }

    }

    if (this.coord.y > 0 && goban.pierres[this.coord.y - 1][this.coord.x].pose && goban.pierres[this.coord.y - 1][this.coord.x].couleur !== this.joueur.couleur) {

        if (goban.pierres[this.coord.y - 1][this.coord.x].chaine.comptLibertes() === 0) {
            chainesCapturees.push(goban.pierres[this.coord.y - 1][this.coord.x]);
        }

    }

    if (this.coord.y < goban.taille - 1 && goban.pierres[this.coord.y + 1][this.coord.x].pose && goban.pierres[this.coord.y + 1][this.coord.x].couleur !== this.joueur.couleur) {

        if (goban.pierres[this.coord.y + 1][this.coord.x].chaine.comptLibertes() === 0) {
            chainesCapturees.push(goban.pierres[this.coord.y + 1][this.coord.x]);
        }

    }

    goban.pierres[this.coord.y][this.coord.x].pose = false;

    var i, length = chainesCapturees.length;

    var memCouleur = [];

    for (i = 0; i < length; i++) {
        memCouleur[i] = chainesCapturees[i].couleur;
        chainesCapturees[i].couleur = "";
    }

    if (goban.memeEtat()) {

        goban.pierres[this.coord.y][this.coord.x].couleur = '';

        for (i = 0; i < length; i++) {
            chainesCapturees[i].couleur = memCouleur[i];
        }

        if (this.joueur.isHuman) {
            alert("Répétition interdite !");
        } else {
            this.IA(0);
        }

    } else {

        goban.pierres[this.coord.y][this.coord.x].couleur = '';

        for (i = 0; i < length; i++) {
            chainesCapturees[i].couleur = memCouleur[i];
            chainesCapturees[i].chaine.capture();
        }

        if (!goban.pierres[this.coord.y][this.coord.x].setPose(this.joueur.couleur)) {

            if (this.joueur.isHuman) {
                alert("Suicide interdit !");
            } else {
                this.IA(0);
            }

        } else {
            this.fin();
        }
    }
};

Coup.prototype.repetition = function () {

};

Coup.prototype.fin = function () {
    $('.pierre').unbind("mouseenter").unbind("mouseleave").unbind("click");
    this.partie.buttonPasse.unbind("click");
    this.partie.goban.sauvEtat();
    this.partie.coupSuivant(this.passe);
};