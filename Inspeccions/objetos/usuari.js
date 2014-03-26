var objUsuari = new Object();

objUsuari.ID = 0;
objUsuari.NOM = '';
objUsuari.COGNOM1 = '';
objUsuari.COGNOM2 = '';
objUsuari.DNI = '';
objUsuari.EMAIL = '';
objUsuari.TELEFON = '';

function usuari() {
    return objUsuari;
}

function usuari(aDatos) {
    if (undefined === aDatos) return objUsuari;
    if (void 0 === aDatos) return objUsuari;
    if(aDatos == null) return objUsuari;

    try {
        this.ID = aDatos['id'];
        this.NOM = aDatos['nom'] + '';
        this.COGNOM1 = aDatos['cognom1'] + '';
        this.COGNOM2 = aDatos['cognom2'] + '';
        this.DNI  = aDatos['dni'] + '';
        this.EMAIL  = aDatos['email'] + '';
        this.TELEFON = aDatos['telefon'] + '';
        return this;
    } catch (e) { alert('creant objecte : usuari  ERROR : ' + e.message); return null; }
}

