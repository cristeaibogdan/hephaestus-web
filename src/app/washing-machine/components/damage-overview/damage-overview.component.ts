import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineDetailDTO } from '../../models/dtos/washing-machine-detail.dto';
import { CreateWashingMachineRequest } from '../../models/dtos/create-washing-machine-request.dto';
import { WashingMachineService } from '../../services/washing-machine.service';

@Component({
  selector: 'app-damage-overview',
  templateUrl: './damage-overview.component.html',
  styleUrls: ['./damage-overview.component.css']
})
export class OverviewComponent {

  washingMachine$:Observable<CreateWashingMachineRequest> = this._washingMachineService.getWashingMachine();
  washingMachineDetail$:Observable<WashingMachineDetailDTO> = this._washingMachineService.getWashingMachineDetail(); 
   
  selectedFiles:ImageFile[] = this._washingMachineService.getSelectedFiles();

  constructor(private _washingMachineService: WashingMachineService) { }  

  save() {
    this._washingMachineService.save();    
  }
}
