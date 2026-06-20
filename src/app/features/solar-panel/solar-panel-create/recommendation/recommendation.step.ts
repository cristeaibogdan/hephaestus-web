import { Component, inject } from '@angular/core';
import { SolarPanelCreateService } from "../solar-panel-create.service";
import { SolarPanelApi } from '../../solar-panel.api';
import { Recommendation } from '../../recommendation.enum';
import { MatButtonModule } from '@angular/material/button';
import { OverviewStep } from '../overview/overview.step';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {StepperButtonsDirective} from "../../../../shared/directives/stepper-buttons.directive";

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
  protected readonly _solarPanelCreateService = inject(SolarPanelCreateService);
  private _solarPanelApi = inject(SolarPanelApi);

  solarPanelRecommendation: Recommendation = this._solarPanelCreateService.getRecommendation();

  onDownload() {
    this._solarPanelApi.getReport(this._solarPanelCreateService.identification().serialNumber);
  }

}
