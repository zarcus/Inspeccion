var globalMarcadorMapa = null;

var lista_ERROR_SQL = new Array();
lista_ERROR_SQL[0] = 'ERROR desconegut';
lista_ERROR_SQL[1] = 'ERROR de base de dades';
lista_ERROR_SQL[2] = 'ERROR de versió';
lista_ERROR_SQL[3] = 'ERROR : massa llarg';
lista_ERROR_SQL[4] = 'ERROR : quota';
lista_ERROR_SQL[5] = 'ERROR de sintaxi';
lista_ERROR_SQL[6] = 'ERROR en constraint';
lista_ERROR_SQL[7] = 'ERROR timeout';

function localStorageRun() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function localStorageSupport() {
    if ("localStorage" in window && window["localStorage"] != null)
        return true;
    else
        return false;
}

function phoneGapRun() {
    return(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/));
}

function mensaje(msg,titulo) {
    if(phoneGapRun())
        navigator.notification.alert(msg, null, titulo);
    else
        alert(msg);

    //navigator.notification.alert('el mensaje',function() {},"el titulo" );
}

function abrirPopUp(pag){
    $.mobile.changePage("#" + pag, { transition: "pop", role: "dialog", reverse: true, changeHash: true });
    //$(".ui-dialog a[data-icon='delete']").remove();
}

function cerrarPopUp(pag){
    $("#" + pag).dialog("close");
}

function eliminarMarcadorMapa(){
    if(globalMarcadorMapa != null)
    {
        globalMarcadorMapa.setMap(null);
        globalMarcadorMapa = null;
    }
}

function nuevoMarcadorSobrePlanoClickInfoWindow(sMODO, mapa, pos,htmlText, nIcono, nMaxAncho, bMostrarBocataDeInicio, bSoloUnMarcadorSobreMapa, labelMostrarDir){
    var separador='#';
    if(bSoloUnMarcadorSobreMapa) {
        eliminarMarcadorMapa();
    }

    if(sMODO == 'ALTA')
        posAlta = pos; //por si es una alta, que envie al WS las coordenadas correctas

    var sIcono = '';
    if(nIcono != null) sIcono = "images/iconosMapa/number_" + nIcono.toString().trim() + ".png";

    var marcador = new google.maps.Marker({
        position: pos,
        icon: sIcono,
        map: mapa
    });


    globalMarcadorMapa = marcador;

    //HGS 05/12/13 AQUI, TENGO QUE HACER QUE SI CLIC HAGA EL verDatosComunicat(\'' + sDatos + '\',\'' + separador + '\');
    if(indefinidoOnullToVacio(htmlText) != '' && indefinidoOnullToVacio(nMaxAncho) != '')
    {
        var bocata = new google.maps.InfoWindow({ content: htmlText, maxWidth: nMaxAncho});
        google.maps.event.addListener(marcador, 'click', function() {
            bocata.open(mapa,marcador);
        });

        if(bMostrarBocataDeInicio)bocata.open(mapa,marcador);
    }

    if(sMODO == 'ALTA')
    {
        if(indefinidoOnullToVacio(labelMostrarDir) != '') $('#' + labelMostrarDir).text(sDireccionAlta);
        mapa.setCenter(posAlta);
    }
}

function crearMarcadorEventoClick(sMODO, map, bSoloUnMarcadorSobreMapa , labelMostrarDir, bActualizarControlesManualesCalleNum){
    google.maps.event.addListener(map, 'click', function(event) {

        var bDirEsLatLon = false;

        if(bSoloUnMarcadorSobreMapa) {
            eliminarMarcadorMapa();
        }

        if(sMODO == 'ALTA')
            posAlta = event.latLng; //por si es una alta, que envie al WS las coordenadas correctas

        sDireccionAlta == '';
        cogerDireccion(event.latLng, true);   //true ==> solo calle y num
        $.doTimeout(500, function(){
            if(sDireccionAlta == '')
            {
                sDireccionAlta  = event.latLng.lat() + " , " + event.latLng.lng();
                bDirEsLatLon = true;
            }
            else
            {
                bDirEsLatLon = false;
            }

    /*        if(sMODO == 'ALTA' && indefinidoOnullToVacio(labelMostrarDir) != '')
                $('#' + labelMostrarDir).text(sDir);*/

/*            if(sMODO == 'ALTA')
                sDireccionAlta = sDir;*/

            var sTxt = '<div><table><tr><td style="font-size:x-small; font-weight:bold;">detectat en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccionAlta + '</td></tr></table></div>';
            nuevoMarcadorSobrePlanoClickInfoWindow(sMODO, map, event.latLng, sTxt,null, 300, true, true, labelMostrarDir);

            if(sMODO == 'ALTA')
                if(indefinidoOnullToVacio(bActualizarControlesManualesCalleNum) != '' && !bDirEsLatLon)
                    if(bActualizarControlesManualesCalleNum) autoRellenoCalleNum();

        });
    });
}

function crearMarcadorDesdeCalleNum(){
    if($('#selectCARRER').find(":selected").text().trim() == '' || $('#inputNUM').val().trim() == '' ) return;
    var calle = $('#selectCARRER').find(":selected").text().trim();

/*    var sTipoVia = calle.split("(")[1].substr(0, (calle.split("(")[1].length -1)).trim();
    var sCalle = calle.split("(")[1].trim();
*/

    var sTipoVia = calle.split("(")[1].substr(0,calle.split("(")[1].indexOf(")")).trim();

    //var sCalle = calle.split("[")[1].trim().substr(0, calle.split("[")[1].trim().length - 1);
    var sCalle = calle.split("(")[0].trim();

    var num = $('#inputNUM').val().trim();

    var ciudad = getConfigKey('ciudad', aConfig);
    alert(ciudad);
    var region = getConfigKey('region', aConfig);
    alert(region);
    var pais = getConfigKey('pais', aConfig);
    alert(pais);

alert('envio a GMaps : ' +  sTipoVia + ' ' + sCalle + ' ' +  num + ' ' +  ciudad + ' ' + region + ' ' + pais );
    alert(mapAlta);
    showAddress('ALTA',mapAlta, sTipoVia,sCalle, num , ciudad ,region ,pais);
}

function showAddress(sMODO,map, sTipoVia,sCalle,num,ciudad,region,pais) {
    sDireccionAlta = sTipoVia + " " + sCalle + ", " + num;
    var direccion = sDireccionAlta + ", " + ciudad + ", " + region + ", " + pais;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': direccion}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var sTxt = '<div><table><tr><td style="font-size:x-small; font-weight:bold;">comunicat en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccionAlta + '</td></tr></table></div>';
            nuevoMarcadorSobrePlanoClickInfoWindow(sMODO,map, results[0].geometry.location , sTxt ,null, 300 , true, true, 'labelDireccion');
        } else {
            //alert('La localització sobre plànol no ha estat posible per : ' + status);
            $('#divMensajeMapa').show();
            $('#divContieneMapa').hide();
        }
    });
}

function getCurrentPositionError(errorFlag) {
    var content = '';
    if (errorFlag) {
        content = 'Error en el servei de geolocalització.';
    } else {
        content = 'Error: el seu navegador no soporta geolocalització';
    }
    //mensaje(content);
    //$('#labelMensajeMapsa').show();
}

function cogerCalleNumDeDireccion(sDireccion){
    var sDev = '';
    try
    {
        if(indefinidoOnullToVacio(sDireccion) != '')
                sDev = sDireccion.split(",")[0] + ", " + sDireccion.split(",")[1];
    }
    catch(e) {}
    return sDev;
}

function FechaHoy() {
    var d = new Date();
    return (parseInt(d.getDate()) < 10 ? '0' : '') + d.getDate().toString() + '/' + (parseInt(d.getMonth() + 1) < 10 ? '0' : '') + (parseInt(d.getMonth()) + 1).toString() + '/' + d.getFullYear().toString();
}

function HoraAhora() {
    var d = new Date();
    return (parseInt(d.getHours()) < 10 ? '0' : '') + d.getHours().toString() + ':' + (parseInt(d.getMinutes()) < 10 ? '0' : '') + d.getMinutes().toString() + ":00" ;
}

function ReplicateString(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 0) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result;
}

function estadoControl(control, bHabilitar){
    if(bHabilitar)
    {
        try{ $('#' + control).removeAttr("disabled", "disabled"); } catch(e) {}
        try{ $('#' + control).removeClass('ui-disabled'); } catch(e) {}
        try{ $('#' + control).attr("enabled", "enabled"); } catch(e) {}
        try{ $('#' + control).addClass('ui-enabled'); } catch(e) {}
    }
    else
    {
        try{ $('#' + control).removeAttr("enabled", "enabled"); } catch(e) {}
        try{ $('#' + control).removeClass('ui-enabled'); } catch(e) {}
        try{ $('#' + control).attr("disabled", "disabled"); } catch(e) {}
        try{ $('#' + control).addClass('ui-disabled'); } catch(e) {}
    }
}

function estadoBoton(boton, bHabilitar){
    if(bHabilitar)
    {
        try{ $('#' + boton).button('enable'); } catch(e) { }
        try{ $('#' + boton).attr("enabled", "enabled"); } catch(e) {}
        try{ $('#' + boton).removeClass('ui-disabled'); } catch(e) {}
    }
    else
    {
        try{ $('#' + boton).button('disable'); } catch(e) { }
        try{ $('#' + boton).addClass('ui-disabled'); } catch(e) { }
        try{ $('#' + boton).attr("disabled", "disabled"); } catch(e) { }
    }

    try{ $('#' + boton).attr("onclick", ""); } catch(e) { }
    try{ $('#' + boton).attr('href', '');  } catch(e) { }
    try{ $('#' + boton).button('refresh');  } catch(e) { }
}

//cambiar el texto de un boton
(function($) {
    /*
     * Changes the displayed text for a jquery mobile button.
     * Encapsulates the idiosyncracies of how jquery re-arranges the DOM
     * to display a button for either an <a> link or <input type="button">
     */
    $.fn.changeButtonText = function(newText) {
        return this.each(function() {
            $this = $(this);
            if( $this.is('a') ) {
                $('span.ui-btn-text',$this).text(newText);
                return;
            }
            if( $this.is('input') ) {
                $this.val(newText);
                // go up the tree
                var ctx = $this.closest('.ui-btn');
                $('span.ui-btn-text',ctx).text(newText);
                return;
            }
        });
    };
})(jQuery);

function indefinidoOnullToVacio(algo){
    if (undefined === algo) return '';
    if (void 0 === algo) return '';
    if(algo == null) return '';
    return algo;
}

function ParseEstado(sEstat){
    switch(sEstat)
    {
        case 'D' :
            return 'DESESTIMAT';
            break;

        case 'TANC' :
            return 'TANCAT';
            break;

        case 'ACEP' :
            return 'ACCEPTAT';
            break;

        case 'GES' :
            return 'GESTIONANT';
            break;

        default :
            return sEstat;
            break;
    }
}

function esEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function esTelefono(telefono){
    if(indefinidoOnullToVacio(telefono) != '')
    {
        if(telefono.length != 9 ) return false;
        if(Number(telefono)!= telefono) return false;
        return true;
    }
    else
        return false;
}

function esDni(dni){
        var numero;
        var le;
        var letra;
        var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

        dni = dni.toUpperCase();

        if(expresion_regular_dni.test(dni) === true){
            numero = dni.substr(0,dni.length-1);
            numero = numero.replace('X', 0);
            numero = numero.replace('Y', 1);
            numero = numero.replace('Z', 2);
            le = dni.substr(dni.length-1, 1);
            numero = numero % 23;
            letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
            letra = letra.substring(numero, numero+1);
            if (letra != le) {
                //alert('Dni erroneo, la letra del NIF no se corresponde');
                return false;
            }else{
                //alert('Dni correcto');
                return true;
            }
        }else{
            return false;
        }
}

function cargaLetrasAbcdario(combo, sTitulo, nLetraSel){
    combo.empty();
    var h=0;
    var aLetras = new Array();
    for(n=65; n<92; n++)
    {
        aLetras[h++] = String.fromCharCode(n);
    }
    h--;
    for(i=0; i<10; i++)
        aLetras[h++] = (i).toString();

    var letras = [];
    letras.push("<option value='-1' data-placeholder='true'>" + sTitulo + "</option>");
    for (var x = 0; x < aLetras.length; x++)
    {
        letras.push("<option value='" + x + "'>" + aLetras[x] + "</option>");
    }
    combo.append(letras.join('')).selectmenu('refresh');
}

function cargaComboDesdeArray(combo, sTitulo, aArray){
    combo.empty();
    var options = [];
    options.push("<option value='-1' data-placeholder='true'>" + sTitulo + "</option>");
    for (var x = 0; x < aArray.length; x++)
    {
        options.push("<option value='" + aArray[x][0][1] + "'>" + aArray[x][1][1] + "</option>");
    }
    combo.append(options.join('')).selectmenu('refresh');
}