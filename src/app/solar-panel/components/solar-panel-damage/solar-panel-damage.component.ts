import { Component, Inject } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-solar-panel-damage',
  templateUrl: './solar-panel-damage.component.html',
  styleUrls: ['./solar-panel-damage.component.css']
})
export class SolarPanelDamageComponent {

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
