import { Component } from '@angular/core';
import { SolarPanelIdentificationComponent } from './solar-panel-identification/solar-panel-identification.component';
import { SolarPanelDamageComponent } from './solar-panel-damage/solar-panel-damage.component';
import { SolarPanelOverviewComponent } from './solar-panel-overview/solar-panel-overview.component';
import { SolarPanelRecommendationComponent } from './solar-panel-recommendation/solar-panel-recommendation.component';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-solar-panel',
  templateUrl: './solar-panel.component.html',
  styleUrls: ['./solar-panel.component.scss'],
  imports: [
    MatStepperModule,

    SolarPanelIdentificationComponent,
    SolarPanelDamageComponent,
    SolarPanelOverviewComponent,
    SolarPanelRecommendationComponent
  ]
})
export class SolarPanelComponent { }
