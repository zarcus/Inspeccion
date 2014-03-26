var objCarrer = new Object();

objCarrer.ID = 0;
objCarrer.TIPUS = '';
objCarrer.CARRER = '';

function carrer() {
alert('carr');
    return objCarrer;
}

function carrer(aDatos) {
    if (undefined === aDatos) return objCarrer;
    if (void 0 === aDatos) return objCarrer;
    if(aDatos == null) return objCarrer;

    try {
        this.ID = aDatos['id'];
        this.TIPUS = aDatos['tipus'] + '';
        this.CARRER = aDatos['carrer'] + '';
        return this;
    } catch (e) { alert('creant objecte : carrer  ERROR : ' + e.message); return null; }
}


