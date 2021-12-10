import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login.model';
import { Result } from '../models/result.model';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';
import { Local } from '../models/local.model';
import { Almacen } from '../models/almacen.model';
import { TipoInventario } from '../models/tipo-inventario.model';
import { Empresa } from '../models/empresa.model';
import { Area } from '../models/area.model';
import { Articulo } from '../models/articulo.model';
import { InventarioCabecera, InventarioDetalle } from '../models/inventario.model';
import { TomaInventarioCabecera, TomaInventarioDetalle, ValidarInicioInventario } from '../models/toma-inventario.model';
import { Categoria } from '../models/categoria.model';
import { Familia } from '../models/familia.model';
import { UnidadMedida } from '../models/unidad-medida.model';
import { UsuarioArea } from '../models/usuario-area.model';
import { ArticuloTipoInventario } from '../models/articulo-tipo-inventario.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASE_URL = environment.url_api;
  token:string | null="";
  constructor(private http:HttpClient) {
    this.leerToken();
  }

    //Metodos auxiliares
  leerToken() {
    if(localStorage.getItem('token-inventario-application')){
      this.token = localStorage.getItem('token-inventario-application');
    }else{
      this.token = "";
    }
  }

  estaAutenticado(): boolean{
    this.leerToken();
    return this.token!.length>2;
  }

  login(usuario:Login){
    return this.http.post<any>(`${this.BASE_URL}usuarios/login`,usuario)
    .pipe(
      map( (res:Result<UsuarioModel>) =>{
        if(res.response!=null && res.success){
          this.guardarUsuario(res);
        }
        return res;
        }) 
      );
  }

  logout(){
    localStorage.removeItem('token-inventario-application');
    localStorage.removeItem('user-inventario-application');
  }

  guardarUsuario(r:Result<UsuarioModel>){
    localStorage.setItem('token-inventario-application',"true");
    localStorage.setItem('user-inventario-application',JSON.stringify(r.response));
  }

  //METODOS PRINCIPALES
  //  APERTURA DE INVENTARIO

  obtenerLocales(empresaId:number){
    return this.http.get<Result<Local[]>>(`${this.BASE_URL}locales/empresa?empresaId=${empresaId}`);
  }
  obtenerAlmacenes(localId:number){
    return this.http.get<Result<Almacen[]>>(`${this.BASE_URL}almacenes/local?localId=${localId}`);
  }
  obtenerTiposInventario(){
    return this.http.get<Result<TipoInventario[]>>(`${this.BASE_URL}tiposinventario`);
  }
  obtenerAreas(almacenId:number){
    return this.http.get<Result<Area[]>>(`${this.BASE_URL}areas/almacen?almacenId=${almacenId}`);
  }
  obtenerArticulosTipoInventario(tipoInventarioId:number,areaId:number){
    return this.http.get<Result<Articulo[]>>(`${this.BASE_URL}articulos?tipoInventarioId=${tipoInventarioId}&areaId=${areaId}`);
  }
  aperturarInventarios(inventarios:InventarioCabecera[]){
    return this.http.post<Result<number>>(`${this.BASE_URL}inventarios`,inventarios);
  }
  validarAreasInventarioAbierto(inventarios:InventarioCabecera[]){
    return this.http.post<Result<Area[]>>(`${this.BASE_URL}inventarios/validarInventarioAbierto`,inventarios);
  }

  //  TOMA DE INVENTARIO
  obtenerInventariosAbiertos(usuarioId:number,estado:string){
    return this.http.get<Result<InventarioCabecera[]>>(`${this.BASE_URL}inventarios/abiertos?usuarioId=${usuarioId}&estado=${estado}`);
  }
  validarInicioInventario(inventarioId:number,usuarioId:number){
    return this.http.get<Result<ValidarInicioInventario>>(`${this.BASE_URL}tomasinventario/iniciado?inventarioId=${inventarioId}&usuarioId=${usuarioId}`);
  }
  obtenerTomaInventario(inventarioId:number,usuarioId:number){
    return this.http.get<Result<TomaInventarioDetalle[]>>(`${this.BASE_URL}tomasinventario?inventarioId=${inventarioId}&usuarioId=${usuarioId}`);
  }
  guardarToma(tid:TomaInventarioDetalle){
    return this.http.post<Result<number>>(`${this.BASE_URL}tomasinventario/toma`,tid);
  }
  cerrarToma(tic:TomaInventarioCabecera){
    return this.http.put<Result<number>>(`${this.BASE_URL}tomasinventario/cerrar`,tic);
  }

  // FINALIZACION DE INVENTARIO
  cerrarYObtenerTomasInventarioUsuarios(inventarioId:number){
    return this.http.get<Result<TomaInventarioCabecera[]>>(`${this.BASE_URL}tomasinventario/cerrarYCabeceras?inventarioId=${inventarioId}`);
  }
  obtenerTomaInventarioUsuario(tomaInventarioId:number){
    return this.http.get<Result<TomaInventarioDetalle[]>>(`${this.BASE_URL}tomasinventario/detalles?tomaInventarioId=${tomaInventarioId}`);
  }
  obtenerInventarioDetalle(inventarioId:number){
    return this.http.get<Result<InventarioDetalle[]>>(`${this.BASE_URL}inventarios/detalles?inventarioId=${inventarioId}`);
  }
  validarCantidades(ivds:InventarioDetalle[]){
    return this.http.put<Result<number>>(`${this.BASE_URL}inventarios/validarCantidad`,ivds);
  }
  finalizarInventario(inventarioId:number){
    return this.http.get<Result<number>>(`${this.BASE_URL}inventarios/finalizar?inventarioId=${inventarioId}`);
  }

  //  MANTENIMIENTO
  // Empresa
  obtenerEmpresas(){
    return this.http.get<Result<Empresa[]>>(`${this.BASE_URL}empresas`);
  }
  crearEmpresa(o:Empresa ){
    return this.http.post<Result<number>>(`${this.BASE_URL}empresas`,o);
  }
  actualizarEmpresa(o:Empresa){
    return this.http.put<Result<number>>(`${this.BASE_URL}empresas`,o);
  }
  eliminarEmpresa(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}empresas/${id}`);
  }

  // Articulo
  obtenerArticulos(){
    return this.http.get<Result<Articulo[]>>(`${this.BASE_URL}articulos/mtm`);
  }
  crearArticulo(o:Articulo ){
    return this.http.post<Result<number>>(`${this.BASE_URL}articulos`,o);
  }
  cargaArticulos(o:Articulo[]){
    return this.http.post<Result<number>>(`${this.BASE_URL}articulos/carga`,o);
  }
  actualizarArticulo(o:Articulo){
    return this.http.put<Result<number>>(`${this.BASE_URL}articulos`,o);
  }
  eliminarArticulo(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}articulos/${id}`);
  }
  obtenerArticulosEmpresa(empresaId:number){
    return this.http.get<Result<Articulo[]>>(`${this.BASE_URL}articulos/empresa?empresaId=${empresaId}`);
  }

  // Categoria
  obtenerCategorias(){
    return this.http.get<Result<Categoria[]>>(`${this.BASE_URL}categorias`);
  }
  obtenerCategoriasEmpresa(empresaId:number){
    return this.http.get<Result<Categoria[]>>(`${this.BASE_URL}categorias/empresa?empresaid=${empresaId}`);
  }
  crearCategoria(o:Categoria ){
    return this.http.post<Result<number>>(`${this.BASE_URL}categorias`,o);
  }
  actualizarCategoria(o:Categoria){
    return this.http.put<Result<number>>(`${this.BASE_URL}categorias`,o);
  }
  eliminarCategoria(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}categorias/${id}`);
  }

  // Familia
  obtenerFamilias(){
    return this.http.get<Result<Familia[]>>(`${this.BASE_URL}familias`);
  }
  obtenerFamiliasEmpresa(empresaId:number){
    return this.http.get<Result<Familia[]>>(`${this.BASE_URL}familias/empresa?empresaid=${empresaId}`);
  }
  crearFamilia(o:Familia ){
    return this.http.post<Result<number>>(`${this.BASE_URL}familias`,o);
  }
  actualizarFamilia(o:Familia){
    return this.http.put<Result<number>>(`${this.BASE_URL}familias`,o);
  }
  eliminarFamilia(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}familias/${id}`);
  }

  // UnidadMedida
  obtenerUnidadesMedida(){
    return this.http.get<Result<UnidadMedida[]>>(`${this.BASE_URL}unidadesmedida`);
  }
  crearUnidadMedida(o:UnidadMedida){
    return this.http.post<Result<number>>(`${this.BASE_URL}unidadesmedida`,o);
  }
  actualizarUnidadMedida(o:UnidadMedida){
    return this.http.put<Result<number>>(`${this.BASE_URL}unidadesmedida`,o);
  }
  eliminarUnidadMedida(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}unidadesmedida/${id}`);
  }

  // Almacen
  obtenerAlmacenesMTM(){
    return this.http.get<Result<Almacen[]>>(`${this.BASE_URL}almacenes`);
  }
  crearAlmacen(o:Almacen){
    return this.http.post<Result<number>>(`${this.BASE_URL}almacenes`,o);
  }
  actualizarAlmacen(o:Almacen){
    return this.http.put<Result<number>>(`${this.BASE_URL}almacenes`,o);
  }
  eliminarAlmacen(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}almacenes/${id}`);
  }

  // Area
  obtenerAreasMTM(){
    return this.http.get<Result<Area[]>>(`${this.BASE_URL}areas`);
  }
  crearArea(o:Area){
    return this.http.post<Result<number>>(`${this.BASE_URL}areas`,o);
  }
  actualizarArea(o:Area){
    return this.http.put<Result<number>>(`${this.BASE_URL}areas`,o);
  }
  eliminarArea(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}areas/${id}`);
  }

  // Local
  obtenerLocalesMTM(){
    return this.http.get<Result<Local[]>>(`${this.BASE_URL}locales`);
  }
  crearLocal(o:Local){
    return this.http.post<Result<number>>(`${this.BASE_URL}locales`,o);
  }
  actualizarLocal(o:Local){
    return this.http.put<Result<number>>(`${this.BASE_URL}locales`,o);
  }
  eliminarLocal(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}locales/${id}`);
  }

  // TipoInventario
  obtenerTiposInventarioMTM(){
    return this.http.get<Result<TipoInventario[]>>(`${this.BASE_URL}tiposInventario`);
  }
  crearTipoInventario(o:TipoInventario){
    return this.http.post<Result<number>>(`${this.BASE_URL}tiposInventario`,o);
  }
  actualizarTipoInventario(o:TipoInventario){
    return this.http.put<Result<number>>(`${this.BASE_URL}tiposInventario`,o);
  }
  eliminarTipoInventario(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}tiposInventario/${id}`);
  }

  // Usuario
  obtenerUsuarioMTM(){
    return this.http.get<Result<UsuarioModel[]>>(`${this.BASE_URL}usuarios`);
  }
  obtenerUsuariosEmpresa(empresaId:number){
    return this.http.get<Result<UsuarioModel[]>>(`${this.BASE_URL}usuarios/empresa?empresaid=${empresaId}`);
  }
  crearUsuario(o:UsuarioModel){
    return this.http.post<Result<number>>(`${this.BASE_URL}usuarios`,o);
  }
  actualizarUsuario(o:UsuarioModel){
    return this.http.put<Result<number>>(`${this.BASE_URL}usuarios`,o);
  }
  eliminarUsuario(id:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}usuarios/${id}`);
  }

  // UsuarioArea
  obtenerUsuariosAreaMTM(){
    return this.http.get<Result<UsuarioArea[]>>(`${this.BASE_URL}usuariosarea`);
  }
  crearUsuarioArea(o:UsuarioArea){
    return this.http.post<Result<number>>(`${this.BASE_URL}usuariosarea`,o);
  }
  eliminarUsuarioArea(usuarioId:number,areaId:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}usuariosarea?usuarioId=${usuarioId}&areaId=${areaId}`);
  }

  // ArticuloTipoInventario
  obtenerArticulosTipoInventarioMTM(){
    return this.http.get<Result<ArticuloTipoInventario[]>>(`${this.BASE_URL}articulostipoinventario`);
  }
  crearArticuloTipoInventario(o:ArticuloTipoInventario){
    return this.http.post<Result<number>>(`${this.BASE_URL}articulostipoinventario`,o);
  }
  actualizarArticuloTipoInventario(o:ArticuloTipoInventario){
    return this.http.put<Result<number>>(`${this.BASE_URL}articulostipoinventario`,o);
  }
  eliminarArticuloTipoInventario(articuloId:number,tipoInventarioId:number,areaId:number ){
    return this.http.delete<Result<number>>(`${this.BASE_URL}articulostipoinventario?articuloId=${articuloId}&tipoInventarioId=${tipoInventarioId}&areaId=${areaId}`);
  }
}
