import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CameraComponent } from './washing-machine/components/product-identification/camera/camera.component';
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
