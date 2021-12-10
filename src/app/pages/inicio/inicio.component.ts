import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  user!:UsuarioModel;
  rol = "-";
  constructor(private api:ApiService,private router:Router) { }


  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    var objectUser = localStorage.getItem('user-inventario-application');
    if(objectUser!=null){
      this.user = JSON.parse(objectUser);
      if(this.user.administrador){
        this.rol = 'Administrador'
      }else if(this.user.supervisor){
        this.rol = 'Supervisor';
      }else if(this.user.inventario){
        this.rol = 'Inventariador';
      }
    }
  }

  cerrarSesion(){
    this.api.logout();
    this.router.navigate(['login']);
  }
}
