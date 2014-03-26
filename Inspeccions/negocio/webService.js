
// ********************* METODOS PARA EL ACCESO A WebServices Y OBTENCIÓN DE DATOS ********************************
var global_AjaxERROR = '';
var global_AjaxRESULTADO = null;

function envioWSpost(sUrl,sParams){
    var sDev = '.';
//    var imagen = imagenDePrueba();
    //var url = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/NuevaIncidencia";
    //var url = "http://172.26.0.2:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/NuevaIncidencia";

    $.post(sUrl, sParams).done(function(data) {
        global_AjaxRESULTADO = data;
        global_AjaxERROR = '';
    }).fail(function() {
                global_AjaxERROR = 'Error en post'; global_AjaxRESULTADO = null
    });
}

function LlamaWebService(sTipoLlamada,sUrl, sParametros,sContentType, bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion, pasaParam, asincro, bProcesar, tag) {
    global_AjaxRESULTADO = null;
    global_AjaxERROR = '';
    $.support.cors = true;
    $.ajax({
        type: sTipoLlamada,
        url: sUrl,
        global: false,
        data: sParametros,
        contentType: sContentType,
        crossDomain: bCrossDom,
        dataType: sDataType,
        processData: bProcData,
        cache: bCache,
        timeout: nTimeOut,
        success: function (xml) {
            if(bProcesar)
                global_AjaxRESULTADO = procesaResultado(xml,tag);
            else
                global_AjaxRESULTADO = xml;

            if (funcion != null) {
                funcion(global_AjaxRESULTADO, pasaParam);
            }
            else return global_AjaxRESULTADO;
        },
        error: function (e, f, g) {
            //global_AjaxERROR = 'ERROR en LlamaWebService \r\n' + e.message + ' ' + e.Description + ' ' + f + ' ' + g + ' en ' + ws + '  ' + sUrl + ' amb ' + sParametros;
            global_AjaxERROR = 'ERROR en LlamaWebService : ' + e.message + ' ' + e.Description + ' ' + f + ' ' + g + ' en ' + sUrl + '    params: ' + sParametros;
            if (funcion != null) funcion(global_AjaxERROR, pasaParam);
        },
        async: asincro
    });
    return global_AjaxRESULTADO;
}

function procesaResultado(xml, tag) {
    var aCampo = new Array();
    var aRegistro = new Array();
    var aTabla = new Array();
    var nomCampo = '';
    var valCampo = '';
    var r = 0;  //indice de los registros de la tabla
    var c = 0;  //incice de los campos de un registro

//mensaje('en ProcesaResultado(). tag buscar : ' + tag);
    var sId = '';
    $(xml).find(tag).each(function () {
//mensaje('en ProcesaResultado(). bucle de tags  r = ' + r.toString());
        c = 0;
        aRegistro = new Array();
        //$(this).children().each(function () {
            nomCampo = this.tagName;
            valCampo = $(this).text();
            aCampo = new Array(2);
            aCampo[0] = nomCampo;
            aCampo[1] = valCampo;
//mensaje('en ProcesaResultado(). extrayendo del xml recibido : ' + nomCampo + ' : ' + valCampo);
            aRegistro[c] = aCampo;
            c += 1;
        //});
        aTabla[r] = aRegistro;
//mensaje('en ProcesaResultado(). aTabla[' + r.toString() + '] = ' + aTabla[r]);
        r += 1;
    });

//mensaje('en ProcesaResultado(). aTabla.length : ' + aTabla.length + ' aTabla : ' + aTabla);
    return aTabla;
}
