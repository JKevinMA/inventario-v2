import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { Articulo } from 'src/app/models/articulo.model';
import { Categoria } from 'src/app/models/categoria.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Familia } from 'src/app/models/familia.model';
import { UnidadMedida } from 'src/app/models/unidad-medida.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtm-articulo',
  templateUrl: './mtm-articulo.component.html',
  styleUrls: ['./mtm-articulo.component.css']
})
export class MtmArticuloComponent implements OnInit,OnDestroy {
  articulos: Articulo[] = [];
  articulo: Articulo = new Articulo();
  deleteId: number = 0;
  editEmpresa = new Articulo();
  articulosCarga: Articulo[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creando = true;
  noValido = true;

  empresas:Empresa[]=[];
  categorias:Categoria[]=[];
  familias:Familia[]=[];
  unidadesMedida:UnidadMedida[]=[];

  constructor(private api: ApiService) {
    this.obtener();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
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

  obtener() {

    this.isLoading();
    combineLatest([
      this.api.obtenerArticulos(),
      this.api.obtenerEmpresas(),
      this.api.obtenerUnidadesMedida(),
    ]).subscribe(([res1,res2,res3])=>{
      if(res1.success){
        this.articulos = res1.response!;
        this.dtTrigger.next();
      }
      if(res2.success){
        this.empresas = res2.response!;
      }
      if(res3.success){
        this.unidadesMedida = res3.response!;
      }
      this.stopLoading();
    })

  }

  cargarControles(){
    this.isLoading();
    this.api.obtenerEmpresas().subscribe(r=>{
      if(r.success){
        this.empresas = r.response!;
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
  }

  reiniciar(){
    this.articulo = new Articulo();
    this.articulo.empresaId = 0;
    this.articulo.categoriaId = 0;
    this.articulo.familiaId = 0;
    this.articulo.unidadMedidaId = 0;
  }

  seleccionaEmpresa(){
    this.traerCategorias();
    this.traerFamilias();

    this.articulo.categoriaId = 0;
    this.articulo.familiaId = 0;
  }

  traerCategorias(){
    this.isLoading();
    this.api.obtenerCategoriasEmpresa(this.articulo.empresaId).subscribe(r=>{
      if(r.success){
        this.categorias = r.response!;
      }
      this.stopLoading();
    });
  }
  traerFamilias(){
    this.isLoading();
    this.api.obtenerFamiliasEmpresa(this.articulo.empresaId).subscribe(r=>{
      if(r.success){
        this.familias = r.response!;
      }
      this.stopLoading();
    });
  }

  submit(formulario: NgForm) {
    if (formulario.invalid) return;
    console.log(this.articulo);

    this.guardar();

  }

  editar(o: Articulo) {
    this.creando = false;
    this.articulo = { ...o };
    this.traerCategorias();
    this.traerFamilias();
  }

  guardar() {
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

        this.articulo.empresaId = +this.articulo.empresaId;
        this.articulo.categoriaId = +this.articulo.categoriaId;  
        this.articulo.familiaId = +this.articulo.familiaId;  
        this.articulo.unidadMedidaId = +this.articulo.unidadMedidaId;  


        var solicitud = this.creando ? this.api.crearArticulo(this.articulo) : this.api.actualizarArticulo(this.articulo);

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

  cerrarModal() {
    this.reiniciar();
  }

  eliminar(id: number) {
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

        this.api.eliminarArticulo(id).subscribe(r => {
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
  DataFromEventEmmiter(o: any) {
    try {
      this.articulosCarga = [];
      
      o.forEach((e:Articulo) => {
        var a = new Articulo();
        a.codigo = e.codigo!;  
        a.descripcion = e.descripcion!;   
        a.barcode = e.barcode ? e.barcode.toString():'';
        a.empresaId = e.empresaId!;
        a.categoriaId = e.categoriaId!;
        a.familiaId = e.familiaId!;
        a.unidadMedidaId = e.unidadMedidaId!;
        this.articulosCarga.push(a);
      });
    } catch (ex) {
    }

  }

  cargaArticulos() {
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de cargar los articulos?',
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
          title: 'Guardando registros',
          text: 'Cargando...',
        });

        Swal.showLoading();

        this.api.cargaArticulos(this.articulosCarga).subscribe(r => {
          if (r.success) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Éxito',
              text: 'Se han guardado correctamente!',
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

}
