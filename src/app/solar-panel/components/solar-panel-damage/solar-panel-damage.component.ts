import { Component, Inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { SolarPanelDamage } from '../../models/solar-panel-damage.model';
import { SolarPanelService } from '../../services/solar-panel.service';

@Component({
  selector: 'app-solar-panel-damage',
  templateUrl: './solar-panel-damage.component.html',
  styleUrls: ['./solar-panel-damage.component.css']
})
export class SolarPanelDamageComponent {

  constructor(
    @Inject(MatStepper) private stepper: MatStepper,
    private fb: NonNullableFormBuilder,
    private _solarPanelService: SolarPanelService
  ) { }

  solarPanelDamageForm = this.fb.group({    
    hotSpots: [false],
    microCracks: [false],
    snailTrails: [false],
    brokenGlass: [false],
    additionalDetails: [""]
  });

  charactersMaxLimit: number = 200;

// *******************************
// *** FORM RESET AND SUBMIT
// *******************************

  onSubmit() {
    if(this.solarPanelDamageForm.invalid) {
      return;
    }

    const solarPanelDamage: SolarPanelDamage = {
      hotSpots: this.solarPanelDamageForm.value.hotSpots!,
      microCracks: this.solarPanelDamageForm.value.microCracks!,
      snailTrails: this.solarPanelDamageForm.value.snailTrails!,
      brokenGlass: this.solarPanelDamageForm.value.brokenGlass!,
      additionalDetails: this.solarPanelDamageForm.value.additionalDetails!
    }

    this._solarPanelService.setSolarPanelDamageValues(solarPanelDamage);
    this.stepper.next();
  }


// *****************************************
// *** STEPPER FUNCTIONALITY
// *****************************************

  navigateToPreviousStep() {
    this.stepper.previous();
  }
}
