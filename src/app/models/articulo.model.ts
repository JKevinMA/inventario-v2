export class Articulo{
    articuloId!:number;
    codigo!:string;
    descripcion!:string;
    barcode:string="";
    empresaId!:number;
    categoriaId!:number;
    familiaId!:number;
    unidadMedidaId!:number;

    //aux
    stockTeorico!:number;
    precioPromedio!:number;

    empresa!:string;
    familia!:string;
    categoria!:string;
    unidadMedida!:string;
}