import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineDetailDTO } from '../../models/dtos/washing-machine-detail.dto';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';

@Component({
  selector: 'app-damage-overview',
  templateUrl: './damage-overview.component.html',
  styleUrls: ['./damage-overview.component.css']
})
export class OverviewComponent {

  washingMachineIdentification$:Observable<WashingMachineIdentification> = this._washingMachineService.getWashingMachineIdentification();
  washingMachineDetail$:Observable<WashingMachineDetailDTO> = this._washingMachineService.getWashingMachineDetail(); 
   
  selectedFiles:ImageFile[] = this._washingMachineService.getSelectedFiles();

  constructor(private _washingMachineService: WashingMachineService) { }  

  save() {
    this._washingMachineService.save();    
  }
}
