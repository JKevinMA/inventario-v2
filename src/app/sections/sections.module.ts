import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioComponent } from './inventario/inventario.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { ModulesModule } from '../modules/modules.module';
import { AppRoutingModule } from '../app-routing.module';
import { ReadexcelDirective } from '../directives/readexcel.directive';



@NgModule({
  declarations: [
    InventarioComponent,
    MantenimientoComponent
  ],
  imports: [
    CommonModule,
    ModulesModule,
    AppRoutingModule
  ],
  exports:[
    InventarioComponent,
    MantenimientoComponent
  ]
})
export class SectionsModule { }
