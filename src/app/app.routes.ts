import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InitializationFailComponent } from './components/initialization-fail/initialization-fail.component';
import { HomeComponent } from './components/home/home.component';
import { CameraComponent } from './washing-machine/components/washing-machine-identification/camera/camera.component';
import { WashingMachineHistoryComponent } from './washing-machine/components/washing-machine-history/washing-machine-history.component';
import { SolarPanelHistoryComponent } from './solar-panel/components/solar-panel-history/solar-panel-history.component';
import { WashingMachineComponent } from './washing-machine/components/washing-machine.component';
import { SolarPanelComponent } from './solar-panel/components/solar-panel.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: 'initialization-fail', component: InitializationFailComponent },
  {
    path: "",
    // canActivate:[AuthGuard],
    children:[
      { path: "home", component: HomeComponent },
      { path: "test", component: CameraComponent},      
      {
        path: "washing-machines", 
        children:[
          { path: "", component: WashingMachineComponent },
          { path: "history", component: WashingMachineHistoryComponent }
        ]
      },
      {
        path: "solar-panels", 
        children:[
          { path: "", component: SolarPanelComponent },
          { path: "history", component: SolarPanelHistoryComponent }
        ]
      },
      { path: "", redirectTo: "/home", pathMatch: "full" }
    ]
  },
  { path: "**", redirectTo: "/home" }
];
