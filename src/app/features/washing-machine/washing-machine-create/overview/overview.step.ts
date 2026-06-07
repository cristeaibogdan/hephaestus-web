import { Component, inject, Signal } from '@angular/core';
import { WashingMachineCreateService } from '../washing-machine-create.service';
import { Identification } from '../../models/identification.model';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Detail } from '../../models/detail.model';
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

  washingMachineIdentification: Signal<Identification> = this._washingMachineCreateService.getWashingMachineIdentification();
  washingMachineDetail: Signal<Detail> = this._washingMachineCreateService.getWashingMachineDetail();

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
