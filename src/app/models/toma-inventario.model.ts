export class TomaInventarioCabecera {
    tomaInventarioId!: number;
    cerrado!:boolean;
    usuarioId!:number;
    inventarioId!:number;
    fechaInicio!:Date;
    fechaFin!:Date;
    detalles!:TomaInventarioDetalle[];
    
    //aux
    usuario!:string;
    nombre!:string;
    total!:number;
}
export class TomaInventarioDetalle {
    tomaInventarioId!: number;
    cantidad!:         number;
    blanco!:           boolean;
    articuloId!:       number;
    articulo!:         string;
    categoria!:        string;
    familia!:          string;
    categoriaId!:      number;
    familiaId!:        number;
    orden!:            number;
    localizacion!:     string;
    codigo!:string;
    unidadMedida!:string;

    error!:boolean;
}

export class ValidarInicioInventario{
    total!:number;
    cerrado!:boolean;
}
