import { Articulo } from "./articulo.model";

export class Area{
    areaId!:number;
    descripcion!:string;
    almacenId!:number;


    articulos!:Articulo[];
    archivo:string='-';
    selected!:boolean;

    almacen!:string;
    local!:string;
    localId!:number;
    empresa!:string;
    empresaId!:number;
}