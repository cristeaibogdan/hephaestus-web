import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SolarPanelComponent } from './components/solar-panel.component';
import { SolarPanelHistoryComponent } from './components/solar-panel-history/solar-panel-history.component';

const routes: Routes = [
  { path: "", component: SolarPanelComponent },
  { path: "history", component: SolarPanelHistoryComponent}
];

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class SolarPanelModule { }
