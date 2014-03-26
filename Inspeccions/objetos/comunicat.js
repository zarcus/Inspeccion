var objComunicat = new Object();

objComunicat.ID = 0;
objComunicat.REFERENCIA = '';
objComunicat.ESTAT = '';
objComunicat.DATA = '';
objComunicat.CARRER = '';
objComunicat.NUM = '';
objComunicat.COORD_X = '';
objComunicat.COORD_Y = '';
objComunicat.COMENTARI = '';
objComunicat.ID_MSG_MOV = '';

function comunicat() {
    return objComunicat;
}

function comunicat(aDatos) {
    if (undefined === aDatos) return objComunicat;
    if (void 0 === aDatos) return objComunicat;
    if(aDatos == null) return objComunicat;

    try {
        this.ID = aDatos['id'];
        this.REFERENCIA = aDatos['referencia'] + '';
        this.ESTAT = aDatos['estat'] + '';
        this.DATA = aDatos['data'] + '';
        this.CARRER = aDatos['carrer'] + '';
        this.NUM = aDatos['num'] + '';
        this.COORD_X = aDatos['coord_x'] + '';
        this.COORD_Y = aDatos['coord_y'] + '';
        this.COMENTARI = aDatos['comentari'] + '';
        this.ID_MSG_MOV = aDatos['id_msg_mov'] + '';

        return this;
    } catch (e) { alert('creant objecte : comunicat  ERROR : ' + e.message); return null; }
}

//"ID", "REFERENCIA", "ESTAT", "DATA", "CARRER", "NUM", "COORD_X", "COORD_Y", "COMENTARI"