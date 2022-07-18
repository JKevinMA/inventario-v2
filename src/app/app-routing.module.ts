import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AperturaComponent } from './modules/apertura/apertura.component';
import { FinalizacionComponent } from './modules/finalizacion/finalizacion.component';
import { IngresoSalidaConsolidadaComponent } from './modules/ingreso-salida-consolidada/ingreso-salida-consolidada.component';
import { IngresoComponent } from './modules/ingreso/ingreso.component';
import { MtmAlmacenComponent } from './modules/mtm-almacen/mtm-almacen.component';
import { MtmAreaComponent } from './modules/mtm-area/mtm-area.component';
import { MtmArticuloTipoInventarioComponent } from './modules/mtm-articulo-tipo-inventario/mtm-articulo-tipo-inventario.component';
import { MtmArticuloComponent } from './modules/mtm-articulo/mtm-articulo.component';
import { MtmCategoriaComponent } from './modules/mtm-categoria/mtm-categoria.component';
import { MtmEmpresaComponent } from './modules/mtm-empresa/mtm-empresa.component';
import { MtmFamiliaComponent } from './modules/mtm-familia/mtm-familia.component';
import { MtmLocalComponent } from './modules/mtm-local/mtm-local.component';
import { MtmTipoInventarioComponent } from './modules/mtm-tipo-inventario/mtm-tipo-inventario.component';
import { MtmUnidadMedidaComponent } from './modules/mtm-unidad-medida/mtm-unidad-medida.component';
import { MtmUsuarioAreaComponent } from './modules/mtm-usuario-area/mtm-usuario-area.component';
import { MtmUsuarioComponent } from './modules/mtm-usuario/mtm-usuario.component';
import { PruebaComponent } from './modules/prueba/prueba.component';
import { SalidaComponent } from './modules/salida/salida.component';
import { TomaConsolidadaComponent } from './modules/toma-consolidada/toma-consolidada.component';
import { TomaComponent } from './modules/toma/toma.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { IngresosSalidasComponent } from './sections/ingresos-salidas/ingresos-salidas.component';
import { InventarioComponent } from './sections/inventario/inventario.component';
import { MantenimientoComponent } from './sections/mantenimiento/mantenimiento.component';
import { ReportesComponent } from './sections/reportes/reportes.component';

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    canActivate:[AuthGuard],
    path:'',
    component:InicioComponent,
    children:[
      {
        path:'inventario',
        component:InventarioComponent,
        children:[
          {
            path:'apertura',
            component:AperturaComponent
          },
          {
            path:'toma',
            component:TomaComponent
          },
          {
            path:'finalizacion',
            component:FinalizacionComponent
          },
          {
            path:'prueba',
            component:PruebaComponent
          }
        ]
      },
      {
        path:'mantenimiento',
        component:MantenimientoComponent,
        children:[
          {
            path:'empresa',
            component:MtmEmpresaComponent,
          },
          {
            path:'local',
            component:MtmLocalComponent
          },
          {
            path:'almacen',
            component:MtmAlmacenComponent
          },
          {
            path:'area',
            component:MtmAreaComponent
          },
          {
            path:'usuario',
            component:MtmUsuarioComponent
          },
          {
            path:'usuario-area',
            component:MtmUsuarioAreaComponent
          },
          {
            path:'familia',
            component:MtmFamiliaComponent
          },
          {
            path:'categoria',
            component:MtmCategoriaComponent
          },
          {
            path:'unidad-medida',
            component:MtmUnidadMedidaComponent
          },
          {
            path:'tipo-inventario',
            component:MtmTipoInventarioComponent
          },
          {
            path:'articulo',
            component:MtmArticuloComponent
          },
          {
            path:'articulo-tipo-inventario',
            component:MtmArticuloTipoInventarioComponent
          }
        ]
      },
      {
        path:'reportes',
        component: ReportesComponent,
        children:[
          {
            path:'toma-consolidada',
            component:TomaConsolidadaComponent
          }
        ]
      },
      {
        path:'ingresos-salidas',
        component: IngresosSalidasComponent,
        children:[
          {
            path:'ingreso',
            component:IngresoComponent
          },
          {
            path:'salida',
            component:SalidaComponent
          },
          {
            path:'ingreso-salida-consolidada',
            component:IngresoSalidaConsolidadaComponent
          }
        ]
      },
    ]
  },
  {
    path: '**', redirectTo:'/login',pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
