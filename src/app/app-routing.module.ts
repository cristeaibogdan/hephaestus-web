import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './components/washing-machine/product-identification/camera/camera.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HistoryComponent } from './components/shared/history/history.component';
import { WashingMachineComponent } from './components/washing-machine/washing-machine.component';

import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },  
  {
    path: "",
    // canActivate:[AuthGuard],
    children:[
      { path: "home", component: HomeComponent },
      { path: "washing-machines", component: WashingMachineComponent },
      { path: "history", component: HistoryComponent },
      { path: "test", component: CameraComponent},
      { path: "", redirectTo: "/home", pathMatch: "full" }
    ]
  },
  { path: "**", redirectTo: "/home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
