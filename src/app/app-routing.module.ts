import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './components/washing-machine/product-identification/camera/camera.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HistoryComponent } from './shared/components/history/history.component';

import { AuthGuard } from './services/auth-guard.service';

const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },  
  {
    path: "",
    // canActivate:[AuthGuard],
    children:[
      { path: "home", component: HomeComponent },
      { path: "history", component: HistoryComponent },
      { path: "test", component: CameraComponent},
      
      { // TODO: Refactor the import if you change the packages
        path: "washing-machines", 
        loadChildren: () => import("./components/washing-machine/washing-machine.module").then(m => m.WashingMachineModule) 
      },

      { path: "", redirectTo: "/home", pathMatch: "full" }
    ]
  },
  { path: "**", redirectTo: "/home" }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
