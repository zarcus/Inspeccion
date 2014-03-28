var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sFoto = '';
var sCoord_X = '';
var sCoord_Y = '';
var sComentario = '';

// -------- INICIALIZAR PÁGINA -----------------------------------------------------------
function inicioPaginaSelRecorregut(){

    if($("#selectRec option").length < 1)
    {
        cargaComboDesdeArray($('#selectRec'), "Recorreguts ", cargaTablaEnArray("recorreguts", "recorregut"));
    }

}



