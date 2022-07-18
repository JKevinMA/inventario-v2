export class MovimientoCabecera{
    movimientoId?:number;
    fecha?:Date;
    tipoMovimiento?:number;
    areaId?:number;
    detalles?:MovimientoDetalle[];
    estado?:string;
}
export class MovimientoDetalle{
    movimientoId?:number;
    articuloId?:number;
    articulo?:string
    codigo?:string
    unidadMedida?:string
    cantidad?:number;
    precioUnitario?:number;
}