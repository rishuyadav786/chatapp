
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import{AuthService} from './auth.service'
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService,private router:Router){

  }
  canActivate(){
    if(this.authService.isLogIn()){
      return true
    }
    alert("please login first")
    this.router.navigate['/home']
    return false;
  }
  
}
