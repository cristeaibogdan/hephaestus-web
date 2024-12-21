import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { WashingMachineService } from '../services/washing-machine.service';
import { WashingMachineIdentification } from '../models/washing-machine-identification.model';

@Component({
    selector: 'app-washing-machine',
    templateUrl: './washing-machine.component.html',
    styleUrls: ['./washing-machine.component.scss'],
    standalone: false
})

export class WashingMachineComponent {
  constructor(   
    private _formBuilder: UntypedFormBuilder, 
    private _washingMachineService: WashingMachineService
  ) {}

  washingMachineIdentification$: Observable<WashingMachineIdentification | null> = this._washingMachineService.getWashingMachineIdentification();

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });  
}
