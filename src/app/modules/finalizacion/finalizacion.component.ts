import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { InventarioCabecera, InventarioDetalle } from 'src/app/models/inventario.model';
import { TomaInventarioCabecera, TomaInventarioDetalle } from 'src/app/models/toma-inventario.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-finalizacion',
  templateUrl: './finalizacion.component.html',
  styleUrls: ['./finalizacion.component.css']
})
export class FinalizacionComponent implements OnInit,OnDestroy {

  paso_1 = true;
  paso_2 = false;
  validando = false;

  user!: UsuarioModel;
  inventariosAbiertos: InventarioCabecera[] = [];
  inventariosCerrados: InventarioCabecera[] = [];
  inventarioSeleccionado = new InventarioCabecera();

  tomasInventarioUsuario: TomaInventarioCabecera[] = [];
  tomaInventarioDetalle: TomaInventarioDetalle[] = [];

  inventarioDetalle: InventarioDetalle[] = [];
  valorTeorico:number=0;
  valorFisico:number=0;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  esResumen=false;

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  constructor(private api: ApiService) { }
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }
  stopLoading() {
    Swal.close();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.obtenerUsuario();
    this.obtenerInventarios();
  }

  obtenerInventarios() {
    this.isLoading();
    combineLatest([
      this.api.obtenerInventariosAbiertos(this.user.usuarioId,'APERTURADO'),
      this.api.obtenerInventariosAbiertos(this.user.usuarioId,'FINALIZADO')
    ]).subscribe(([res,res2])=>{
      console.log(res);
      console.log(res2);
      if (res.success) {
        this.inventariosAbiertos = res.response!;
      }
      if (res2.success) {
        this.inventariosCerrados = res2.response!;
        this.dtTrigger.next();
      }
      this.stopLoading();
    });
  }

  obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }

  forzarYObtenerTomasUsuarios(ia: InventarioCabecera) {
    this.esResumen =false;
    Swal.fire({
      title: 'Confirmación',
      text: 'Forzar el cierre de toma a los usuarios inventariadores?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Forzar Cierre`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Cerrando inventario',
          text: 'Cargando...',
        });

        Swal.showLoading();

        this.inventarioSeleccionado = ia;
        this.api.cerrarYObtenerTomasInventarioUsuarios(this.inventarioSeleccionado.inventarioId).subscribe(r => {
          if (r.success) {
            this.tomasInventarioUsuario = r.response!;
            this.paso_2 = true;
            this.paso_1 = false;
          }
          this.stopLoading();
          this.obtenerDataValidacion(this.inventarioSeleccionado);
          /* if (this.inventarioSeleccionado.archivoStock != "-") {
            this.obtenerDataValidacion(this.inventarioSeleccionado);
          } */
        }, err => {
          if (err.name == "HttpErrorResponse") {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al conectar',
              text: 'Error de comunicación con el servidor',
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.name,
            text: err.message,
          });
        });
      } else if (result.isDenied) {
        this.paso_1=true;
        this.paso_2=false;
      }
    });

  }

  verResumen(ia: InventarioCabecera){
    this.esResumen =true;
    this.isLoading();
    this.paso_1 = false;
    this.paso_2 = true;
    this.inventarioSeleccionado = ia;
        this.api.cerrarYObtenerTomasInventarioUsuarios(this.inventarioSeleccionado.inventarioId).subscribe(r => {
          if (r.success) {
            this.tomasInventarioUsuario = r.response!;
            this.paso_2 = true;
            this.paso_1 = false;
          }
          this.stopLoading();
          this.obtenerDataValidacion(this.inventarioSeleccionado);
          /* if (this.inventarioSeleccionado.archivoStock != "-") {
          } */
        });
  }

  obtenerTomaDetalle(tomaInventarioId: number) {
    this.tomaInventarioDetalle = [];
    this.isLoading();
    this.api.obtenerTomaInventarioUsuario(tomaInventarioId).subscribe(r => {
      if (r.success) {
        this.tomaInventarioDetalle = r.response!;
      }
      this.stopLoading();
    });
  }

  obtenerDataValidacion(ia: InventarioCabecera) {
    this.isLoading();
    this.api.obtenerInventarioDetalle(ia.inventarioId).subscribe(r => {
      if (r.success) {
        this.inventarioDetalle = r.response!;
        this.valorTeorico=0;
        this.inventarioDetalle.forEach(invd => {
          if(!this.esResumen){
            invd.cantidadValidado = invd.cantidad;
          }
          invd.diferencia = invd.stockTeorico - invd.cantidadValidado;
          invd.usuarioIdValidado = this.user.usuarioId;
          this.valorTeorico+=(invd.stockTeorico*invd.precioPromedio);
          this.valorFisico+=(invd.cantidad*invd.precioPromedio);
        });
        this.items = [...this.inventarioDetalle];
        this.paginado();
      } else {
        Swal.fire({
          title: 'Error',
          text: r.message,
          icon: 'error'
        });
      }
      this.stopLoading();
    }, err => {
      if (err.name == "HttpErrorResponse") {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Error al conectar',
          text: 'Error de comunicación con el servidor',
        });
        return;
      }
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: err.name,
        text: err.message,
      });
    });
  }

  cambiaValorValidacion(id: InventarioDetalle) {
    id.validado = true;
    id.diferencia = id.stockTeorico - id.cantidadValidado;
  }

  finalizar() {
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de finalizar el inventario seleccionado?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Finalizar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Finalizando inventario',
          text: 'Cargando...',
        });

        Swal.showLoading();

        this.api.finalizarInventario(this.inventarioSeleccionado.inventarioId).subscribe(r => {
          if (r.success) {
            
              this.validar();
              Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Éxito',
                text: 'Se ha finalizado el inventario correctamente!',
              }).then((result) => {
                window.location.reload();
              });
          } else {
            Swal.fire({
              title: 'Error',
              text: r.message,
              icon: 'error'
            });
          }
        }, err => {
          if (err.name == "HttpErrorResponse") {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al conectar',
              text: 'Error de comunicación con el servidor',
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.name,
            text: err.message,
          });
        });
      } else if (result.isDenied) {

      }
    });
  }
  validar() {
    this.api.validarCantidades(this.items).subscribe(id => {
      if (id.success) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Éxito',
          text: 'Se ha finalizado el inventario correctamente!',
        }).then((result) => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Error',
          text: id.message,
        });
      }
    }, err => {
      if (err.name == "HttpErrorResponse") {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Error al conectar',
          text: 'Error de comunicación con el servidor',
        });
        return;
      }
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: err.name,
        text: err.message,
      });
    });
  }
  exportar(tid:TomaInventarioDetalle[]){
    var json: any[] = [];
    tid.forEach(d=>{
      json.push(
        {
          "Toma de Inventario ID":d.tomaInventarioId,
          "Código Artículo":d.codigo,
          "Nombre Artículo":d.articulo,
          "En blanco?":d.blanco?'Sí':'No',
          "Unidad de Medida":d.unidadMedida,
          "Cantidad Tomada":d.cantidad,
        }
      )
    })
    let hoy:Date = new Date();
    var anio = hoy.getFullYear().toString();
    var mes = (hoy.getMonth()+1).toString();
    var dia = hoy.getDate().toString();
    var hora = hoy.getHours().toString();
    var min = hoy.getMinutes().toString();
    var sec = hoy.getSeconds().toString();
    var fileName= `DetalleToma${anio}${mes}${dia}${hora}${min}${sec}.xlsx`;
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  deseleccionarInventario(){
    this.paso_1=true;
    this.paso_2=false;
    this.inventarioSeleccionado= new InventarioCabecera();
    this.inventarioSeleccionado.archivoStock = null;
    this.tomasInventarioUsuario = [];
    this.tomaInventarioDetalle = [];
    this.inventarioDetalle = [];
    this.items=[];
    
    this.numItemsPerPage = 5;
    this.numPages = 1;
    this.pages = [1];
    this.currentPage=1;
    this.textoBusqueda="";
    this.numeroResultados = 0;
  }

  //DATATABLE CONSOLIDACION - VALIDACION
  cabeceras=[{id:"codigo",ordenar:0,nombre:"Codigo"},{id:"articulo",ordenar:0,nombre:"Articulo"},{id:"stockTeorico",ordenar:0,nombre:"Stock Teorico"},{id:"cantidad",ordenar:0,nombre:"Stock Fisico"},{id:"faltante",ordenar:0,nombre:"Faltante"},{id:"absValDif",ordenar:0,nombre:"Diferencia Valor"},{id:"cantidadValidado",ordenar:0,nombre: this.esResumen?"Cantidad Validada":"Validar"},{id:"diferencia",ordenar:0,nombre:"Faltante Final"},{id:"unidadMedida",ordenar:0,nombre:"Unidad"}];

  ingresaBusqueda(x:any){
    this.textoBusqueda = x.target.value;
    this.buscar(x.target.value);
  }


  buscar(busqueda:any){
    if(busqueda!=""){
      this.items = [...this.inventarioDetalle];
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
      this.items = [...this.inventarioDetalle];
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
    this.numItemsPerPage = + this.numItemsPerPage;
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
        this.items =  [...this.inventarioDetalle];
        
      this.generarItemsPorPagina();
        return;
      }
    }
    
  }

  items:any[] =[];
  itemsPaginado : any[] = [];
  numItemsPerPage = 5;
  numPages = 1;
  pages = [1];
  currentPage=1;
  textoBusqueda="";
  numeroResultados = 0;
}
