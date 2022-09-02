import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { map } from "rxjs/operators"
import { Help} from '././help';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  activeUser
  apiUrl="https://chatrishu.herokuapp.com/";
  // webUrl="http://localhost:8000/"
  webUrl="https://chatsender.herokuapp.com/"
  constructor(private http: HttpClient) { 
    this.activeUser= localStorage.getItem("myUserName");
  }

   
  // getAll(): Observable<Help[]> {
  //   return <any>this.http.get( `${this.webUrl}`+"api/AllMessage/").pipe(map((Response: any) => Response));
  // }
  
removeProduct(items){
  console.log("coming.....")
  // this.http.delete("http://localhost:3000/myItems/"+id).subscribe();
  // this.http.post("http://localhost:8000/api/removeData/", items[0]).subscribe();
  this.http.post(`${this.webUrl}`+"api/removeData/", items[0]).subscribe();
  }
 
}
