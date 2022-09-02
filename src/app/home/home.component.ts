import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Help  } from '../help'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activeUser
  users

  @Output() userNameEvent = new EventEmitter<string>();

  userName = '';



  setUserName(): void {
    this.userNameEvent.emit(this.userName);
  }




  constructor(private router:Router, private commonService:CommonService) {
    
   
  }
  user: Help = new Help()
  ngOnInit(): void {
    console.log("All msg from home 1 = " + JSON.stringify(this.users))
     
  this.commonService.getAll().subscribe((data: Help[]) => {
    this.users = data;
   ;
    console.log("All msg from home  2= " + JSON.stringify(this.users))
  })
    this.activeUser= localStorage.getItem("myUserName");
    if(this.activeUser){
      
      this.router.navigate(['/chat']);
    }
  }
  login(data){
   

    
  console.log(JSON.stringify(this.user))
  // localStorage.getItem("email");
  // localStorage.removeItem("email");

  if(this.user){
    if(this.user.email=="rishuyadav" || this.user.email=="rijhuupad"  ){
      if(this.user.password=="Rijhu@#0705"){
        console.log("coming")
        localStorage.setItem("myUserName", this.user.email);
        this.router.navigate(['/chat']);
      }
      else{
        alert("your password is incorrect.!")
      }
    }
    else{
      alert("Please enter a valid email.!")
    }
  }
    // this.router.navigate(['/chat']);
  }

}
