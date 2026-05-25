import { Routes } from '@angular/router';
import { LoginPage } from './authentication/login/login.page';
import { RegisterPage } from './authentication/register/register.page';
import { InitializationFailedPage } from './initialization/initialization-failed/initialization-failed.page';
import { HomePage } from './home/home.page';
import { CameraComponent } from './washing-machine/components/washing-machine-create/identification/camera/camera.component';
import { WashingMachineHistoryPage } from './washing-machine/components/washing-machine-history/washing-machine-history.page';
import { SolarPanelHistoryPage } from './solar-panel/components/solar-panel-history/solar-panel-history.page';
import { WashingMachineCreatePage } from './washing-machine/components/washing-machine-create/washing-machine-create.page';
import { SolarPanelCreatePage } from './solar-panel/components/solar-panel-create/solar-panel-create.page';

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
