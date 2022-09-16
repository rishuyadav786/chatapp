import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

import { Help  } from '../help'
@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit {
  users
  user: Help = new Help()
  activeUser
 
  constructor(private commonService:CommonService,private router:Router) {
    this.activeUser= localStorage.getItem("myUserName");
   }

  ngOnInit(): void {
    
     
  this.commonService.getAll().subscribe((data: Help[]) => {
    this.users = data.filter(res=>res.email!=this.activeUser);
   ;
   
  })
  }
  openChat(userEmail){
    this.router.navigate(['/chat',userEmail]);
    // this.router.navigate(['/chat']);

  }
}
