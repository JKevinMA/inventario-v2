import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { Almacen } from 'src/app/models/almacen.model';
import { Area } from 'src/app/models/area.model';
import { ArticuloTipoInventario } from 'src/app/models/articulo-tipo-inventario.model';
import { Articulo } from 'src/app/models/articulo.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Local } from 'src/app/models/local.model';
import { TipoInventario } from 'src/app/models/tipo-inventario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtm-articulo-tipo-inventario',
  templateUrl: './mtm-articulo-tipo-inventario.component.html',
  styleUrls: ['./mtm-articulo-tipo-inventario.component.css']
})
export class MtmArticuloTipoInventarioComponent implements OnInit,OnDestroy {

  articulosTipoInventario:ArticuloTipoInventario[] =[];
  articuloTipoInventario:ArticuloTipoInventario= new ArticuloTipoInventario();
  deleteId:number=0;
  editArea= new ArticuloTipoInventario();
  articulos:Articulo[]=[];
  tiposInventario:TipoInventario[]=[];
  empresas:Empresa[] =[];
  locales:Local[] = [];
  almacenes:Almacen[] = [];
  areas:Area[] = [];
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creando=true;
  noValido=true;

  constructor(private api:ApiService) {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
 ngOnInit(): void {
    this.reiniciar();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.obtener();
  }

  isLoading(){
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }
  stopLoading(){
    Swal.close();
  }

  obtener(){
    this.isLoading();
    combineLatest([
      this.api.obtenerArticulosTipoInventarioMTM(),
      this.api.obtenerEmpresas(),
      this.api.obtenerTiposInventarioMTM(),
    ]).subscribe(([res1,res2,res3])=>{
      if(res1.success){
        this.articulosTipoInventario = res1.response!;
        this.dtTrigger.next();
      }
      if(res2.success){
        this.empresas = res2.response!;
      }
      if(res3.success){
        this.tiposInventario = res3.response!;
      }
      this.stopLoading();
    })
  }

  submit(formulario:NgForm){
    if(formulario.invalid)  return;
   
    
    this.guardar();
    
  }

  editar(o:ArticuloTipoInventario){
    this.creando=false;
    this.articuloTipoInventario = {...o};

    this.traerLocales();
    this.traerAlmacenes();
    this.traerAreas();
    this.traerArticulos();
  }

  guardar(){
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de guardar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Guardar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Guardando registro',
          text: 'Cargando...',
        });

        Swal.showLoading();
        this.articuloTipoInventario.empresaId = +this.articuloTipoInventario.empresaId; 
        this.articuloTipoInventario.localId = +this.articuloTipoInventario.localId; 
        this.articuloTipoInventario.almacenId = +this.articuloTipoInventario.almacenId; 
        this.articuloTipoInventario.areaId = +this.articuloTipoInventario.areaId; 
        this.articuloTipoInventario.tipoInventarioId = +this.articuloTipoInventario.tipoInventarioId; 
        this.articuloTipoInventario.articuloId = +this.articuloTipoInventario.articuloId; 
        
        console.log(this.articuloTipoInventario);
        var solicitud = this.creando?this.api.crearArticuloTipoInventario(this.articuloTipoInventario):this.api.actualizarArticuloTipoInventario(this.articuloTipoInventario);

        solicitud.subscribe(r => {
          if (r.success) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Éxito',
              text: 'Se ha guardado correctamente!',
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
          console.log(err);
        
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

  cerrarModal(){
    this.reiniciar();
  }
  reiniciar(){
    this.articuloTipoInventario = new ArticuloTipoInventario();
    this.articuloTipoInventario.empresaId = 0;
    this.articuloTipoInventario.localId = 0;
    this.articuloTipoInventario.almacenId = 0;
    this.articuloTipoInventario.tipoInventarioId = 0;
    this.articuloTipoInventario.areaId = 0;
    this.articuloTipoInventario.articuloId = 0;
  }

  eliminar(articuloId:number,tipoInventarioId:number,areaId:number){
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de eliminar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Eliminando registro',
          text: 'Cargando...',
        });

        Swal.showLoading();
        
        this.api.eliminarArticuloTipoInventario(articuloId,tipoInventarioId,areaId).subscribe(r => {
          if (r.success) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Éxito',
              text: 'Se ha eliminado correctamente!',
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
          console.log(err);
        
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

  seleccionaEmpresa(){
    this.traerLocales();
    this.traerArticulos();
    this.articuloTipoInventario.localId = 0;
    this.articuloTipoInventario.almacenId = 0;
    this.articuloTipoInventario.areaId = 0;
  }

  seleccionaLocal(){
    this.traerAlmacenes();
    this.articuloTipoInventario.almacenId = 0;
    this.articuloTipoInventario.areaId = 0;
  }

  seleccionaAlmacen(){
    this.traerAreas();
    this.articuloTipoInventario.areaId = 0;
  }

  traerLocales(){
    this.isLoading();
    this.api.obtenerLocales(this.articuloTipoInventario.empresaId).subscribe(r=>{
      if(r.success){
        this.locales = r.response!;
      }
      this.stopLoading();
    });
  }
  traerArticulos(){
    this.isLoading();
    this.api.obtenerArticulosEmpresa(this.articuloTipoInventario.empresaId).subscribe(r=>{
      if(r.success){
        this.articulos = r.response!;
      }
      this.stopLoading();
    });
  }

  traerAlmacenes(){
    this.isLoading();
    this.api.obtenerAlmacenes(this.articuloTipoInventario.localId).subscribe(r=>{
      if(r.success){
        this.almacenes = r.response!;
      }
      this.stopLoading();
    });
  }

  traerAreas(){
    this.isLoading();
    this.api.obtenerAreas(this.articuloTipoInventario.almacenId).subscribe(r=>{
      if(r.success){
        this.areas = r.response!;
      }
      this.stopLoading();
    });
  }
}
