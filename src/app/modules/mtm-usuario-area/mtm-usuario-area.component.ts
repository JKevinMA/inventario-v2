import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { Almacen } from 'src/app/models/almacen.model';
import { Area } from 'src/app/models/area.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Local } from 'src/app/models/local.model';
import { UsuarioArea } from 'src/app/models/usuario-area.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtm-usuario-area',
  templateUrl: './mtm-usuario-area.component.html',
  styleUrls: ['./mtm-usuario-area.component.css']
})
export class MtmUsuarioAreaComponent implements OnInit,OnDestroy {

  usuariosArea:UsuarioArea[] =[];
  usuarioArea:UsuarioArea= new UsuarioArea();
  deleteId:number=0;
  editUsuarioArea= new UsuarioArea();
  
  usuarios:UsuarioModel[]=[];
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
      this.api.obtenerUsuariosAreaMTM(),
      this.api.obtenerEmpresas(),
    ]).subscribe(([res1,res2])=>{
      if(res1.success){
        this.usuariosArea = res1.response!;
        this.dtTrigger.next();
      }
      if(res2.success){
        this.empresas = res2.response!;
      }
      this.stopLoading();
    })
  }

  submit(formulario:NgForm){
    if(formulario.invalid)  return;
   
    
    this.guardar();
    
  }

  editar(o:UsuarioArea){
    this.creando=false;
    this.usuarioArea = {...o};

    this.traerLocales();
    this.traerAlmacenes();
    this.traerAreas();
    this.traerUsuarios();
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
        this.usuarioArea.empresaId = +this.usuarioArea.empresaId; 
        this.usuarioArea.localId = +this.usuarioArea.localId; 
        this.usuarioArea.almacenId = +this.usuarioArea.almacenId; 
        this.usuarioArea.areaId = +this.usuarioArea.areaId; 
        this.usuarioArea.usuarioId = +this.usuarioArea.usuarioId; 
        
        console.log(this.usuarioArea);
        var solicitud = this.api.crearUsuarioArea(this.usuarioArea);

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
    this.usuarioArea = new UsuarioArea();
    this.usuarioArea.empresaId = 0;
    this.usuarioArea.localId = 0;
    this.usuarioArea.almacenId = 0;
    this.usuarioArea.areaId = 0;
    this.usuarioArea.usuarioId = 0;
  }

  eliminar(usuarioId:number,areaId:number){
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
        
        this.api.eliminarUsuarioArea(usuarioId,areaId).subscribe(r => {
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
    this.traerUsuarios();
    this.usuarioArea.localId = 0;
    this.usuarioArea.almacenId = 0;
    this.usuarioArea.areaId = 0;
  }

  seleccionaLocal(){
    this.traerAlmacenes();
    this.usuarioArea.almacenId = 0;
    this.usuarioArea.areaId = 0;
  }

  seleccionaAlmacen(){
    this.traerAreas();
    this.usuarioArea.areaId = 0;
  }

  traerLocales(){
    this.isLoading();
    this.api.obtenerLocales(this.usuarioArea.empresaId).subscribe(r=>{
      if(r.success){
        this.locales = r.response!;
      }
      this.stopLoading();
    });
  }
  traerUsuarios(){
    this.isLoading();
    this.api.obtenerUsuariosEmpresa(this.usuarioArea.empresaId).subscribe(r=>{
      if(r.success){
        this.usuarios = r.response!;
      }
      console.log("usuarios",r);
      this.stopLoading();
    });
  }

  traerAlmacenes(){
    this.isLoading();
    this.api.obtenerAlmacenes(this.usuarioArea.localId).subscribe(r=>{
      if(r.success){
        this.almacenes = r.response!;
      }
      this.stopLoading();
    });
  }

  traerAreas(){
    this.isLoading();
    this.api.obtenerAreas(this.usuarioArea.almacenId).subscribe(r=>{
      if(r.success){
        this.areas = r.response!;
      }
      this.stopLoading();
    });
  }
}
