import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { InventarioCabecera, InventarioDetalle } from 'src/app/models/inventario.model';
import { TomaInventarioCabecera, TomaInventarioDetalle } from 'src/app/models/toma-inventario.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

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
    this.paso_1 = false;
    this.paso_2 = true;
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
          if (this.inventarioSeleccionado.archivoStock != "-") {
            this.obtenerDataValidacion(this.inventarioSeleccionado);
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
          if (this.inventarioSeleccionado.archivoStock != "-") {
            this.obtenerDataValidacion(this.inventarioSeleccionado);
          }
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
          invd.cantidadValidado = invd.cantidad;
          invd.diferencia = invd.stockTeorico - invd.cantidadValidado;
          invd.usuarioIdValidado = this.user.usuarioId;
          this.valorTeorico+=(invd.stockTeorico*invd.precioPromedio);
          this.valorFisico+=(invd.cantidad*invd.precioPromedio);
        });
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
    console.log(this.inventarioDetalle);
    
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
            if (this.inventarioSeleccionado.archivoStock != '-') {
              this.validar();
            } else {
              Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Éxito',
                text: 'Se ha finalizado el inventario correctamente!',
              }).then((result) => {
                window.location.reload();
              });
            }
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
    this.api.validarCantidades(this.inventarioDetalle).subscribe(id => {
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

}
