import { Component, Signal, inject } from '@angular/core';
import { SolarPanelCreateService } from "../solar-panel-create.service";
import { Identification } from '../../models/identification.model';
import { SolarPanelApi } from '../../solar-panel.api';
import { Recommendation } from '../../recommendation.enum';
import { MatButtonModule } from '@angular/material/button';
import { OverviewStep } from '../overview/overview.step';
import { TranslocoModule } from '@jsverse/transloco';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.step.html',
  styleUrls: ['./recommendation.step.scss'],
  imports: [
    MatButtonModule,
    RouterLink,
    TranslocoModule,
    StepperButtonsDirective,
    OverviewStep
  ]
})
export class RecommendationStep {
  private _solarPanelCreateService = inject(SolarPanelCreateService);
  private _solarPanelApi = inject(SolarPanelApi);

  solarPanelIdentification: Signal<Identification> = this._solarPanelCreateService.getSolarPanelIdentification();
  solarPanelRecommendation: Recommendation = this._solarPanelCreateService.getRecommendation();

  onDownload() {
    this._solarPanelApi.getReport(this.solarPanelIdentification().serialNumber);
  }

}
