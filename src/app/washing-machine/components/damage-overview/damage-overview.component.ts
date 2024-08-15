import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WashingMachineDetailsDTO } from 'src/app/components/models/dtos/washing-machine-details.dto';
import { WashingMachineDTO } from 'src/app/components/models/dtos/washing-machine.dto';
import { ImageFile } from 'src/app/components/models/image-file.model';
import { WashingMachineService } from 'src/app/services/washing-machine.service';

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

  save() {
    this._washingMachineService.save();    
  }
}
