import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableArticulosAperturaComponent } from './datatable-articulos-apertura/datatable-articulos-apertura.component';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  declarations: [DatatableArticulosAperturaComponent],
  imports: [
    CommonModule,
    DataTablesModule
  ],
  exports:[
    DatatableArticulosAperturaComponent
  ]
})
export class ComponentsModule { }
