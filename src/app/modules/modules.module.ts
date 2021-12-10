import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AperturaComponent } from './apertura/apertura.component';
import { TomaComponent } from './toma/toma.component';
import { FinalizacionComponent } from './finalizacion/finalizacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MtmEmpresaComponent } from './mtm-empresa/mtm-empresa.component';
import { MtmLocalComponent } from './mtm-local/mtm-local.component';
import { MtmAlmacenComponent } from './mtm-almacen/mtm-almacen.component';
import { MtmAreaComponent } from './mtm-area/mtm-area.component';
import { MtmTipoInventarioComponent } from './mtm-tipo-inventario/mtm-tipo-inventario.component';
import { MtmUnidadMedidaComponent } from './mtm-unidad-medida/mtm-unidad-medida.component';
import { MtmUsuarioAreaComponent } from './mtm-usuario-area/mtm-usuario-area.component';
import { MtmUsuarioComponent } from './mtm-usuario/mtm-usuario.component';
import { MtmFamiliaComponent } from './mtm-familia/mtm-familia.component';
import { MtmArticuloComponent } from './mtm-articulo/mtm-articulo.component';
import { MtmArticuloTipoInventarioComponent } from './mtm-articulo-tipo-inventario/mtm-articulo-tipo-inventario.component';
import { MtmCategoriaComponent } from './mtm-categoria/mtm-categoria.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ReadexcelDirective } from '../directives/readexcel.directive';



@NgModule({
  declarations: [
    AperturaComponent,
    TomaComponent,
    FinalizacionComponent,
    MtmEmpresaComponent,
    MtmLocalComponent,
    MtmAlmacenComponent,
    MtmAreaComponent,
    MtmTipoInventarioComponent,
    MtmUnidadMedidaComponent,
    MtmUsuarioAreaComponent,
    MtmUsuarioComponent,
    MtmFamiliaComponent,
    MtmArticuloComponent,
    MtmArticuloTipoInventarioComponent,
    MtmCategoriaComponent,
    ReadexcelDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DataTablesModule
  ],
  exports:[
    AperturaComponent,
    TomaComponent,
    FinalizacionComponent,
    MtmEmpresaComponent,
    MtmLocalComponent,
    MtmAlmacenComponent,
    MtmAreaComponent,
    MtmTipoInventarioComponent,
    MtmUnidadMedidaComponent,
    MtmUsuarioAreaComponent,
    MtmUsuarioComponent,
    MtmFamiliaComponent,
    MtmArticuloComponent,
    MtmArticuloTipoInventarioComponent,
    ReadexcelDirective
  ]
})
export class ModulesModule { }
