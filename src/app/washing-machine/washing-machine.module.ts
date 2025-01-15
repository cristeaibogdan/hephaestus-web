import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WashingMachineComponent } from './components/washing-machine.component';
import { SharedModule } from '../shared/shared.module';
import { WashingMachineHistoryComponent } from './components/washing-machine-history/washing-machine-history.component';

const routes: Routes = [
  { path: "", component: WashingMachineComponent },
  { path: "history", component: WashingMachineHistoryComponent }
];

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class WashingMachineModule { }
