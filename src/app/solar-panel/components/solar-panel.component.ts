import { Component, inject, Signal } from '@angular/core';
import { SolarPanelIdentificationComponent } from './solar-panel-identification/solar-panel-identification.component';
import { SolarPanelDamageComponent } from './solar-panel-damage/solar-panel-damage.component';
import { SolarPanelOverviewComponent } from './solar-panel-overview/solar-panel-overview.component';
import { SolarPanelRecommendationComponent } from './solar-panel-recommendation/solar-panel-recommendation.component';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoModule } from '@jsverse/transloco';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelService } from '../services/solar-panel.service';

@Component({
  selector: 'app-solar-panel',
  templateUrl: './solar-panel.component.html',
  styleUrls: ['./solar-panel.component.scss'],
  imports: [
    MatStepperModule,
    TranslocoModule,

    SolarPanelIdentificationComponent,
    SolarPanelDamageComponent,
    SolarPanelOverviewComponent,
    SolarPanelRecommendationComponent
  ]
})
export class SolarPanelComponent { 
  private _solarPanelService = inject(SolarPanelService);
  solarPanelIdentification: Signal<SolarPanelIdentification> = this._solarPanelService.getSolarPanelIdentification();
}
