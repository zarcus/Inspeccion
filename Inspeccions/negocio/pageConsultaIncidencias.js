var mapConsulta = null;
var posConsulta = '';
var sDireccionConsulta = '';
var aMarcadoresSobrePlano = new Array();

function inicioPaginaConsultaIncidencias(){
    cargaListaComunicats(getComunicats());

    // $(document).on('pageinit', '#pageConsultaIncidencias',  function(){

        //Ocultar el plano
        $("#divMapaConsulta").hide();
        $("#divSobreMapaConsulta").hide();
        $("#buttonMostrarEnPlano").changeButtonText("mostrar plànol");
        //$("#buttonMostrarEnPlano").button('refresh');

    // });
}

//aComs = array de objetos 'comunicat'
function cargaListaComunicats(aComs){
    $('#listviewLista').children().remove('li');

    if(aComs == null || aComs.length < 1) {
        $('#listviewLista').listview('refresh');
        return ;
    }

    var sFila = "";
    var sDatos = "";
    var separador = "#";

    for(var x=0; x<aComs.length; x++)
    {
        sDatos = getCadenaComunicat(aComs[x] , separador);

        //sDatos = sDatos.replace("'","''","g");
        var aComillas = sDatos.split("'");
        sDatos = "";
        for(var z=0; z<aComillas.length; z++) sDatos += aComillas[z] + "´";
        sDatos = sDatos.substr(0,sDatos.length-1);

        //sFila = "<table style='width: 100%;'><tr><td style='text-align:left; font-size:x-small; width: 40%;'>" + aComs[x].REFERENCIA + "</td><td style='text-align:left; font-size:x-small; width: 40%;'>" + aComs[x].DATA + "</td><td style='text-align:left; font-size:x-small; width: 20%;'>" + aComs[x].ESTAT + "</td></tr></table>";
        sFila = "<table style='width: 100%;'><tr>";
        sFila += "<td style='text-align:left; font-size:x-small; width: 15%;'>" + aComs[x].ID + "</td>";
        sFila += "<td style='text-align:left; font-size:x-small; width: 55%;'>" + ParseEstado(aComs[x].ESTAT) + "</td>";
        sFila += "<td style='text-align:left; font-size:x-small; width: 30%;'>" + aComs[x].REFERENCIA + "</td>";
        sFila += "</tr></table>";

        $('#listviewLista').append($('<li/>', {
            'id': "fila_" + aComs[x].ID, 'data-icon': "arrow-r"
        }).append($('<a/>', {
                'href': '',
                'onclick': "verDatosComunicat('" + sDatos + "','" + separador + "')",
                'data-transition': 'slide',
                'html': sFila
        })));
    }
    $('#listviewLista').listview('refresh');

}

function verDatosComunicat(sDatos, separador){
    $('#labelCOMUNICAT_ID').text('');
    $('#labelCOMUNICAT_CARRER').text('');
    $('#labelCOMUNICAT_NUM').text('');
    $('#labelCOMUNICAT_COMENTARI').text('');
    $('#labelCOMUNICAT_REFERENCIA').text('');
    $('#labelCOMUNICAT_DATA').text('');
    $('#labelCOMUNICAT_ESTAT').text('');

    var aDatos = new Array();
    try
    {
        aDatos = sDatos.split(separador);
        $('#labelCOMUNICAT_ID').text(aDatos[0]);
        $('#labelCOMUNICAT_REFERENCIA').text(aDatos[1]);
        $('#labelCOMUNICAT_ESTAT').text(aDatos[2]);
        $('#labelCOMUNICAT_DATA').text(aDatos[3]);
        var sTipoVia = "";
        var sCalle = "";
        var calle = aDatos[4];
        try{
            if(calle.length > 3)
            {
                sTipoVia = calle.split("(")[1].substr(0, (calle.split("(")[1].length -1));
                sCalle = calle.split("(")[0];
            }
            $('#labelCOMUNICAT_CARRER').text(sTipoVia + ' ' + sCalle);
        }
        catch(e){
            $('#labelCOMUNICAT_CARRER').text(calle);
        }
        $('#labelCOMUNICAT_NUM').text(aDatos[5]);
        $('#labelCOMUNICAT_COMENTARI').text(aDatos[8]);
        $('#labelCOMUNICAT_COORDENADES').text(aDatos[6] + " , " + aDatos[7]);
    }
    catch(e) {
        mensaje('exception en verDatosComunicat : ' + e.message , 'error');
    }

    $.mobile.silentScroll(0);
    $("#panelDadesComunicat").panel("open");

    //abrirPagina('pageDatosComunicat', true);

}

function estadoDelPlano(){
    if($('#buttonMostrarEnPlano').text().trim().substr(0,7) == "ocultar")
    {
        $("#buttonMostrarEnPlano").changeButtonText("mostrar plànol");
        $("#divMapaConsulta").hide();
        $("#divSobreMapaConsulta").hide();
        $.mobile.silentScroll(0);
    }
    else
    {
        $("#divSobreMapaConsulta").show();
        $('#divMapaConsulta').show();
        $("#buttonMostrarEnPlano").changeButtonText("ocultar plànol");
        mostrarEnPlano();
        $.mobile.silentScroll(1200);
    }

    //$("#buttonMostrarEnPlano").button("refresh");
}

function mostrarEnPlano() {
// Descapar para pruebas en PC :
//    var llamaWS = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/ConsultarIncidenciasZona";
//    var sParam  = "sLat=41.3965&sLon=2.1521";
    var aComs = new Array();
    aComs = getComunicats();

    if(aComs == null || aComs.length < 1) {
        return false;
    }

    aMarcadoresSobrePlano = new Array();

    var mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    mapConsulta = new google.maps.Map(document.getElementById('divMapaConsulta'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var paramPosInicial = new google.maps.LatLng(position.coords.latitude, position.coords.longitude );

            //Prueba llamada al WS ...
            /*
                var llamaWS = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/ConsultarIncidenciasZona";
                var sParam  = "sLat=" + position.coords.latitude;
                sParam += "&sLon=" +  position.coords.longitude;

                try
                {
                                             //(sTipoLlamada,sUrl,   sParametros,sContentType,                       bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion,                          pasaParam,      asincro, bProcesar,tag)
                    var datos = LlamaWebService('GET',       llamaWS,sParam,     'application/x-www-form-urlencoded',true,      'xml',     false,     false,  10000,    resultadoConsultarIncidenciasZona,paramPosInicial,false,   true,     'pos');
                }
                catch (e)
                {
                    mensaje('ERROR (exception) en iniciaMapaConsulta : \n' + e.code + '\n' + e.message);
                }
            */

            var pos = null;
            var dir = '';
            var sTipoVia = '';
            var sCalle = '';
            var sDatos = '';
            var separador = '#';
            for (var x = 0; x < aComs.length; x++) {
                try
                {
                    pos = new google.maps.LatLng(aComs[x].COORD_X, aComs[x].COORD_Y);

                    //centrar el mapa en el comunicado más reciente.
                    if(x==0) paramPosInicial = pos;

                    try
                    {
                        dir = aComs[x].CARRER + ', ' + aComs[x].NUM;
                    } catch(e) { dir = aComs[x].COORD_X + ' , ' +  aComs[x].COORD_Y; }

                    sDatos = getCadenaComunicat(aComs[x] , separador);

/*
                    var sTxt =  '<div><table>';
                    sTxt += '<tr><td style="font-size:xx-small;"><b>comunicat </b>' + aComs[x].REFERENCIA + '</td></tr>';
                    sTxt += '<tr><td style="font-size:xx-small;"><b>reportat el </b>' + aComs[x].DATA +'</td></tr>';
                    sTxt += '<tr><td style="font-size:xx-small;"><b>en </b>' + dir + '</td></tr>';
                    sTxt += '<tr><td style="font-size:xx-small;"><a href="" onclick="verDatosComunicat(\'' + sDatos + '\',\'' + separador + '\');">+info</a></td></tr></table></div>';
*/

                    //sDatos = sDatos.replace("'","´", "g");
                    var aComillas = sDatos.split("'");
                    sDatos = "";
                    for(var z=0; z<aComillas.length; z++) sDatos += aComillas[z] + "´";
                    sDatos = sDatos.substr(0,sDatos.length-1);

                    var sTxt =  '<div><table>';
                    sTxt += '<tr><td style="font-size:xx-small;"><a href="" onclick="verDatosComunicat(\'' + sDatos + '\',\'' + separador + '\');">info</a></td></tr>';
                    sTxt += '</table></div>';

                    nuevoMarcadorSobrePlanoClickInfoWindow('CONSULTA', mapConsulta, pos, sTxt, aComs[x].ID, 300, false, false);
                    aMarcadoresSobrePlano[x] = globalMarcadorMapa;
                } catch(ex){}
            }
            mapConsulta.setCenter(paramPosInicial);
            $('#divMapaConsulta').gmap('refresh');

        } , function () { getCurrentPositionError(true); });
    }
    else
    {
        // Browser no soporta Geolocation
        getCurrentPositionError(false);
    }
    return true;
}

function borrarHistoricoComunicados(){
    var nComunicats = leeObjetoLocal('COMUNICATS_NEXTVAL', -1);
    if(nComunicats != -1)
    {
        //Eliminar de la B.D.
        nComunicats += 1;
        var bBorrado = false;
        for(var x=0; x<nComunicats; x++)
        {
            bBorrado = borraObjetoLocal('COMUNICAT_' + x.toString().trim());
            if(!bBorrado) mensaje('El comunicat ' + x.toString().trim() + " no s'ha pogut esborrar","info");
        }
        //Actualizar la 'sequence'
        guardaObjetoLocal('COMUNICATS_NEXTVAL', -1);

        //limpiar el mapa :
        if(aMarcadoresSobrePlano.length > 0)
        {
            for (var x = 0; x < aMarcadoresSobrePlano.length; x++) {
                globalMarcadorMapa = aMarcadoresSobrePlano[x];
                eliminarMarcadorMapa();
            }
        }

        //limpiar/actualizar la lista
        inicioPaginaConsultaIncidencias();
    }
}

function enviamentDePendents(){
    var sIdsActualizar = "";
    var nIndexAct = 0;

    var aComs = new Array();
    aComs = getComunicats();

    var pNom = "";
    var pCognom1 = "";
    var pCognom2 = "";
    var pDni = "";
    var pEmail = "";
    var pTelefon = "";
    var objUsu = getDatosUsuario();
    if(objUsu != null)
    {
        pNom = objUsu.NOM + '';
        pCognom1= objUsu.COGNOM1 + '';
        pCognom2= objUsu.COGNOM2 + '';
        pDni= objUsu.DNI + '';
        pEmail= objUsu.EMAIL + '';
        pTelefon= objUsu.TELEFON + '';
    }

    var objComunicat = null;
    var bBorrado = false;
    var sParams = {};
    for(var x=0 ; x< aComs.length; x++){
        if(aComs[x].ESTAT == 'PENDENT_ENVIAMENT' || aComs[x].ESTAT == 'ERROR_ENVIAMENT'){
            sSuFoto = leeObjetoLocal('FOTO_' + aComs[x].ID , '');
            sParams = {sNom:pNom, sCognom1:pCognom1, sCognom2:pCognom2, sDni:pDni, sEmail:pEmail, sTelefon:pTelefon, sObs:aComs[x].COMENTARI + '', sCoord:aComs[x].COORD_X + ',' + aComs[x].COORD_Y + '', sCodCarrer:'', sCarrer:aComs[x].CARRER + '', sNumPortal:aComs[x].NUM + '', sFoto: sSuFoto};

            var sRet = enviarComunicatPendiente_WS(sParams , false);

            if(sRet.length == 5)
                if(sRet == "ERROR")
                    break;

            //si ha retornado un codigo ...
            objComunicat = new comunicat();
            objComunicat.ID = aComs[x].ID;
            objComunicat.REFERENCIA = sRet;
            objComunicat.ESTAT = 'NOTIFICAT';
            objComunicat.DATA = aComs[x].DATA;
            objComunicat.CARRER = aComs[x].CARRER;
            objComunicat.NUM = aComs[x].NUM;
            objComunicat.COORD_X = aComs[x].COORD_X;
            objComunicat.COORD_Y = aComs[x].COORD_Y;
            objComunicat.COMENTARI = aComs[x].COMENTARI;
            objComunicat.ID_MSG_MOV = sRet;
            //Actualizo con nuevo estado

            bBorrado = borraObjetoLocal('COMUNICAT_' + aComs[x].ID);

            guardaObjetoLocal('COMUNICAT_' + aComs[x].ID, objComunicat);

            //Elimino la foto que había guardado
            bBorrado = borraObjetoLocal('FOTO_' + aComs[x].ID);

        }
        else //Actualizar el estado del comunicado (de las que están en cualquier estado excepto TANCADES)
        {
            if(aComs[x].ESTAT != 'TANCAT')
            {
                sIdsActualizar += aComs[x].ID_MSG_MOV + "|" + aComs[x].ID + ",";
            }
        }
    }

    //Si hay posibles actualizaciones de comunicats
    if(sIdsActualizar.length > 0)
    {
        sIdsActualizar = sIdsActualizar.substr(0,sIdsActualizar.length - 1);
        ActualitzaComunicats(sIdsActualizar);
    }
}

function ActualitzaComunicats(sParams){
    //Llamar al WS 'ConsultaEstadoComunicats' pasandole un string con los id's separados por comas
    if(sParams.indexOf(',') == 0) sParams = sParams.substr(1);
    if(sParams.indexOf(',') == sParams.length-1) sParams = sParams.substr(0, sParms.length - 1);

    var aParams = {sIds:sParams};
    var llamaWS = "http://80.36.225.19:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/ConsultaEstadoComunicats";
    $.post(llamaWS, aParams).done(function(datos) {
        try
        {
            if(datos == null)  //==> ha habido error
            {
                mensaje("L'actualització no ha estat posible\n" ,"pot ser no hi ha conexió");
                return;
            }
            else     //==> el WS ha devuelto algo
            {
                var aResultados = new Array();
                var r = 0;
                var c = 0;

                //el XML que devuelve tiene uno o varios :
                //<resultado>
                //  <id></id>
                //  <estado></estado>
                //  <refUlls></refUlls>
                //  <idLocal></idLocal>
                //</resultado>

                $(datos).find("resultado").each(function () {
//alert('resultado encontrado');
                    c = 0;
                    aRegistro = new Array();
                    $(this).children().each(function () {
//alert('children');
                        var aCampo = new Array(2);
                        aCampo[0] = this.tagName;
                        aCampo[1] = $(this).text();
//alert('en ProcesaResultado(). extrayendo del xml recibido : ' + this.tagName + ' : ' +  $(this).text() );
                        aRegistro[c++] = aCampo;

                    });
//alert(aRegistro[0][0] + ' = ' + aRegistro[0][1] + '\n' + aRegistro[1][0] + ' = ' + aRegistro[1][1] + '\n' +aRegistro[2][0] + ' = ' + aRegistro[2][1] + '\n' + aRegistro[3][0] + ' = ' + aRegistro[3][1]);
                    aResultados[r++] = aRegistro;
//alert('en ProcesaResultado(). aResultados[' + (r-1).toString() + '] = ' + aResultados[r-1]);
                });
            }
            if(aResultados.length > 0)
            {
                //actualizo en BD local
                GuardaActualizacionComunicats(aResultados);

                //y recargo la lista
                inicioPaginaConsultaIncidencias();
            }
        }
        catch(e)
        {
            mensaje("ERROR (exception) en 'actualitzaComunicats' : \n" + e.code + "\n" + e.message);
        }
    }).fail(function() {
            mensaje("ERROR actualitzant en 'actualitzaComunicats'");
    });
}

function GuardaActualizacionComunicats(aResultados){
    var aRegistro = new Array();
    var aDatos = new Array();

    try{

        //  <id></id>
        //  <estado></estado>
        //  <refUlls></refUlls>
        //  <idLocal></idLocal>
        var nPosId = 0;
        var nPosEstado = 1;
        var nPosRefUlls = 2;
        var nPosIdLocal = 3;

        for(x=0; x<aResultados.length; x++)
        {
            aRegistro = aResultados[x];

            aDatos = new Array();

            //recupero los datos que ya tenia guardados pq los machacará al guardar ....
            var objComunicatEXISTENTE = null;
            objComunicatEXISTENTE = leeObjetoLocal('COMUNICAT_' + aRegistro[nPosIdLocal][1].toString().trim(),'');

            aDatos['id'] = aRegistro[nPosIdLocal][1].toString().trim();
            aDatos['referencia'] = aRegistro[nPosRefUlls][1] + '';
            aDatos['estat'] = aRegistro[nPosEstado][1] + '';
            aDatos['data'] + objComunicatEXISTENTE.DATA + '';
            aDatos['carrer'] = objComunicatEXISTENTE.CARRER + '';
            aDatos['num'] = objComunicatEXISTENTE.NUM + '';
            aDatos['coord_x'] = objComunicatEXISTENTE.COORD_X + '';
            aDatos['coord_y'] = objComunicatEXISTENTE.COORD_Y + '';
            aDatos['comentari'] = objComunicatEXISTENTE.COMENTARI + '';
            aDatos['id_msg_mov'] = aRegistro[nPosId][1] + '';

            var objComunicatACTUALIZADO = new comunicat(aDatos);

 //alert('guardo COMUNICAT_' + aRegistro[nPosIdLocal][1].toString().trim() + '  con  ' + objComunicatACTUALIZADO.REFERENCIA +  '  (para el id_msg_mov = ' + objComunicatACTUALIZADO.ID_MSG_MOV + ')');

            //y actualizo (machaco) con la nueva info
            guardaObjetoLocal('COMUNICAT_' + aRegistro[nPosIdLocal][1].toString().trim() , objComunicatACTUALIZADO);
        }
    }
    catch(e)
    {
         mensaje('ERROR (exception) en GuardaActualizacionComunicats : \n' + e.code + '\n' + e.message);
    }
}







