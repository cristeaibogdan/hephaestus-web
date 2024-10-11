import { Component, Inject } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-solar-panel-overview',
  templateUrl: './solar-panel-overview.component.html',
  styleUrls: ['./solar-panel-overview.component.css']
})
export class SolarPanelOverviewComponent {
  constructor(
    @Inject(MatStepper) private stepper: MatStepper
  ) { }

  navigateToNextStep() {
    this.stepper.next();
  }

  navigateToPreviousStep() {
    this.stepper.previous();
  }
}
