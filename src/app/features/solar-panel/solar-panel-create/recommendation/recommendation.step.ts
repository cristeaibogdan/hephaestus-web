import { Component, Signal, inject } from '@angular/core';
import { SolarPanelCreateService } from "../solar-panel-create.service";
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';
import { SolarPanelApi } from '../../solar-panel.api';
import { SolarPanelRecommendation } from '../../solar-panel-recommendation.enum';
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

  solarPanelIdentification: Signal<SolarPanelIdentification> = this._solarPanelCreateService.getSolarPanelIdentification();
  solarPanelRecommendation: SolarPanelRecommendation = this._solarPanelCreateService.getRecommendation();

  onDownload() {
    this._solarPanelApi.getReport(this.solarPanelIdentification().serialNumber);
  }

}
