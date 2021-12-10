import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { ReadexcelDirective } from 'src/app/directives/readexcel.directive';
import { Almacen } from 'src/app/models/almacen.model';
import { Area } from 'src/app/models/area.model';
import { Articulo } from 'src/app/models/articulo.model';
import { Local } from 'src/app/models/local.model';
import { TipoInventario } from 'src/app/models/tipo-inventario.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import { ViewChild } from '@angular/core';
import { InventarioCabecera, InventarioDetalle } from 'src/app/models/inventario.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-apertura',
  templateUrl: './apertura.component.html',
  styleUrls: ['./apertura.component.css']
})
export class AperturaComponent implements OnInit {

  user!: UsuarioModel;
  locales!: Local[];
  localId = 0;
  almacenes!: Almacen[];
  almacenId = 0;
  tiposInventario!: TipoInventario[];
  tipoInventarioId = 0;

  area: Area = new Area();
  articulosAlerta: Articulo[] = [];

  paso_1 = true;
  paso_2 = false;

  dtOptions: DataTables.Settings = {};

  readExcel!: ReadexcelDirective;
  @ViewChild('myInputFile')
  myInputFile!: ElementRef;
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    
    this.obtenerUsuario();
    this.cargarControles();
    this.area.articulos = [];
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  cargarControles() {
    this.isLoading();
    combineLatest(
      this.api.obtenerLocales(this.user.empresaId),
      this.api.obtenerTiposInventario(),
    ).subscribe(([res1, res2]) => {
      this.locales = res1.response!;
      this.tiposInventario = res2.response!;
      this.stopLoading();
    });
  }
  obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }
  submitCriterios(formulario: NgForm) {
    if (this.localId == 0 || this.tipoInventarioId == 0) return;

    this.paso_1 = false;
    this.paso_2 = true;

    this.almacenes = [];
    this.isLoading();
    this.api.obtenerAlmacenes(this.localId).subscribe(r => {
      this.almacenes = r.response!;
      this.almacenes.forEach(almacen => {
        almacen.selected = false;
        this.api.obtenerAreas(almacen.almacenId).subscribe(r_areas => {
          almacen.areas = r_areas.response!;
          almacen.areas.forEach(a => {
            a.selected = false;
            a.archivo = '-';
            this.api.obtenerArticulosTipoInventario(this.tipoInventarioId, a.areaId).subscribe(r_articulos => {
              a.articulos = r_articulos.response!;
              a.articulos.forEach(a => {
                a.stockTeorico = 0;
                a.precioPromedio = 0.0;
              });
              this.stopLoading();
            });
          });
        })
      })
    });
  }

  seleccionaLocal() {
    this.api.obtenerAlmacenes(this.localId).subscribe(res => {
      this.almacenes = res.response!;
      this.almacenId = 0;
    })
  }

  verArticulos(area: Area) {
    if (area.archivo == "-") {
      area.articulos.forEach(a => {
        a.stockTeorico = 0;
        a.precioPromedio = 0;
      });
    }
    this.articulosAlerta = [];
    this.area = new Area();
    this.area.articulos = [];

    this.area = { ...area };
  }

  DataFromEventEmmiter(o: any) {
    console.log('DataFromEventEmmiter', o);
    this.articulosAlerta = [];
    for (let i = 0; i < o.length; i++) {
      var noExiste = false;
      for (let j = 0; j < this.area.articulos.length; j++) {
        if (o[i]['codigo'] == this.area.articulos[j].codigo) {
          this.area.articulos[j].stockTeorico = o[i]['stockTeorico'];
          this.area.articulos[j].precioPromedio = o[i]['precioPromedio'];
          noExiste = false;
          break;
        } else {
          noExiste = true;
        }
      }
      if (noExiste) {
        this.articulosAlerta.push(o[i]);
      }
    }
  }
  cerrarModal() {
    try {
      this.area = new Area();
      this.area.articulos = [];
      /* this.readExcel.eventEmitter = new EventEmitter<any>(); */
      this.myInputFile.nativeElement.value = "";
    } catch (error) {
      console.log(error);
    }

  }

  subir(area: Area) {
    area.articulos = this.area.articulos;
    var nombre = this.myInputFile.nativeElement.value.substr(12);
    console.log(this.myInputFile.nativeElement.value);
    if (nombre != '') {
      for (let i = 0; i < this.almacenes.length; i++) {
        for (let j = 0; j < this.almacenes[i].areas.length; j++) {
          if (area.areaId == this.almacenes[i].areas[j].areaId) {
            this.almacenes[i].areas[j].archivo = nombre;
            this.myInputFile.nativeElement.value = "";
            return;
          }

        }
      }
    }


  }

  seleccionarAlmacen(almacen: Almacen) {
    console.log(almacen);
    almacen.areas.forEach(are => {
      are.selected = !almacen.selected;
    });
  }

  atras() {
    this.paso_1 = true;
    this.paso_2 = false;
    this.almacenes = [];
  }
  aperturar() {

    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de aperturar las areas seleccionadas?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Guardar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        var inventarios: InventarioCabecera[] = [];
        this.almacenes.forEach(alm => {
          alm.areas.forEach(ar => {
            var inv = new InventarioCabecera();
            if (ar.selected) {
              inv.estado = 'APERTURADO';
              inv.archivoStock = ar.archivo;
              inv.usuarioId = this.user.usuarioId;
              inv.tipoInventarioId = +this.tipoInventarioId;
              inv.areaId = ar.areaId;
              inv.detalles = [];
              ar.articulos.forEach(art => {
                var invDeta = new InventarioDetalle();
                invDeta.articuloId = art.articuloId;
                invDeta.stockTeorico = art.stockTeorico;
                invDeta.precioPromedio = art.precioPromedio;
                inv.detalles.push(invDeta);
              });
              inventarios.push(inv);
            }
          });
        });

        console.log(inventarios);

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Aperturando inventarios',
          text: 'Cargando...',
        });

        Swal.showLoading();

        var inventariosAbiertos:Area[] = [];
        this.api.validarAreasInventarioAbierto(inventarios).subscribe(r=>{
          inventariosAbiertos=r.response!;
          if(inventariosAbiertos.length!=0){
            var text = "Existen Áreas con Inventario Abierto: \n";
            var limite = inventariosAbiertos.length-1;
            inventariosAbiertos.forEach((i,ind)=>{
              text = text + i.descripcion +(ind!=limite?',':'.');
            });

            text= text+" ¿Desea continuar?";
            
            Swal.fire({
              title: 'Confirmación',
              text: text,
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: `Continuar`,
              denyButtonText: `Cancelar`,
              allowOutsideClick: false,
              icon: 'info'
            }).then((result) => {
              if (result.isConfirmed) {
                this.api.aperturarInventarios(inventarios).subscribe(r => {
                  if (r.success) {
                    Swal.fire({
                      allowOutsideClick: false,
                      icon: 'success',
                      title: 'Éxito',
                      text: 'Se han aperturado los inventarios correctamente!',
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
              }else if (result.isDenied) {

              }
            });
          }else{
            this.api.aperturarInventarios(inventarios).subscribe(r => {
              if (r.success) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'success',
                  title: 'Éxito',
                  text: 'Se han aperturado los inventarios correctamente!',
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
          }
        });
      } else if (result.isDenied) {

      }
    });
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

}
