var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sFoto = '';
var sCoord_X = '';
var sCoord_Y = '';
var sComentario = '';

// -------- ENVIAR/GUARDAR COMUNICAT -----------------------------------------------------------
function fail(error) {
    alert(error);
}
function enviarIncidencia() {
    //per demo ho comento
    //guardaDatosCiudadano();

    alert('Enviant incidència');

    var sCoord = posAlta.toString().replace(" ", "").replace("(","").replace(")","");
    sComentario = $('#textareaObservaciones').val();

    if(sCoord != null && sCoord.trim() != '')
    {
        sCoord_X = sCoord.split(",")[0];
        sCoord_Y = sCoord.split(",")[1];
    }

    // La dirección correcta es la que ponga en el combo de calle y el numero de calle
    // ( ya que puede pasar que la que ha detectado google maps no sea correcta)
    if( indefinidoOnullToVacio($('#selectCARRER').val()) != '' && $('#selectCARRER').val() != '-1') //o sea, si han seleccionado una calle en el combo ...
    {
        sDireccionAlta = $('#selectCARRER').find(":selected").text() + ', ' + $('#inputNUM').val();
    }

    //Controlar datos obligatorios
    //LES DADES DEL CIUTADA AQUI PER LA DEMO SON NULES
    //var sMsg =  datosObligatorios(sComentario, sDireccionAlta, $('#inputDNI').val(), $('#inputEMAIL').val() ,$('#inputTELEFON').val() );
    var sMsg =  datosObligatorios(sComentario, sDireccionAlta,null,null,null);
    if(sMsg != ""){
        mensaje(sMsg,'Atenció');
        return;
    }

    var sParams = {sNom:'', sCognom1:'', sCognom2:'', sDni:'', sEmail:'', sTelefon:'', sObs:sComentario + '', sCoord:sCoord + '', sCodCarrer:$('#selectCARRER').val() + '', sCarrer:$('#selectCARRER').find(":selected").text() + '', sNumPortal:$('#inputNUM').val() + '', sFoto: sFoto};

    var ref = enviarComunicat_WS(sParams , true);
}

function enviarComunicat_WS(sParams , bNuevoComunicat){
    var llamaWS = "http://80.36.225.19:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/NuevaIncidenciaBD";
    try
    {
        var bEnvioCorrecto = true;
        var sEstado = "";
        var sMensaje = "";
        var sTitulo = "";
        var sReferen = "";

        $.post(llamaWS, sParams).done(function(datos) {
            try
            {
                if(datos == null)  //==> ha habido error
                {
                    mensaje("No s'ha rebut confirmació de l'enviament de la comunicació " ,'error');
                    sReferen = "-";
                    sMensaje = "Comunicació guardada en el dispositiu";
                    sTitulo = "error enviant";
                    bEnvioCorrecto = false;
                }
                else  //==> el WS ha devuelto algo
                {
                    sReferen = $(datos).find('resultado').text().trim();
                    if(sReferen.indexOf('|') > 0)
                    {
                        sMensaje = 'La seva comunicació ha estat rebuda però amb problemes : \n ' + sReferen.substr(sReferen.indexOf('|') + 1);
                        sTitulo = "atenció";
                        sReferen = sReferen.substr(0,sReferen.indexOf('|'));
                    }
                    else
                    {
                        if(sReferen.indexOf('|') == 0)
                        {
                            sMensaje = "La seva comunicació no s'ha processat correctament. [" + sReferen.substr(1) + "]\n";
                            sTitulo = "error";
                            sReferen = "ERROR";
                            bEnvioCorrecto = false;
                        }
                        else
                        {
                            sMensaje = 'Comunicació notificada [' + sReferen + ']\n' + 'Gràcies per la seva col·laboració';
                            sTitulo = "info";
                        }
                    }
                }

                if(bNuevoComunicat){
                    if(bEnvioCorrecto)
                        sEstado = "NOTIFICAT";
                    else
                        sEstado = "PENDENT_ENVIAMENT";

                    //alert ('estado '+ sEstado + ' i  sReferen ' + sReferen)
                    var nIdCom = guardaIncidencia(sReferen, sEstado);

                    if(!bEnvioCorrecto)
                    {
                        guardaFotoEnLocal(nIdCom, sFoto);
                    }

                    eliminarFoto();
                    limpiaVariables('pageNuevaIncidencia');
                    mensaje(sMensaje, sTitulo);
                    abrirPagina('pageIndex', false);
                }
                else
                {
                    if(!bEnvioCorrecto)
                        mensaje(sMensaje, sTitulo);
                }
            }
            catch(ex){
                mensaje('ERROR (exception) en resultadoEnvio : \n' + ex.code + '\n' + ex.message , 'error');
                return null;
            }
        }).fail(function() {
                if( bNuevoComunicat){
                    //alert ('fail function');
                    var nIdCom = guardaIncidencia("-","PENDENT_ENVIAMENT");
                    guardaFotoEnLocal(nIdCom, sFoto);
                    limpiaVariables('pageNuevaIncidencia');
                }
                sMensaje = "La seva comunicació no s'ha pogut enviar \n ";
                if(sReferen.trim().length > 0 ) sMensaje += sReferen.substr(1) + '\n';
                sMensaje += "Quan tingui connexió pot enviar-la des de 'Els meus comunicats'" ;
                sTitulo = "atenció";
                sReferen = "ERROR";
                mensaje(sMensaje, sTitulo);

                abrirPagina('pageIndex', false);
            });
    }
    catch(e)
    {
        mensaje('ERROR (exception) en enviarComunicat_WS : \n' + e.code + '\n' + e.message);
    }
}

function enviarComunicatPendiente_WS(sParams, bNuevoComunicat ){
    var sDev = '';
    var llamaWS = "http://80.36.225.19:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/NuevaIncidenciaBD";
    var sMensaje = "";
    var sTitulo = "";

    $.ajax({
        type: 'POST',
        url: llamaWS,
        data: sParams,
        success: function(datos) {
            var sReferen = $(datos).find('resultado').text().trim();
            if(sReferen.indexOf('|') > 0)
            {
                sMensaje = 'La seva comunicació ha estat rebuda però amb problemes : \n ' + sReferen.substr(sReferen.indexOf('|') + 1);
                sTitulo = "atenció";
                sReferen = sReferen.substr(0,sReferen.indexOf('|'));
                sDev = "ERROR";
            }
            else
            {
                if(sReferen.indexOf('|') == 0)
                {
                    sMensaje = "La seva comunicació no s'ha processat correctament. [" + sReferen.substr(1) + "]\n";
                    sTitulo = "error";
                    sReferen = "ERROR";
                    sDev = "ERROR";
                }
                else
                {
                    sMensaje = 'Comunicació notificada [' + sReferen + ']\n' + 'Gràcies per la seva col·laboració';
                    sTitulo = "info";
                    sDev = sReferen;
                }
            }
            mensaje(sMensaje, sTitulo);
        },
        error: function(error) { sDev = "ERROR"; } ,
        async:false
    });
    return sDev;
}

function guardaDatosCiudadano(){
    try
    {
        // NOM, COGNOM1, COGNOM2, DNI, EMAIL, TELEFON
        var idCiutada = 0;
        var nom='';
        var cognom1='';
        var cognom2='';
        var dni='';
        var email='';
        var telefon='';

        //recojo los datos del usuario que ya están guardados en la tabla CIUTADA
        //si todavía no existe el usuario se devuelve un objeto usuari vacio
        var objUsu = getDatosUsuario();

        //Si ha modificado algún dato lo recojo para actualizar , pero si lo ha dejado en blanco cojo lo que ya tenía en la tabla guardado
        if($('#inputNOM').val() != '')     nom =     $('#inputNOM').val();     else nom =     objUsu.NOM;
        if($('#inputCOGNOM1').val() != '') cognom1 = $('#inputCOGNOM1').val(); else cognom1 = objUsu.COGNOM1 ;
        if($('#inputCOGNOM2').val() != '') cognom2 = $('#inputCOGNOM2').val(); else cognom2 = objUsu.COGNOM2 ;
        if($('#inputDNI').val() != '')     dni =     $('#inputDNI').val();     else dni =     objUsu.DNI ;
        if($('#inputEMAIL').val() != '')   email=    $('#inputEMAIL').val();   else email =   objUsu.EMAIL ;
        if($('#inputTELEFON').val() != '') telefon = $('#inputTELEFON').val(); else telefon = objUsu.TELEFON ;

        objUsu = new usuari();
        objUsu.ID = 0;
        objUsu.NOM = nom;
        objUsu.COGNOM1 = cognom1;
        objUsu.COGNOM2 = cognom2;
        objUsu.DNI = dni;
        objUsu.EMAIL = email;
        objUsu.TELEFON = telefon;

        guardaObjetoLocal('CIUTADA' , objUsu);
    }
    catch (e)
    {
        mensaje(e.message , 'error');
    }
}
function datosObligatorios(sObs, sDir, sDni , sEmail, sTelefon){
    if(sObs == null || sObs.trim() == '') return "Les dades marcades amb (*) són obligatòries\nFalta 'observacions'" ;
    if(sDir == null || sDir.trim() == '') return "Les dades marcades amb (*) són obligatòries\nFalta 'on està passant'";

    //per la demo ho comento
  /*  if($(check_ComAnonima).is(':checked')){
        return "";
    }
    else
    {
        var sPosibleFalloMail = "";
        var sPosibleFalloTelefono = "";
        if(sDni == null || sDni.trim() == '')
        {
            return "Si la comunicació no és anònima, és obligatori el DNI/NIF i també el telèfon o l'adreça electrònica";
        }
        else
        {
            if(!esDni(sDni)) return "El DNI/NIF no és vàlid";
            if( (sEmail == null || sEmail.trim() == '') && (sTelefon == null || sTelefon.trim() == '') )
            {
                return "Si la comunicació no és anònima, és obligatori : el DNI/NIF  i també el telèfon o l'adreça electrònica";
            }
            else
            {
                if(sEmail != null && sEmail.trim() != '') if(!esEmail(sEmail)) sPosibleFalloMail = "L'adreça electrònica introduida no és correcta";
                if(sTelefon != null && sTelefon.trim() != '') if(!esTelefono(sTelefon)) sPosibleFalloTelefono = "El telèfon introduit no és correcte";

                if( (sEmail == null || sEmail.trim() == '' || sPosibleFalloTelefono != "") && sPosibleFalloTelefono != "" ) return sPosibleFalloTelefono;
                if( (sTelefon == null || sTelefon.trim() == '' || sPosibleFalloMail != "") && sPosibleFalloMail != "" ) return sPosibleFalloMail;
            }
        }
    }*/
    return "";
}
function guardaIncidencia(sReferen, sEstado){
    try
    {
        var nId = leeObjetoLocal('COMUNICATS_NEXTVAL' , -1) + 1;
        var fecha = FechaHoy() + ' ' + HoraAhora();
        var carrer = sDireccionAlta.split(",")[0];
        var num = sDireccionAlta.split(",")[1];

        //INSERT INTO COMUNICATS (ID, REFERENCIA, ESTAT, DATA, CARRER, NUM, COORD_X, COORD_Y, COMENTARI) VALUES (?,?,?,?,?,?,?,?,?);
        //var fila = [nId, sReferen, 'PENDENT', fecha,carrer , num, sCoord_X, sCoord_Y, sComentario, null, null, null];

        var objComunicat = new comunicat();
        objComunicat.ID = nId;
        objComunicat.REFERENCIA = sReferen.trim();
        objComunicat.ESTAT = sEstado;
        objComunicat.DATA = fecha;
        objComunicat.CARRER = carrer;
        objComunicat.NUM = num;
        objComunicat.COORD_X = sCoord_X + '';
        objComunicat.COORD_Y = sCoord_Y + '';
        objComunicat.COMENTARI = sComentario;
        objComunicat.ID_MSG_MOV = sReferen.trim();
        guardaObjetoLocal('COMUNICAT_' + nId.toString().trim() , objComunicat);

        guardaObjetoLocal('COMUNICATS_NEXTVAL', nId);

        return nId;
    }
    catch(e)
    {
        mensaje('ERROR (exception) en guardaIncidencia : \n' + e.code + '\n' + e.message);
        return -1;
    }
}


