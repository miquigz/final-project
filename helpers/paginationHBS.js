let rangeFirst = 0;
let rangeLast = 9;

let indiceActual;

Handlebars.registerHelper('setIndice', function (value) {
    return (value >= rangeFirst && value <= rangeLast);
});

Handlebars.registerHelper('isInRange', function (value) {
    return (value >= rangeFirst && value <= rangeLast);
});

Handlebars.registerHelper('setRange', function (value1, value2) {
    this.rangeFirst = value1;
    this.rangeLast = value2;
});