import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isLogIn(){
    return !!localStorage.getItem("sender_email");
   }
}
