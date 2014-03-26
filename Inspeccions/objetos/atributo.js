var objAtributo = new Object();

objAtributo.ID = '';
objAtributo.DESC = '';
objAtributo.TIPO = '';
objAtributo.OBL = '';
objAtributo.DEF = '';
objAtributo.AVALORES = null;

function Atributo(){
    function ObjetoVacio() {
        return objAtributo;
    }

    function ObjetoValores(id,desc,tipo,obl,def,avalores) {
        if(indefinidoOnullToVacio(id) == '') return null;

        this.ID = id;
        this.DESC = indefinidoOnullToVacio(des);
        this.tipo = indefinidoOnullToVacio(tipo);
        this.OBL = indefinidoOnullToVacio(obl);
        this.def = indefinidoOnullToVacio(def);
        this.avalores = indefinidoOnullToVacio(avalores);
        return this;
    }

    function ObjetoArray(aDatos) {
        if( indefinidoOnullToVacio(aDatos) == '') return objAtributo;

        try {
            this.ID = aDatos['id'] + '';
            this.DESC = aDatos['desc'] + '';
            this.TIPO = aDatos['tipo'] + '';
            this.OBL = aDatos['obl'] + '';
            this.DEF  = aDatos['def'] + '';
            this.AVALORES  = aDatos['aValores'];
            return this;
        } catch (e) { alert('creant objecte : atribut  ERROR : ' + e.message); return null; }
    }

    var sArgumentos = indefinidoOnullToVacio(arguments);
    switch (sArgumentos) {
        case '' :
            ObjetoVacio();
            break;
        default :
            if(arguments.length == 6)
                ObjetoValores(arguments[0], arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
            else
                ObjetoArray(arguments[0]);
            break;
    }
}

