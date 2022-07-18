import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableArticulosAperturaComponent } from './datatable-articulos-apertura/datatable-articulos-apertura.component';
import { DataTablesModule } from 'angular-datatables';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DatatableArticulosAperturaComponent, CustomTableComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    DatatableArticulosAperturaComponent,
    CustomTableComponent
  ]
})
export class ComponentsModule { }
