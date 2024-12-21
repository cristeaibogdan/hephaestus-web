import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { MatStepper } from '@angular/material/stepper';
import { NotificationService } from 'src/app/services/notification.service';
import { WashingMachineDetail } from '../../models/washing-machine-detail.model';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-washing-machine-overview',
    templateUrl: './washing-machine-overview.component.html',
    styleUrls: ['./washing-machine-overview.component.scss'],
    standalone: false
})
export class WashingMachineOverviewComponent {

  washingMachineIdentification$:Observable<WashingMachineIdentification | null> = this._washingMachineService.getWashingMachineIdentification();
  washingMachineDetail$:Observable<WashingMachineDetail | null> = this._washingMachineService.getWashingMachineDetail(); 
   
  selectedFiles:ImageFile[] = this._washingMachineService.getSelectedFiles();

  constructor(
    @Inject(MatStepper) private stepper: MatStepper,
    private _washingMachineService: WashingMachineService,
    private _notifService: NotificationService,
    private _translocoService: TranslocoService,
  ) { }

  save(): void {
    this._washingMachineService.save().then(success => {
      if(success) {
        this._notifService.showSuccess(this._translocoService.translate("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"),4000);
        this.stepper.next();
      }
    });
  }
}
