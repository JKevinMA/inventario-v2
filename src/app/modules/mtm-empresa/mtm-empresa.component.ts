import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { Empresa } from 'src/app/models/empresa.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtm-empresa',
  templateUrl: './mtm-empresa.component.html',
  styleUrls: ['./mtm-empresa.component.css']
})
export class MtmEmpresaComponent implements OnInit,OnDestroy {
  user!: UsuarioModel;
  empresas:Empresa[] =[];
  empresa:Empresa= new Empresa();
  deleteId:number=0;
  editEmpresa= new Empresa();
  
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
    this.api.obtenerEmpresas(this.user.su).subscribe(r=>{
      this.empresas = r.response!;
      this.dtTrigger.next();
      this.stopLoading();
    });
  }
  obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.obtener();
  }

  submit(formulario:NgForm){
    if(formulario.invalid)  return;
    console.log(this.empresa);
    
    this.guardar();
    
  }

  editar(o:Empresa){
    this.creando=false;
    this.empresa = {...o};
    

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

        this.empresa.su = this.user.su;
        
        console.log(this.empresa);
        var solicitud = this.creando?this.api.crearEmpresa(this.empresa):this.api.actualizarEmpresa(this.empresa);

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
    this.empresa = new Empresa();
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
        
        this.api.eliminarEmpresa(id).subscribe(r => {
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
            var message:string;
            var flag:number;
            message = r.message!;
            flag = message.search('REFERENCE constraint');
            Swal.fire({
              title: 'Error',
              text: flag==0?r.message:'No se puede eliminar el item porque está siendo usado en otros registros.',
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
  
}
