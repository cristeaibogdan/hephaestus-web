import { Routes } from '@angular/router';
import { LoginPage } from './features/authentication/login/login.page';
import { RegisterPage } from './features/authentication/register/register.page';
import { InitializationFailedPage } from './features/initialization/initialization-failed/initialization-failed.page';
import { HomePage } from './features/home/home.page';
import { SolarPanelCreatePage } from './features/solar-panel/components/solar-panel-create/solar-panel-create.page';
import { SolarPanelHistoryPage } from './features/solar-panel/components/solar-panel-history/solar-panel-history.page';
import { CameraComponent } from './features/washing-machine/components/washing-machine-create/identification/camera/camera.component';
import { WashingMachineCreatePage } from './features/washing-machine/components/washing-machine-create/washing-machine-create.page';
import { WashingMachineHistoryPage } from './features/washing-machine/components/washing-machine-history/washing-machine-history.page';

export const routes: Routes = [
  { path: "login", component: LoginPage },
  { path: "register", component: RegisterPage },
  { path: 'initialization-fail', component: InitializationFailedPage },
  {
    path: "",
    // canActivate:[AuthGuard],
    children:[
      { path: "home", component: HomePage },
      { path: "test", component: CameraComponent},      
      {
        path: "washing-machines", 
        children:[
          { path: "", component: WashingMachineCreatePage },
          { path: "history", component: WashingMachineHistoryPage }
        ]
      },
      {
        path: "solar-panels", 
        children:[
          { path: "", component: SolarPanelCreatePage },
          { path: "history", component: SolarPanelHistoryPage }
        ]
      },
      { path: "", redirectTo: "/home", pathMatch: "full" }
    ]
  },
  { path: "**", redirectTo: "/home" }
];
