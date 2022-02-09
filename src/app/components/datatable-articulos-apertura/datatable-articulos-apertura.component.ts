import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Articulo } from 'src/app/models/articulo.model';

@Component({
  selector: 'app-datatable-articulos-apertura',
  templateUrl: './datatable-articulos-apertura.component.html',
  styleUrls: ['./datatable-articulos-apertura.component.css']
})
export class DatatableArticulosAperturaComponent implements OnInit,OnDestroy,OnChanges {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @Input() articulos: Articulo[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  isDtInitialized:boolean = false;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.dtElement){
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        console.log("destroy");
        this.dtTrigger.next();
        });
      } else {
        console.log("no-destroy");
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    }
    
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };    
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
