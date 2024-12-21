import { Component, Inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { SolarPanelDamage } from '../../models/solar-panel-damage.model';
import { SolarPanelService } from '../../services/solar-panel.service';
import { CustomValidators } from 'src/app/shared/validators/custom.validators';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-solar-panel-damage',
    templateUrl: './solar-panel-damage.component.html',
    styleUrls: ['./solar-panel-damage.component.scss'],
    standalone: false
})
export class SolarPanelDamageComponent {

  constructor(
    @Inject(MatStepper) private stepper: MatStepper,
    private fb: NonNullableFormBuilder,
    private _solarPanelService: SolarPanelService,
    private _notificationService: NotificationService
  ) { }

  solarPanelDamageForm = this.fb.group({    
    hotSpots: [false],
    microCracks: [false],
    snailTrails: [false],
    brokenGlass: [false],
    additionalDetails: [""]
  },{
    validators: CustomValidators.atLeastOneOutOfFourTrue(
    "hotSpots",
    "microCracks",
    "snailTrails",
    "brokenGlass"
    )
  });

  charactersMaxLimit: number = 200;

// *******************************
// *** FORM RESET AND SUBMIT
// *******************************

  onSubmit() {
    if(this.solarPanelDamageForm.invalid) {
      this._notificationService.showError("At least one damage type has to be selected", 0);
      return;
    }

    const solarPanelDamage: SolarPanelDamage = {
      hotSpots: this.solarPanelDamageForm.value.hotSpots!,
      microCracks: this.solarPanelDamageForm.value.microCracks!,
      snailTrails: this.solarPanelDamageForm.value.snailTrails!,
      brokenGlass: this.solarPanelDamageForm.value.brokenGlass!,
      additionalDetails: this.solarPanelDamageForm.value.additionalDetails!
    }

    this._solarPanelService.setSolarPanelDamage(solarPanelDamage);
    this.stepper.next();
  }
}
