import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { Almacen } from 'src/app/models/almacen.model';
import { Area } from 'src/app/models/area.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Local } from 'src/app/models/local.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtm-area',
  templateUrl: './mtm-area.component.html',
  styleUrls: ['./mtm-area.component.css']
})
export class MtmAreaComponent implements OnInit,OnDestroy {

  areas:Area[] =[];
  area:Area= new Area();
  deleteId:number=0;
  editArea= new Area();
  empresas:Empresa[] =[];
  locales:Local[] = [];
  almacenes:Almacen[] = [];
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creando=true;
  noValido=true;

  constructor(private api:ApiService) {
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  obtener(){
    this.isLoading();
    combineLatest([
      this.api.obtenerAreasMTM(),
      this.api.obtenerEmpresas()
    ]).subscribe(([res1,res2])=>{
      if(res1.success){
        this.areas = res1.response!;
        this.dtTrigger.next();
      }
      if(res2.success){
        this.empresas = res2.response!;
      }
      this.stopLoading();
    })
  }


  ngOnInit(): void {
    this.reiniciar();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.obtener();
  }

  submit(formulario:NgForm){
    if(formulario.invalid)  return;
   
    
    this.guardar();
    
  }

  editar(o:Area){
    this.creando=false;
    this.area = {...o};

    this.traerLocales();
    this.traerAlmacenes();
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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Guardando registro',
          text: 'Cargando...',
        });

        Swal.showLoading();
        this.area.empresaId = +this.area.empresaId; 
        this.area.localId = +this.area.localId; 
        this.area.almacenId = +this.area.almacenId; 
        
        console.log(this.area);
        var solicitud = this.creando?this.api.crearArea(this.area):this.api.actualizarArea(this.area);

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
    this.area = new Area();
    this.area.empresaId = 0;
    this.area.localId = 0;
    this.area.almacenId = 0;
  }

  eliminar(id:number){
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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Eliminando registro',
          text: 'Cargando...',
        });

        Swal.showLoading();
        
        this.api.eliminarArea(id).subscribe(r => {
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
    this.area.localId = 0;
    this.area.almacenId = 0;
  }

  seleccionaLocal(){
    this.traerAlmacenes();
    this.area.almacenId = 0;
  }

  traerLocales(){
    this.isLoading();
    this.api.obtenerLocales(this.area.empresaId).subscribe(r=>{
      if(r.success){
        this.locales = r.response!;
      }
      this.stopLoading();
    });
  }

  traerAlmacenes(){
    this.isLoading();
    this.api.obtenerAlmacenes(this.area.localId).subscribe(r=>{
      if(r.success){
        this.almacenes = r.response!;
      }
      this.stopLoading();
    });
  }
}
