function getDatosUsuario(){
    var objUsu = null;
    //var sSel = "SELECT ID, NOM, COGNOM1, COGNOM2, DNI, EMAIL, TELEFON FROM CIUTADA";  //Sólo hay un registro o ninguno
    try {
        objUsu = leeObjetoLocal('CIUTADA', 'NO_EXISTE');
        if(objUsu == 'NO_EXISTE')
            return new usuari();
        else
            return objUsu;
    }
    catch (err) {
        mensaje('Error obtenint dades ciutadà : ' + err.message);
        return null;
    }
}

/*function getCarrers(){
    aGlobalCarrers = new Array();

    var objCarrer = null;
    var n=0;
    try {
        while (true){
            objCarrer = leeObjetoLocal('CARRER_' + n.toString().trim() , 'NO_EXISTE');
            if(objCarrer == 'NO_EXISTE') break;
            aGlobalCarrers[n++] = objCarrer;
        }
        return aGlobalCarrers;
    }
    catch(e){
        mensaje('Error obtenint el carrers : ' + e);
        return null;
    }
}*/

function getComunicats(){
    var aComunicats = new Array();

    //var sSel = "Select ID, REFERENCIA, ESTAT, DATA, CARRER, NUM, COORD_X, COORD_Y, COMENTARI From COMUNICATS Order By ID DESC";

    var objComunicat = null;
    var nInd = 0;
    var n = leeObjetoLocal('COMUNICATS_NEXTVAL' , 0);
    try {
        while (true){
            objComunicat = leeObjetoLocal('COMUNICAT_' + (n--).toString().trim() , 'NO_EXISTE');
            if(objComunicat == 'NO_EXISTE') break;
            aComunicats[nInd++] = objComunicat;
        }
        return aComunicats;
    }
    catch(e){
        mensaje('Error obtenint els comunicats : ' + e);
        return null;
    }
}

//objComunicat = objeto comunicat
function getArrayComunicat(objComunicat){
    var aDatosCom = new Array();
    aDatosCom['id'] = objComunicat.ID;
    aDatosCom['referencia'] = objComunicat.REFERENCIA;
    aDatosCom['estat'] = objComunicat.ESTAT;
    aDatosCom['data'] = objComunicat.DATA;
    aDatosCom['carrer'] = objComunicat.CARRER;
    aDatosCom['num'] = objComunicat.NUM;
    aDatosCom['coord_x'] = objComunicat.COORD_X;
    aDatosCom['coord_y'] = objComunicat.COORD_Y;
    aDatosCom['comentari'] = objComunicat.COMENTARI;
    aDatosCom['id_msg_mov'] = objComunicat.ID_MSG_MOV;
    return aDatosCom;
}

function getCadenaComunicat(objComunicat , separador){
    var sDev = "";
    try
    {
        sDev += indefinidoOnullToVacio(objComunicat.ID) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.REFERENCIA) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.ESTAT) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.DATA) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.CARRER) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.NUM) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.COORD_X) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.COORD_Y) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.COMENTARI) + separador;
        sDev += indefinidoOnullToVacio(objComunicat.ID_MSG_MOV) + separador;
    }
    catch(e){
        mensaje('ERROR (exception) en getCadenaComunicat : : \n' + e.code + '\n' + e.message);
    }
    return sDev;
}

