import { Articulo } from "./articulo.model";

export class Area{
    areaId!:number;
    descripcion!:string;
    almacenId!:number;
    habilitado:boolean=false;

    articulos!:Articulo[];
    archivo:string='-';
    selected!:boolean;

    almacen!:string;
    local!:string;
    localId!:number;
    empresa!:string;
    empresaId!:number;
}