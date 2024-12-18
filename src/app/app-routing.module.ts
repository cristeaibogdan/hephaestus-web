import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './services/auth-guard.service';
import { CameraComponent } from './washing-machine/components/washing-machine-identification/camera/camera.component';
import { WakeupComponent } from './components/wakeup/wakeup.component';

const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  // { path: '', component: WakeupComponent },
  {
    path: "",
    // canActivate:[AuthGuard],
    children:[
      { path: "home", component: HomeComponent },
      { path: "test", component: CameraComponent},
      
      { // TODO: Refactor the import if you change the packages
        path: "washing-machines", 
        loadChildren: () => import("./washing-machine/washing-machine.module").then(m => m.WashingMachineModule) 
      },

      { // TODO: Refactor the import if you change the packages
        path: "solar-panels", 
        loadChildren: () => import("./solar-panel/solar-panel.module").then(m => m.SolarPanelModule) 
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
