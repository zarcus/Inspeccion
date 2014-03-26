function guardaObjetoLocal(key , value) {
    $.jStorage.set(key, value);
}

function leeObjetoLocal(key , defecto) {
    return $.jStorage.get(key , defecto);
}

function borraObjetoLocal(key){
    return $.jStorage.deleteKey(key);
}

