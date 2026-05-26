import { Component, inject, Signal } from '@angular/core';
import { SolarPanelIdentificationComponent } from './identification/solar-panel-identification.component';
import { SolarPanelDamageComponent } from './damage/solar-panel-damage.component';
import { SolarPanelOverviewComponent } from './overview/solar-panel-overview.component';
import { SolarPanelRecommendationComponent } from './recommendation/solar-panel-recommendation.component';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoModule } from '@jsverse/transloco';
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';
import { SolarPanelService } from '../../services/solar-panel.service';

@Component({
  selector: 'app-solar-panel-create',
  templateUrl: './solar-panel-create.page.html',
  styleUrls: ['./solar-panel-create.page.scss'],
  imports: [
    MatStepperModule,
    TranslocoModule,

    SolarPanelIdentificationComponent,
    SolarPanelDamageComponent,
    SolarPanelOverviewComponent,
    SolarPanelRecommendationComponent
  ]
})
export class SolarPanelCreatePage { 
  private _solarPanelService = inject(SolarPanelService);
  solarPanelIdentification: Signal<SolarPanelIdentification> = this._solarPanelService.getSolarPanelIdentification();
}
