export class InventarioCabecera{
    inventarioId!:number;
    fechaCreacion!:Date;
    fechaFin!:Date;
    estado!:string;
    archivoStock!:string | null;
    usuarioId!:number;
    tipoInventarioId!:number;
    areaId!:number;
    fechaInicio!:Date;
    fechaVisualizacion!:Date;

    detalles!:InventarioDetalle[];

    //aux
    tipoInventario!:string;
    almacen!:string;
    area!:string;
    iniciado!:boolean;
    cerrado!:boolean;

    getFechaInicio(){
        return new Date(this.fechaInicio);
    }
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


