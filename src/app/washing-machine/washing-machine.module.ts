import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WashingMachineComponent } from './components/washing-machine.component';
import { WashingMachineDamageComponent } from './components/washing-machine-damage/washing-machine-damage.component';
import { WashingMachineOverviewComponent } from './components/washing-machine-overview/washing-machine-overview.component';
import { WashingMachineRecommendationComponent } from './components/washing-machine-recommendation/washing-machine-recommendation.component';
import { SharedModule } from '../shared/shared.module';
import { WashingMachineIdentificationComponent } from './components/washing-machine-identification/washing-machine-identification.component';
import { WashingMachineHistoryComponent } from './components/washing-machine-history/washing-machine-history.component';
import { WashingMachineHistoryViewComponent } from './components/washing-machine-history/washing-machine-history-view/washing-machine-history-view.component';

const routes: Routes = [
  { path: "", component: WashingMachineComponent },
  { path: "history", component: WashingMachineHistoryComponent }
];

@NgModule({
  declarations: [
    WashingMachineComponent,
    WashingMachineIdentificationComponent,
    WashingMachineDamageComponent,
    WashingMachineOverviewComponent,
    WashingMachineRecommendationComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class WashingMachineModule { }
