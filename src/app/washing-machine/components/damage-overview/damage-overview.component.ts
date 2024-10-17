import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineDetailDTO } from '../../models/dtos/washing-machine-detail.dto';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-damage-overview',
  templateUrl: './damage-overview.component.html',
  styleUrls: ['./damage-overview.component.css']
})
export class OverviewComponent {

  washingMachineIdentification$:Observable<WashingMachineIdentification> = this._washingMachineService.getWashingMachineIdentification();
  washingMachineDetail$:Observable<WashingMachineDetailDTO> = this._washingMachineService.getWashingMachineDetail(); 
   
  selectedFiles:ImageFile[] = this._washingMachineService.getSelectedFiles();

  constructor(
    @Inject(MatStepper) private stepper: MatStepper,
    private _washingMachineService: WashingMachineService,
    private _notifService: NotificationService,
    private _translate: TranslateService,
  ) { }

  save() {
    this._washingMachineService.save().then(success => {
      if(success) {
        this._notifService.showSuccess(this._translate.instant("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"),4000);
        this.stepper.next();
      }
    });
  }
}
