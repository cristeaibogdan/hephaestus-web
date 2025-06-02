import { Component, inject, Signal } from '@angular/core';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NotificationService } from 'src/app/services/notification.service';
import { WashingMachineDetail } from '../../models/washing-machine-detail.model';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ToLabelPipe } from 'src/app/shared/pipes/to-label.pipe';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';

@Component({
    selector: 'app-washing-machine-overview',
    templateUrl: './washing-machine-overview.component.html',
    styleUrls: ['./washing-machine-overview.component.scss'],
    imports: [
      MatButtonModule,
      MatStepperModule, // for the directive matStepperPrevious

      CommonModule,
      TranslocoModule,
      ToLabelPipe,
      StepperButtonsDirective
    ]
})
export class WashingMachineOverviewComponent {
  private stepper = inject(MatStepper);
  private _washingMachineService = inject(WashingMachineService);
  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);

  washingMachineIdentification: Signal<WashingMachineIdentification> = this._washingMachineService.getWashingMachineIdentification();
  washingMachineDetail: Signal<WashingMachineDetail> = this._washingMachineService.getWashingMachineDetail(); 
   
  selectedFiles:ImageFile[] = this._washingMachineService.getSelectedFiles();

  create(): void {
    this._washingMachineService.create().then(success => {
      if(success) {
        this._notifService.showSuccess(this._translocoService.translate("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"), 4000);
        this.stepper.next();
      }
    });
  }
}
