import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { InventarioCabecera } from 'src/app/models/inventario.model';
import { TomaInventarioCabecera, TomaInventarioDetalle } from 'src/app/models/toma-inventario.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-toma',
  templateUrl: './toma.component.html',
  styleUrls: ['./toma.component.css']
})
export class TomaComponent implements OnInit,OnDestroy {
  user!: UsuarioModel;
  inventariosAbiertos:InventarioCabecera[]=[];

  inventarioIdSeleccionado=0;
  paso_1=true;
  paso_2=false;

  tomasInventarioDetalle:TomaInventarioDetalle[]=[];
  localizaciones:string[] = [];
  familias:string[] = [];
  categorias:string[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  constructor(private api:ApiService) { }

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

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.obtenerUsuario();
    this.obtenerInventariosAbiertos();
  }

  verResumen(){
    /* this.dtTrigger.lift;
    this.dtTrigger.next(); */
  }

  obtenerInventariosAbiertos(){
    this.isLoading();
    this.api.obtenerInventariosAbiertos(this.user.usuarioId,'APERTURADO').subscribe(r=>{
      this.inventariosAbiertos = r.response!;
      this.inventariosAbiertos.forEach(ia=>{
        ia.iniciado = false;
        this.api.validarInicioInventario(ia.inventarioId,this.user.usuarioId).subscribe(vr=>{
          if(vr.success){
            if(vr.response?.total != 0){
              ia.iniciado = vr.response!.total == 0?false:true;
              ia.cerrado = vr.response!.cerrado;
            }
          }
          this.stopLoading();
        });
      });
      this.stopLoading();
    });
  }

  obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }

  iniciarInventario(inventarioId:number){
    this.inventarioIdSeleccionado=inventarioId;
    this.paso_1=false;
    this.paso_2=true;
    this.isLoading();
    this.api.obtenerTomaInventario(inventarioId,this.user.usuarioId).subscribe(r=>{
      if(r.success){
        this.tomasInventarioDetalle = r.response!;
        this.tomasInventarioDetalle.forEach(tid=>{
          tid.error=false;
        });
        this.todoTomasInventarioDetalle = [...this.tomasInventarioDetalle];
        this.cargarFiltros();
      }
      this.stopLoading();
    });
  }

  onBlur(tID:TomaInventarioDetalle,inputCantidad:any){
    
    var tID_Copia = {...tID};
    tID_Copia.cantidad = inputCantidad.value==''?0:+inputCantidad.value;
    tID_Copia.blanco = false;

    this.api.guardarToma(tID_Copia).subscribe(r=>{
      if(r.success){
        if(r.response!=0){
          tID.cantidad = inputCantidad.value==''?0:+inputCantidad.value;
          tID.blanco = false;
          tID.error = false;
        }else{
          tID.error = true;
          tID.blanco = true;
          /* tID.blanco = tID_Antes.blanco; */
        }
      }else{
        tID.error = true;
        tID.blanco = true;
       /*  tID.blanco = tID_Antes.blanco; */
      }
    },err=>{
      tID.error = true;
      tID.blanco = true;
      /* tID.blanco = tID_Antes.blanco; */
    });
    //TODO: METODO DE TOMA DE INVENTARIO
  }


  todoTomasInventarioDetalle:TomaInventarioDetalle[]=[];
  filtrar(){

    this.tomasInventarioDetalle = [...this.todoTomasInventarioDetalle];
    
    var filtIngreso =  (this.filtroIngreso == 0?false:true);
    var filtrado = this.tomasInventarioDetalle.filter(tid => tid.blanco == (this.filtroIngreso!=2? filtIngreso :tid.blanco) && tid.localizacion ==  (this.filtroLocalizacion=='0'?tid.localizacion:this.filtroLocalizacion) && tid.categoria ==  (this.filtroCategoria=='0'?tid.categoria:this.filtroCategoria)  && tid.familia ==  (this.filtroFamilia=='0'?tid.familia:this.filtroFamilia) );
    this.tomasInventarioDetalle = filtrado;
    /* if(this.filtroIngreso!=2){
    } */
  }

  filtroIngreso:number=2;
  filtroLocalizacion = '0';
  filtroFamilia = '0';
  filtroCategoria = '0';
  cargarFiltros(){

    this.localizaciones = [];
    var loc:string[] =[];

    this.familias=[];
    var fam:string[]=[];

    this.categorias=[];
    var cat:string[]=[];
    
    this.todoTomasInventarioDetalle.forEach(f=>{
      loc.push(f.localizacion);
      cat.push(f.categoria);
      fam.push(f.familia);
    });

    let resLoc = loc.filter((item,index)=>{
      return loc.indexOf(item) === index;
    });
    resLoc = resLoc.sort();
    this.localizaciones= resLoc;

    let resFam = fam.filter((item,index)=>{
      return fam.indexOf(item) === index;
    });
    resFam = resFam.sort();
    this.familias= resFam;

    let resCat = cat.filter((item,index)=>{
      return cat.indexOf(item) === index;
    });
    resCat = resCat.sort();
    this.categorias= resCat;
  }

  salir(){
    this.paso_1=true;
    this.paso_2=false;
    this.todoTomasInventarioDetalle=[];
    this.tomasInventarioDetalle=[];
    this.inventarioIdSeleccionado=0;

    this.obtenerInventariosAbiertos();
  }

  cerrarToma(){
    
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de cerrar la toma de inventario?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Cerrar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Cerrando toma de inventario',
          text: 'Cargando...',
        });

        Swal.showLoading();
        
        var tic = new TomaInventarioCabecera();
        tic.tomaInventarioId = this.todoTomasInventarioDetalle[0].tomaInventarioId;

        this.api.cerrarToma(tic).subscribe(r => {
          if (r.success) {
            if(r.response! > 0){
              Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Éxito',
                text: 'Se ha cerrado correctamente!',
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
