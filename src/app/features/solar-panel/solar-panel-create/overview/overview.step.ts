import { Component, Signal, inject } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SolarPanelCreateService } from "../solar-panel-create.service";
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Identification } from '../../models/identification.model';
import { Damage } from '../../models/damage.model';
import { NotificationService } from "../../../../shared/services/notification.service";
import {StepperButtonsDirective} from "../../../../shared/directives/stepper-buttons.directive";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.step.html',
  styleUrls: ['./overview.step.scss'],
  imports: [
    MatButtonModule,
    MatStepperModule,
    TranslocoModule,
    ReactiveFormsModule,
    StepperButtonsDirective
  ]
})
export class OverviewStep {
  private stepper = inject(MatStepper);
  private _solarPanelCreateService = inject(SolarPanelCreateService);
  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);

  solarPanelIdentification: Signal<Identification> = this._solarPanelCreateService.getSolarPanelIdentification();
  solarPanelDamage: Signal<Damage> = this._solarPanelCreateService.getSolarPanelDamage();

  create(): void {
    this._solarPanelCreateService.create().then(success => {
      if(success) {
        this._notifService.showSuccess(this._translocoService.translate("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"), 4000);
        this.stepper.next();
      }
    });
  }
}
