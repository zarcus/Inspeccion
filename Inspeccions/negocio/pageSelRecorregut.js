var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sFoto = '';
var sCoord_X = '';
var sCoord_Y = '';
var sComentario = '';

// -------- INICIALIZAR PÁGINA -----------------------------------------------------------
function inicioPaginaSelRecorregut(){
    //Cargar combo de NIVELES 1
    if($("#selectRec option").length < 1)
    {
        cargaComboDesdeArray($('#selectRec'), "seleccioni recorregut", cargaTablaEnArray("recorreguts", "recorregut"));
    }

}



