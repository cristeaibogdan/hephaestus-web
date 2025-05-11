import { Component, Signal, inject } from '@angular/core';
import { SolarPanelService } from '../../services/solar-panel.service';
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';
import { SolarPanelDataService } from '../../services/solar-panel-data.service';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';
import { MatButtonModule } from '@angular/material/button';
import { SolarPanelOverviewComponent } from '../solar-panel-overview/solar-panel-overview.component';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solar-panel-recommendation',
  templateUrl: './solar-panel-recommendation.component.html',
  styleUrls: ['./solar-panel-recommendation.component.scss'],
  imports: [
    MatButtonModule,

    RouterLink,
    CommonModule,
    TranslocoModule,
    StepperButtonsDirective,
    SolarPanelOverviewComponent
  ]
})
export class SolarPanelRecommendationComponent {
  private _solarPanelService = inject(SolarPanelService);
  private _solarPanelDataService = inject(SolarPanelDataService);

  solarPanelIdentification$: Signal<SolarPanelIdentification> = this._solarPanelService.getSolarPanelIdentification();
  solarPanelRecommendation: SolarPanelRecommendation = this._solarPanelService.getRecommendation();;

  onDownload() {
    this._solarPanelDataService.getReport(this.solarPanelIdentification$().serialNumber);
  }

}
