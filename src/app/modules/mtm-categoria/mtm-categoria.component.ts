import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { Categoria } from 'src/app/models/categoria.model';
import { Empresa } from 'src/app/models/empresa.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtm-categoria',
  templateUrl: './mtm-categoria.component.html',
  styleUrls: ['./mtm-categoria.component.css']
})
export class MtmCategoriaComponent implements OnInit ,OnDestroy {
  user!: UsuarioModel;
  
  categorias:Categoria[] =[];
  categoria:Categoria= new Categoria();
  deleteId:number=0;
  editCategoria= new Categoria();
  empresas:Empresa[] =[];
  
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
  obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }
  obtener(){
    this.isLoading();
    combineLatest([
      this.api.obtenerCategorias(this.user.su),
      this.api.obtenerEmpresas(this.user.su)
    ]).subscribe(([res1,res2])=>{
      if(res1.success){
        this.categorias = res1.response!;
        console.log(this.categorias);
        this.dtTrigger.next();
      }
      if(res2.success){
        this.empresas = res2.response!;
      }
      this.stopLoading();
    })
  }


  ngOnInit(): void {
    this.obtenerUsuario();
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

  editar(o:Categoria){
    this.creando=false;
    this.categoria = {...o};
    console.log(this.categoria);
  }

  guardar(){
    Swal.fire({
      title: 'Confirmaci??n',
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
        this.categoria.empresaId = +this.categoria.empresaId; 
        
        var solicitud = this.creando?this.api.crearCategoria(this.categoria):this.api.actualizarCategoria(this.categoria);

        solicitud.subscribe(r => {
          if (r.success) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: '??xito',
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
              text: 'Error de comunicaci??n con el servidor',
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
    this.categoria = new Categoria();
    this.categoria.empresaId = 0;
  }

  eliminar(id:number){
    Swal.fire({
      title: 'Confirmaci??n',
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
        
        this.api.eliminarCategoria(id).subscribe(r => {
          if (r.success) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: '??xito',
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
              text: flag==0?r.message:'No se puede eliminar el item porque est?? siendo usado en otros registros.',
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
              text: 'Error de comunicaci??n con el servidor',
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
