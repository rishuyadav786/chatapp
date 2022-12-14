import { Component, OnInit ,AfterViewChecked,ViewChild,ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Chats  } from '../help';
import { from, of } from 'rxjs';
import { CommonService  } from '../common.service';
import { delay, map, mergeAll, mergeMap, switchAll, switchMap,retry } from 'rxjs/operators';
import Pusher from 'pusher-js';
import * as io from 'socket.io-client';
import { interval, Subscription} from 'rxjs';
import {Help} from '../help'
const SOCKET_ENDPOINT = "localhost:8000";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit,AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  userName = '';
  message = '';
  activeUser="";
  users
  messageList:any[]= [];
  userList: string[] = [];
  socket: any;
  receiverUser
chatWith;
chats:any=[];
  constructor(private router:Router, private commonService:CommonService,private _Activatedroute:ActivatedRoute) {
    this.receiverUser=this._Activatedroute.snapshot.paramMap.get("userEmail");
    this.activeUser= localStorage.getItem("myUserName");
    this.userName = this.activeUser;
    this.activeUser= localStorage.getItem("myUserName");
   
    this.socket = io.io(`https://chatsender.herokuapp.com/?userName=${this.activeUser}`);
    // this.socket = io.io(SOCKET_ENDPOINT+`/?userName=${this.activeUser}`);
    this.userName = this.activeUser;
  
    this.socket.emit('set-user-name', this.activeUser);
  
    this.socket.on('user-list', (userList: string[]) => {
      this.userList = userList;
      this.chatWith=this.userList.filter(res=>res!=this.activeUser)[0];
      // console.log("user list= "+JSON.stringify(userList))
      // console.log("chat with ="+JSON.stringify(this.chatWith))
    });
    this.socket.on('output-message', (data) => {
      this.chats.push(data);

      // console.log("from service"+ JSON.stringify(this.chats))
    });
  
    this.socket.on('message-broadcast', (data) => {
    
      if (data) {
       
        // this.messageList=this.chats

        // this.messageList=data;
        this.messageList=data.filter(res=>{
          
          
        return   (res.receiver_id==this.activeUser  && res.sender_id==this.receiverUser)||( res.sender_id==this.activeUser && res.receiver_id==this.receiverUser)
        } );
    
      }
    });

    window.scrollTo(0, document.body.scrollHeight);

    // window.scrollTo(0, document.body.scrollHeight || document.getElementById('scroll').scrollHeight);
    // document.getElementById('scroll').scrollTop =  document.getElementById('scroll').scrollHeight
    // $(document).scrollTop($(document).height());
    // window.scrollTo(0,9999);
  }

ngOnInit(): void {
  
  // this.commonService.getAll().subscribe((data: Help[]) => {
  //   this.users = data;
  //  ;
  //   // console.log("user Data" + JSON.stringify(this.users))
  // })
}
ngAfterViewChecked() {        
  this.scrollToBottom();        
} 

scrollToBottom(): void {
  try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }                 
}
sendMessage(): void {
  let currentTime=new Date();
  let trimTime=currentTime.toString().slice(4,21)
  console.log(trimTime)
  console.log("msg= "+this.message)
  if(this.message){
    this.socket.emit('message', {message:this.message,time:trimTime,receiver_id:this.receiverUser});
  }
 
  // this.messageList.push({message: this.message, userName: this.userName, mine: true});
  this.message = '';
}
logout() {
  localStorage.removeItem("myUserName");


  this.router.navigate(['/home']);
 

}
allUsers(){
  this.router.navigate(['/allusers']);
}
clearChat(){
  this.commonService.removeProduct(this.messageList);
  window.location.reload();




  
}

}
