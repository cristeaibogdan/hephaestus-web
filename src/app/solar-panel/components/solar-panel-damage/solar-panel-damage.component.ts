import { Component, Inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-solar-panel-damage',
  templateUrl: './solar-panel-damage.component.html',
  styleUrls: ['./solar-panel-damage.component.css']
})
export class SolarPanelDamageComponent {

  constructor(
    @Inject(MatStepper) private stepper: MatStepper,
    private fb: NonNullableFormBuilder,
  ) { }

  solarPanelDamageForm = this.fb.group({    
    hotSpots: [false],
    microCracks: [false],
    snailTrails: [false],
    brokenGlass: [false],
    additionalDetails: [""]
  });

// *****************************************
// *** FORM FUNCTIONALITY
// *****************************************



// *****************************************
// *** STEPPER FUNCTIONALITY
// *****************************************

  navigateToNextStep() {
    this.stepper.next();
  }

  navigateToPreviousStep() {
    this.stepper.previous();
  }
}
