import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Almacen } from 'src/app/models/almacen.model';
import { Area } from 'src/app/models/area.model';
import { IngresoSalidaConsolidada } from 'src/app/models/ingreso-salida-consolidada';
import { Local } from 'src/app/models/local.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlert } from 'src/app/utils/sweet-alert';

@Component({
  selector: 'app-ingreso-salida-consolidada',
  templateUrl: './ingreso-salida-consolidada.component.html',
  styleUrls: ['./ingreso-salida-consolidada.component.css']
})
export class IngresoSalidaConsolidadaComponent implements OnInit,OnDestroy {
  model?: NgbDateStruct

  locales: Local[] = [];
  localId = 0;
  almacenes: Almacen[] = [];
  almacenId = 0;
  areas: Area[] = [];
  areaId = 0;
  usuario?: UsuarioModel;
  ingresoSalidaConsolidada: IngresoSalidaConsolidada[]=[]; 
 /*  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>(); */

  constructor(private api: ApiService, private calendar: NgbCalendar) {
    this.model = this.calendar.getToday();
  }
  ngOnInit(): void {
    this.usuario = this.api.obtenerUsuarioLogeado();
    this.cargarLocales();
    /* this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    }; */
  }

  ngOnDestroy(): void {
    /* this.dtTrigger.unsubscribe(); */
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
  parsearFecha(f: NgbDateStruct): string {
    var fecha = new Date(f.year, f.month - 1, f.day)
    return fecha.toISOString().substring(0, 10);
  }
  consolidar(){
    var fechaActual = new Date(this.model!.year, this.model!.month - 1, this.model!.day);
    var fAnterior = new Date(fechaActual.setDate(fechaActual.getDate()-1)).toISOString().substring(0, 10);
    var fActual = new Date(this.model!.year, this.model!.month - 1, this.model!.day).toISOString().substring(0, 10);
    SweetAlert.startLoading();
    this.api.traerIngresoSalidaConsolidada(fAnterior,fActual,11).subscribe(r=>{
      if(r.success){
        this.ingresoSalidaConsolidada = r.response!;
        /* this.rerender();
        this.dtTrigger.next(); */
      }
      SweetAlert.stopLoading();
    });
  }


  @ViewChild(DataTableDirective, {static : false})
  dtElement!: DataTableDirective;

  /* rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
    });
  } */

}
