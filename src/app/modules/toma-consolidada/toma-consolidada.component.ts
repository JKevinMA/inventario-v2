import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';
import { TomaConsolidadaCabecera, TomaConsolidadaDetalle } from 'src/app/models/toma-consolidada';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlert } from 'src/app/utils/sweet-alert';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-toma-consolidada',
  templateUrl: './toma-consolidada.component.html',
  styleUrls: ['./toma-consolidada.component.css']
})
export class TomaConsolidadaComponent implements OnInit {
  paso_1=true;
  paso_2=false;

  model?:NgbDateStruct;

  tipoAgrupacion="AREA";
  tomasConsolidadaCabecera:TomaConsolidadaCabecera[] =[];
  tomasConsolidadaDetalle:TomaConsolidadaDetalle[] =[];
  indexSeleccionado=-1;
  constructor(private api: ApiService,private calendar: NgbCalendar) { 
    this.model = this.calendar.getToday();
  }

  ngOnInit(): void {
    this.buscarConsolidadaCabecera();
  }

  buscarConsolidadaCabecera(){
    SweetAlert.startLoading();
    combineLatest(
      this.api.obtenerTomaInventarioConsolidadaCabecera(this.parsearFecha(this.model!)  ,this.tipoAgrupacion)
    ).subscribe(([res1]) => {
      this.tomasConsolidadaCabecera = res1.response!;
      SweetAlert.stopLoading();
    });
  }

  buscarConsolidadaDetalle(tipoInventarioId:number,id:number){
    SweetAlert.startLoading();
    combineLatest(
      this.api.obtenerTomaInventarioConsolidadaDetalle(this.parsearFecha(this.model!) ,this.tipoAgrupacion,tipoInventarioId,id)
    ).subscribe(([res1]) => {
      this.tomasConsolidadaDetalle = res1.response!;
      SweetAlert.stopLoading();
    });
  }

  parsearFecha(f:NgbDateStruct):string{
    var fecha = new Date(f.year, f.month - 1, f.day)
    return fecha.toISOString().substring(0, 10);
  }

  exportar(){
    var json: any[] = [];
    this.tomasConsolidadaDetalle.forEach(d=>{
      json.push(
        {
          "ArticuloId":d.articuloId,
          "Codigo":d.codigo,
          "Artículo":d.articulo,
          "Unidad de Medida":d.unidadMedida,
          "Cantidad":d.cantidad
        }
      )
    })
    let hoy:Date = new Date();
    var anio = hoy.getFullYear().toString();
    var mes = (hoy.getMonth()+1).toString();
    var dia = hoy.getDate().toString();
    var hora = hoy.getHours().toString();
    var min = hoy.getMinutes().toString();
    var sec = hoy.getSeconds().toString();
    var fileName= `tomaconsolidadadetalle${anio}${mes}${dia}${hora}${min}${sec}.xlsx`;
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }
}
