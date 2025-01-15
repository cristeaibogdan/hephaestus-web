import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SolarPanelIdentificationComponent } from './components/solar-panel-identification/solar-panel-identification.component';
import { SolarPanelDamageComponent } from './components/solar-panel-damage/solar-panel-damage.component';
import { SolarPanelOverviewComponent } from './components/solar-panel-overview/solar-panel-overview.component';
import { SolarPanelRecommendationComponent } from './components/solar-panel-recommendation/solar-panel-recommendation.component';
import { SolarPanelComponent } from './components/solar-panel.component';
import { SolarPanelHistoryComponent } from './components/solar-panel-history/solar-panel-history.component';

const routes: Routes = [
  { path: "", component: SolarPanelComponent },
  { path: "history", component: SolarPanelHistoryComponent}
];

@NgModule({
  declarations: [
    SolarPanelComponent,
    SolarPanelIdentificationComponent,
    SolarPanelDamageComponent,
    SolarPanelOverviewComponent,
    SolarPanelRecommendationComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class SolarPanelModule { }
