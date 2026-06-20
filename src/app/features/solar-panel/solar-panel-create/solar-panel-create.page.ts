import { Component, inject } from '@angular/core';
import { IdentificationStep } from './identification/identification.step';
import { DamageStep } from './damage/damage.step';
import { OverviewStep } from './overview/overview.step';
import { RecommendationStep } from './recommendation/recommendation.step';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoModule } from '@jsverse/transloco';
import { SolarPanelCreateService } from "./solar-panel-create.service";

@Component({
  selector: 'app-solar-panel-create',
  templateUrl: './solar-panel-create.page.html',
  styleUrls: ['./solar-panel-create.page.scss'],
  imports: [
    MatStepperModule,
    TranslocoModule,

    IdentificationStep,
    DamageStep,
    OverviewStep,
    RecommendationStep
  ]
})
export class SolarPanelCreatePage {
  protected readonly _solarPanelCreateService = inject(SolarPanelCreateService);
}
