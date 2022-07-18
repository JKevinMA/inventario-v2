import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { combineLatest, Subject } from 'rxjs';
import { Almacen } from 'src/app/models/almacen.model';
import { Area } from 'src/app/models/area.model';
import { ArticuloTipoInventario } from 'src/app/models/articulo-tipo-inventario.model';
import { Articulo } from 'src/app/models/articulo.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Local } from 'src/app/models/local.model';
import { TipoInventario } from 'src/app/models/tipo-inventario.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtm-articulo-tipo-inventario',
  templateUrl: './mtm-articulo-tipo-inventario.component.html',
  styleUrls: ['./mtm-articulo-tipo-inventario.component.css']
})
export class MtmArticuloTipoInventarioComponent implements OnInit,OnDestroy {
  user!: UsuarioModel;

  articulosTipoInventario:ArticuloTipoInventario[] =[];
  articuloTipoInventario:ArticuloTipoInventario= new ArticuloTipoInventario();
  deleteId:number=0;
  editArea= new ArticuloTipoInventario();
  articulos:Articulo[]=[];
  articulosData:Array<Select2OptionData>=[];
  tiposInventario:TipoInventario[]=[];
  empresas:Empresa[] =[];
  locales:Local[] = [];
  almacenes:Almacen[] = [];
  areas:Area[] = [];
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creando=true;
  noValido=true;

  constructor(private api:ApiService,private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document) {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
 ngOnInit(): void {
  
  this.obtenerUsuario();
    this.reiniciar();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.obtener();

    /* this.cargarCombo(); */
  }
  cargarCombo(){
    let elemento = this._document.getElementById('seccion-articulo-tipoinventario');
    let script = this._renderer2.createElement('script');
    script.type = 'application/javascript';
    script.src = 'assets/custom.js';
    this._renderer2.appendChild(elemento, script);
  }
  obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
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
      this.api.obtenerArticulosTipoInventarioMTM(this.user.su),
      this.api.obtenerEmpresas(this.user.su),
      this.api.obtenerTiposInventarioMTM(),
    ]).subscribe(([res1,res2,res3])=>{
      console.log(res1);
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
    console.log(o);
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
        this.articulosData=[];
        this.articulos = r.response!;
        this.articulos.forEach(a=>{
          this.articulosData.push({id:a.articuloId.toString(),text:a.descripcion});
        });
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

  ///////////////////////

  public items:Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];
 
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
 
  private get disabledV():string {
    return this._disabledV;
  }
 
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
 
  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }
 
  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }
 
  public typed(value:any):void {
    console.log('New search input: ', value);
  }
 
  public refreshValue(value:any):void {
    this.value = value;
  }
}
