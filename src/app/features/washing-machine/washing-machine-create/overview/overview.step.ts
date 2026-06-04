import { Component, inject, Signal } from '@angular/core';
import { WashingMachineCreateService } from '../washing-machine-create.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WashingMachineDetail } from '../../models/washing-machine-detail.model';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { ToLabelPipe } from 'src/app/shared/pipes/to-label.pipe';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { ImageFile } from '../../models/image-file.model';
import { NotificationService } from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.step.html',
  styleUrls: ['./overview.step.scss'],
  imports: [
    MatButtonModule,
    MatStepperModule,
    TranslocoModule,
    ToLabelPipe,
    StepperButtonsDirective
  ]
})
export class OverviewStep {
  private stepper = inject(MatStepper);
  private _washingMachineCreateService = inject(WashingMachineCreateService);
  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);

  washingMachineIdentification: Signal<WashingMachineIdentification> = this._washingMachineCreateService.getWashingMachineIdentification();
  washingMachineDetail: Signal<WashingMachineDetail> = this._washingMachineCreateService.getWashingMachineDetail();

  selectedFiles:ImageFile[] = this._washingMachineCreateService.getSelectedFiles();

  create(): void {
    this._washingMachineCreateService.create().then(success => {
      if(success) {
        this._notifService.showSuccess(this._translocoService.translate("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"), 4000);
        this.stepper.next();
      }
    });
  }
}
