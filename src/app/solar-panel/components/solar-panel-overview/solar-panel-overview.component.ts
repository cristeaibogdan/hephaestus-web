import { Component, Inject } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { SolarPanelService } from '../../services/solar-panel.service';

@Component({
  selector: 'app-solar-panel-overview',
  templateUrl: './solar-panel-overview.component.html',
  styleUrls: ['./solar-panel-overview.component.css']
})
export class SolarPanelOverviewComponent {

  constructor(
    @Inject(MatStepper) private stepper: MatStepper,
    private _solarPanelService: SolarPanelService
  ) { }

  solarPanelIdenfitication$ = this._solarPanelService.getSolarPanelIdentification();
  solarPanelDamage = this._solarPanelService.getSolarPanelDamageValues();

  navigateToNextStep() {
    this.stepper.next();
  }

  navigateToPreviousStep() {
    this.stepper.previous();
  }
}
