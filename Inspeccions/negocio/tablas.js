var aConfig = null;

function getConfigKey(sKey, aConfig){
    var sDev = '';
    for(var x=0; x<aConfig[0].length; x++)
    {
        if(aConfig[0][x][0] == sKey)
        {
            sDev = aConfig[0][x][1];
            break;
        }
    }
    return sDev;
}

function cargaCarrersEnArray(){
    if($('#selectLletraIniCARRER').find(":selected").text().trim() == '') return;

    var letraIniCalle = $('#selectLletraIniCARRER').find(":selected").text().trim();

    aCarrers = new Array();

    var aRegistro = null;
    var aCampos = null;
    var r = 0;
    var c = 0;

    $.ajax({
        cache: "true",
        type: "GET",
        url: "../tablas/carrers.xml",
        dataType: "xml",
        success: function(datos) {
            $(datos).find("carrer_" + letraIniCalle).each(function () {
                c = 0;
                aRegistro = new Array();
                $(this).children().each(function () {
                    aCampo = new Array(2);
                    aCampo[0] = this.tagName;
                    aCampo[1] = $(this).text();
                    aRegistro[c++] = aCampo;
                });
                aCarrers[r++] = aRegistro;
            });
        },
        error: function(xhr, ajaxOptions, thrownError){
            mensaje("ERROR (Carrers) : " + xhr.status + '\n' + thrownError + '\n' + xhr.responseText , "error");
        },
        async: false
    });
}

function cargaTablaEnArray(sFicTabla, sItem){
    var aArray = new Array();

    var aRegistro = null;
    var aCampos = null;
    var r = 0;
    var c = 0;

    $.ajax({
        cache: "true",
        type: "GET",
        url: "../tablas/" + sFicTabla + ".xml",
        dataType: "xml",
        success: function(datos) {
            $(datos).find(sItem).each(function () {
                c = 0;
                aRegistro = new Array();
                $(this).children().each(function () {
                    aCampo = new Array(2);
                    aCampo[0] = this.tagName;
                    aCampo[1] = $(this).text();
                    aRegistro[c++] = aCampo;
                });
                aArray[r++] = aRegistro;
            });
            return aArray;
        },
        error: function(xhr, ajaxOptions, thrownError){
            mensaje("ERROR (Nivel1) : " + xhr.status + '\n' + thrownError + '\n' + xhr.responseText , "error");
            return null;
        },
        async: false
    });
    return aArray;
}

//devuelve un array de objetos atributo o null
function cargaArrayAtributos(sIdItem){
    var aAtribs = cargaTablaEnArray("incItemsAtributs" , "item_" + sIdItem);
    if(aAtribs == null || aAtribs.length < 1) {
        return null;
    }

    var sAtrId = "";
    var aAtributos = [];
    var aUnAtributo = [];
    var aListaValores = [];
    var idPadre = "";
    var sDesc = "";
    var sTipo = "";
    var sObl = "";
    var sDef = "";
    var objAtr = {};
    for(var x=0; x<aAtribs.length; x++)
    {
        objAtr = new Atributo();
        //uno de los atributos del item
        sAtrId = aAtribs[x][0][1];
        aUnAtributo = cargaTablaEnArray("incAtributsId" , "item_" + sAtrId);
        if(aUnAtributo != null && aUnAtributo.length > 0)
        {
            sDesc = aUnAtributo[0][1][1];
            sTipo = aUnAtributo[0][2][1];
            sObl =  aUnAtributo[0][3][1];
            sDef =  aUnAtributo[0][4][1];

            objAtr.ID = sAtrId;
            objAtr.DESC = sDesc;
            objAtr.TIPO = sTipo;
            objAtr.OBL = sObl;
            objAtr.DEF = sDef;
            objAtr.AVALORES = null; //de momento ...

            //Si es de tipo lista montar un combo ...
            if(sTipo == "L")
            {
                aListaValores = cargaTablaEnArray("incAtributsIdPadre" , "itemPadre_" + sAtrId);
                if(aListaValores != null && aListaValores.length > 0)
                {
                    var aValores = new Array();
                    for(var y=0; y< aListaValores.length; y++)
                    {
                        var aValor = new Array();
                        aValor[0] = aListaValores[y][0][1];
                        aValor[1] = aListaValores[y][1][1];
                        aValores[y] = aValor;
                    }
                    objAtr.AVALORES = aValores;
                }
            }
        }
        aAtributos.push(objAtr);
        objAtr = null;
    }

    aAtribs = null;
    aUnAtributo = null;
    aListaValores = null;

    return aAtributos;
}

