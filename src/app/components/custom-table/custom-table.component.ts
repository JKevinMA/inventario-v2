import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit,OnChanges {

  items: any[]=[];
  /* cabeceras:any[] = [{id:"col1",nombre:"Columna 1",ordenar:0,moneda:false},{id:"col2",nombre:"Columna 2",ordenar:0,moneda:false},{id:"col3",nombre:"Columna 3",ordenar:0,moneda:false},{id:"col4",nombre:"Columna 4",ordenar:null,moneda:false}];
  itemsOriginales : any[] = 
  [
    {col1:"auon",col2:"asdd",col3:1,col4:"item 1 - 4 "},
    {col1:"ddaga",col2:"gdada",col3:3,col4:"item 2 - 4 "},
    {col1:"item",col2:"hsd",col3:5,col4:"item 3 - 4 "},
    {col1:"asda",col2:"rg",col3:1,col4:"item 4 - 4 "},
    {col1:"gass",col2:"adgad",col3:7,col4:"item 5 - 4 "},
    {col1:"assf",col2:"yjrtb",col3:9,col4:"item 6 - 4 "},
    {col1:"hf",col2:"df",col3:2,col4:"item 7 - 4 "},
    {col1:"sdf",col2:"sa",col3:9,col4:"item 8 - 4 "},
    {col1:"hxx",col2:"jt",col3:0,col4:"item 9 - 4 "},
    {col1:"fssa",col2:"asf",col3:12,col4:"item 10 - 4 "},
    {col1:"jmh",col2:"sdf",col3:1,col4:"item 11 - 4 "},
    {col1:"iy",col2:"fs",col3:14,col4:"item 12 - 4 "},
    {col1:"tere",col2:"wq",col3:4,col4:"item 13 - 4 "},
    {col1:"er",col2:"gsd",col3:6,col4:"item 14 - 4 "},
    {col1:"ddf",col2:"hss",col3:1,col4:"item 15 - 4 "},
    {col1:"kdf",col2:"ly",col3:5,col4:"item 16 - 4 "},
  ]; */
  
  itemsPaginado : any[] = [];
  numItemsPerPage = 5;
  numPages = 1;
  pages = [1];
  currentPage=1;
  textoBusqueda="";
  numeroResultados = 0;

  @Input("cabeceras") cabeceras:any[]=[];  
  @Input("items") itemsOriginales:any[]=[];  
  constructor() {
    this.items = [...this.itemsOriginales];
    this.paginado();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.items = [...this.itemsOriginales];
    this.paginado();
  }

  ngOnInit(): void {
  }

  

  ingresaBusqueda(x:any){
    this.textoBusqueda = x.target.value;
    this.buscar(x.target.value);
  }

  buscar(busqueda:any){
    if(busqueda!=""){
      this.items = [...this.itemsOriginales];
      var cabs = this.cabeceras;
      this.items = this.items.filter(function(item){
        for (let i = 0; i < cabs.length; i++) {
          if(String(item[cabs[i].id]).toLowerCase().includes(busqueda.toLowerCase())){
            return true;
          }
        }
        return false;
      });
    }else{
      this.items = [...this.itemsOriginales];
    }
    this.paginado();
  }
  
  calcularPaginas(){
    var div =  this.items.length / this.numItemsPerPage; 
    var trunc = Math.trunc(div);
    this.numPages = div>trunc?(trunc+1):trunc;
    this.pages = [];
    for (let i = 0; i < this.numPages; i++) {
      this.pages.push(i+1);
    }
  }

  cambiaItemsPorPagina(){
    this.numItemsPerPage = +this.numItemsPerPage;
    this.paginado();
  }

  paginado(){
    this.calcularPaginas();
    this.generarItemsPorPagina();
    this.currentPage=1;
  }

  generarItemsPorPagina(){
    this.itemsPaginado = [];
    var posIni = 0;
    var posFin = this.numItemsPerPage;
    for (let i = 0; i < this.numPages; i++) {
      this.itemsPaginado.push(this.items.slice(posIni,posFin));
      posIni += this.numItemsPerPage;
      posFin += this.numItemsPerPage;
    }
  }

  ordenar(cab:any){
    if(cab.ordenar != null){
      if(cab.ordenar == 0) {
        this.cabeceras.map((cab)=>cab.ordenar=0);
        cab.ordenar=1; //ascendente
        this.items.sort(function (a, b) {
          if (a[cab.id] > b[cab.id]) {
            return 1;
          }
          if (a[cab.id] < b[cab.id]) {
            return -1;
          }
          return 0;
        });
        
      this.generarItemsPorPagina();
        return;
      } 
      if(cab.ordenar == 1) {//descendente
        this.cabeceras.map((cab)=>cab.ordenar=0);
        cab.ordenar=2;
        this.items.sort(function (a, b) {
          if (a[cab.id] < b[cab.id]) {
            return 1;
          }
          if (a[cab.id] > b[cab.id]) {
            return -1;
          }
          return 0;
        });
        
      this.generarItemsPorPagina();
        return;
      }
      if(cab.ordenar == 2) {
        cab.ordenar=0 //ninguno
        this.items =  [...this.itemsOriginales];
        
      this.generarItemsPorPagina();
        return;
      }
    }
    
  }
  
}
