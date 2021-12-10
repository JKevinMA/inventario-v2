export class InventarioCabecera{
    inventarioId!:number;
    fechaInicio!:Date;
    fechaFin!:Date;
    estado!:string;
    archivoStock!:string;
    usuarioId!:number;
    tipoInventarioId!:number;
    areaId!:number;

    detalles!:InventarioDetalle[];

    //aux
    tipoInventario!:string;
    almacen!:string;
    area!:string;
    iniciado!:boolean;
    cerrado!:boolean;
}

export class InventarioDetalle{
    inventarioId!:number;
    articuloId!:number;
    stockTeorico!:number;
    precioPromedio!:number;
    cantidad!:number;
    valor!:number;
    cantidadValidado!:number;
    valorValidado!:number;
    usuarioIdValidado!:number;
    diferencia!:number;
    diferenciaValor!:number;
    validado!:boolean;
    finalizado!:boolean;

    articulo!:string;
    codigo!:string;
    absValDif!:number;
    faltante!:number;
}