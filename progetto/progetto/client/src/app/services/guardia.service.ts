import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardiaService implements CanActivate {

  constructor(private router:Router, public Auth: AuthService) { }

  canActivate(): boolean{
    let user = this.Auth.get("user");
    console.log("UU", user);
    if(user!=undefined){
      return true;
    } else {
      this.router.navigate(['first-page']);
      return false;
    }


  }
}
