import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Almacen } from 'src/app/models/almacen.model';
import { Area } from 'src/app/models/area.model';
import { Articulo } from 'src/app/models/articulo.model';
import { Local } from 'src/app/models/local.model';
import { MovimientoCabecera, MovimientoDetalle } from 'src/app/models/movimiento.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlert } from 'src/app/utils/sweet-alert';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  model?: NgbDateStruct

  locales: Local[] = [];
  localId = 0;
  almacenes: Almacen[] = [];
  almacenId = 0;
  areas: Area[] = [];
  areaId = 0;
  usuario?: UsuarioModel;
  movimientoCabecera?: MovimientoCabecera;
  movimientoDetalles?: MovimientoDetalle[] = [];

  readonly tipoMovimiento = 'INGRESO';

  constructor(private api: ApiService, private calendar: NgbCalendar) {
    this.model = this.calendar.getToday();
  }

  ngOnInit(): void {
    this.usuario = this.api.obtenerUsuarioLogeado();
    this.cargarLocales();
  }

  cargarLocales() {
    SweetAlert.startLoading();
    this.api.obtenerLocales(this.usuario?.empresaId!).subscribe(r => {
      if (r.success) {
        this.locales = r.response!;
      }
      SweetAlert.stopLoading();
    });
  }
  seleccionaLocal() {
    this.cargarAlmacenes();
    this.almacenId = 0;
  }
  cargarAlmacenes() {
    SweetAlert.startLoading();
    this.api.obtenerAlmacenes(this.localId).subscribe(r => {
      if (r.success) {
        this.almacenes = r.response!;
      }
      SweetAlert.stopLoading();
    });
  }
  seleccionaAlmacen() {
    this.cargarAreas();
    this.areaId = 0;
  }
  cargarAreas() {
    SweetAlert.startLoading();
    this.api.obtenerAreas(this.almacenId).subscribe(r => {
      if (r.success) {
        this.areas = r.response!;
      }
      SweetAlert.stopLoading();
    });
  }

  buscar() {
    if (this.areaId != 0 && this.almacenId != 0 && this.localId != 0) {
      SweetAlert.startLoading();
      console.log(this.tipoMovimiento, this.parsearFecha(this.model!), this.areaId);
      this.api.verificarRegistroMovimiento(this.tipoMovimiento, this.parsearFecha(this.model!), this.areaId).subscribe(r => {
        console.log(r);
        if (r.success) {
          this.movimientoCabecera = r.response!;
          if (this.movimientoCabecera.movimientoId == 0) {
            Swal.fire({
              title: 'Información',
              text: 'No existen registros del día ' + this.parsearFecha(this.model!) + ', ¿Deseas crear el ingreso?',
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: `Sí`,
              denyButtonText: `No`,
              allowOutsideClick: false,
              icon: 'info'
            }).then((result) => {

              if (result.isConfirmed) {
                SweetAlert.startLoading();
                this.api.iniciarRegistroMovimiento(this.tipoMovimiento, this.parsearFecha(this.model!), this.areaId).subscribe(r => {
                  if (r.success) {
                    this.movimientoDetalles = r.response!;
                  }
                  SweetAlert.stopLoading();
                },err=>{
                  console.log(err);
                });

              } else if (result.isDenied) {

              }
            });
          } else {
            if(this.movimientoCabecera.estado=="GENERADO"){
              SweetAlert.startLoading();
              this.api.traerMovimientoDetalle(this.movimientoCabecera.movimientoId!).subscribe(r => {
                if (r.success) {
                  this.movimientoDetalles = r.response!;
                }
                SweetAlert.stopLoading();
              });
            }else{
              Swal.fire('Información','Registro de ingresos del dia '+this.parsearFecha(this.model!)+' ya cerrado.','info')
            }
          }
        }
      });
    }

  }

  parsearFecha(f: NgbDateStruct): string {
    var fecha = new Date(f.year, f.month - 1, f.day)
    return fecha.toISOString().substring(0, 10);
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

        this.api.guardarMovimientoDetalle(this.movimientoDetalles!).subscribe(r => {
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

}
