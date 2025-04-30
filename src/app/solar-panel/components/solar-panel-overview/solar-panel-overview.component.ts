import { Component, Signal, inject } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SolarPanelService } from '../../services/solar-panel.service';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { NotificationService } from 'src/app/services/notification.service';
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';
import { DamageResponse } from "../../models/dtos/get-solar-panel-full.response";

@Component({
  selector: 'app-solar-panel-overview',
  templateUrl: './solar-panel-overview.component.html',
  styleUrls: ['./solar-panel-overview.component.scss'],
  imports: [
    MatButtonModule,
    MatStepperModule, // for the directive matStepperPrevious
    
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    StepperButtonsDirective
  ]
})
export class SolarPanelOverviewComponent {
  private stepper = inject(MatStepper);
  private _solarPanelService = inject(SolarPanelService);
  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);

  solarPanelIdentification$: Signal<SolarPanelIdentification> = this._solarPanelService.getSolarPanelIdentification();
  solarPanelDamage$: Signal<DamageResponse> = this._solarPanelService.getSolarPanelDamage();

  save(): void {
    this._solarPanelService.save().then(success => {
      if(success) {
        this._notifService.showSuccess(this._translocoService.translate("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"), 4000);
        this.stepper.next();
      }
    });
  }
}
