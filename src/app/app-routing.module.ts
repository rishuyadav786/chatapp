import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import{AuthGuard} from './auth.guard';
const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"chat",component:ChatComponent,canActivate:[AuthGuard] },
  {path:"home",component:HomeComponent},
  {path:"**",component:HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
