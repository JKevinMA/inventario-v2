import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private api:ApiService,private router:Router) {  
  }
  canActivate(): boolean {
    if(this.api.estaAutenticado()){
      return true;
    }else{
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
