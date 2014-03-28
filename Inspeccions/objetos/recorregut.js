var objRecorregut = new Object();

objRecorregut.RE_COD = 0;
objRecorregut.RE_DES = '';
objRecorregut.DIS_COD = '';

function recorregut() {
    return objRecorregut;
}

function recorregut(aDatos) {
    if (undefined === aDatos) return objRecorregut;
    if (void 0 === aDatos) return objRecorregut;
    if(aDatos == null) return objRecorregut;

    try {
        this.RE_COD = aDatos['re_cod'];
        this.RE_DES = aDatos['re_des'] + '';
        this.DIS_COD = aDatos['dis_cod'] + '';
        return this;
    } catch (e) { alert('creant objecte : recorregut  ERROR : ' + e.message); return null; }
}

