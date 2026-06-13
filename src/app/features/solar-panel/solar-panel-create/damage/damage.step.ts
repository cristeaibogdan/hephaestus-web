import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SolarPanelCreateService } from "../solar-panel-create.service";
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Damage } from '../../models/damage.model';
import { NotificationService } from "../../../../shared/services/notification.service";
import {CustomValidators} from "../../../../shared/validators/custom.validators";
import {StepperButtonsDirective} from "../../../../shared/directives/stepper-buttons.directive";

@Component({
  selector: 'app-damage',
  templateUrl: './damage.step.html',
  styleUrls: ['./damage.step.scss'],
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule, // for the directive matStepperPrevious

    ReactiveFormsModule,
    TranslocoModule,
    StepperButtonsDirective
  ]
})
export class DamageStep {
  private stepper = inject(MatStepper);
  private fb = inject(NonNullableFormBuilder);
  private _solarPanelService = inject(SolarPanelCreateService);
  private _notificationService = inject(NotificationService);

  solarPanelDamageForm = this.fb.group({
    hotSpots: [false],
    microCracks: [false],
    snailTrails: [false],
    brokenGlass: [false],
    additionalDetails: [""]
  },{
    validators: CustomValidators.atLeastOneTrueOutOf(
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
      this._notificationService.showError("At least one damage type has to be selected");
      return;
    }

    const solarPanelDamage: Damage = {
      hotSpots: this.solarPanelDamageForm.controls.hotSpots.value,
      microCracks: this.solarPanelDamageForm.controls.microCracks.value,
      snailTrails: this.solarPanelDamageForm.controls.snailTrails.value,
      brokenGlass: this.solarPanelDamageForm.controls.brokenGlass.value,
      additionalDetails: this.solarPanelDamageForm.controls.additionalDetails.value
    }

    this._solarPanelService.setSolarPanelDamage(solarPanelDamage);
    this.stepper.next();
  }
}
