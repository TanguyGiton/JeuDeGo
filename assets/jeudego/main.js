// JavaScript Document

$(function () {
    $("#option-jeu").submit(function (e) {
        e.preventDefault();
        new Partie("#jeu", parseInt($("#tailleGoban").val()), parseInt($("#nbJoueur").val()));
    });
});