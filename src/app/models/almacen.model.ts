import { Area } from "./area.model";

export class Almacen{
    almacenId!:number;
    descripcion!:string;
    localId!:number;

    areas!:Area[];
    selected!:boolean;

    local!:string;
    empresaId!:number;
    empresa!:string;
}