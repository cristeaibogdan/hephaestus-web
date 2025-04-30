import { Component, Inject, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DamageResponse } from "../../models/dtos/get-solar-panel-full.response";
import { SolarPanelService } from '../../services/solar-panel.service';
import { CustomValidators } from 'src/app/shared/validators/custom.validators';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslocoModule } from '@jsverse/transloco';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-solar-panel-damage',
  templateUrl: './solar-panel-damage.component.html',
  styleUrls: ['./solar-panel-damage.component.scss'],
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
export class SolarPanelDamageComponent {
  private stepper = inject(MatStepper);
  private fb = inject(NonNullableFormBuilder);
  private _solarPanelService = inject(SolarPanelService);
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
      this._notificationService.showError("At least one damage type has to be selected", 0);
      return;
    }

    const solarPanelDamage: DamageResponse = {
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
