import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WashingMachineService } from 'src/app/services/washing-machine.service';
import { WashingMachineDTO } from '../../models/dtos/washing-machine.dto';
import { ImageFile } from '../../models/image-file.model';
import { WashingMachineDetailsDTO } from '../../models/dtos/washing-machine-details.dto';

@Component({
  selector: 'app-damage-overview',
  templateUrl: './damage-overview.component.html',
  styleUrls: ['./damage-overview.component.css']
})
export class OverviewComponent {

  washingMachine$:Observable<WashingMachineDTO> = this._washingMachineService.getWashingMachine();
  washingMachineDetails$:Observable<WashingMachineDetailsDTO> = this._washingMachineService.getWashingMachineDetails(); 
   
  selectedFiles:ImageFile[] = this._washingMachineService.getSelectedFiles();

  constructor(private _washingMachineService: WashingMachineService) { }  

  saveWashingMachine() {
    this._washingMachineService.saveWashingMachine();    
  }
}
