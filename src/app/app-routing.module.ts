import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import{AuthGuard} from './auth.guard';
import { AllusersComponent } from './allusers/allusers.component';
const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"chat/:userEmail",component:ChatComponent,canActivate:[AuthGuard] },
  // { path:'chat', component: ChatComponent ,canActivate:[AuthGuard] },
  {path:"home",component:HomeComponent},
  {path:"allusers",component:AllusersComponent,canActivate:[AuthGuard]},
  {path:"**",component:HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
