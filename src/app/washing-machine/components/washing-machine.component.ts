import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { WashingMachineService } from '../services/washing-machine.service';
import { WashingMachineIdentification } from '../models/washing-machine-identification.model';

@Component({
  selector: 'app-washing-machine',
  templateUrl: './washing-machine.component.html',
  styleUrls: ['./washing-machine.component.css']
})

export class WashingMachineComponent implements AfterViewInit {
  constructor(   
    private _formBuilder: UntypedFormBuilder, 
    private _washingMachineService: WashingMachineService
  ) {}
  
  // Property from the HTML template, sent to the service via ngAfterViewInit
  @ViewChild(MatStepper) stepper!: MatStepper;

  washingMachineIdentification$:Observable<WashingMachineIdentification> = this._washingMachineService.getWashingMachineIdentification();

  ngAfterViewInit() {
    this._washingMachineService.setStepper(this.stepper);
  }

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
