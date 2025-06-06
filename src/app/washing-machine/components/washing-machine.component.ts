import { Component, inject, Signal } from '@angular/core';
import { UntypedFormBuilder, Validators} from '@angular/forms';
import { WashingMachineService } from '../services/washing-machine.service';
import { WashingMachineIdentification } from '../models/washing-machine-identification.model';
import { WashingMachineIdentificationComponent } from './washing-machine-identification/washing-machine-identification.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatStepperModule } from '@angular/material/stepper';
import { WashingMachineDamageComponent } from './washing-machine-damage/washing-machine-damage.component';
import { WashingMachineRecommendationComponent } from './washing-machine-recommendation/washing-machine-recommendation.component';
import { WashingMachineOverviewComponent } from './washing-machine-overview/washing-machine-overview.component';
import { ToLabelPipe } from 'src/app/shared/pipes/to-label.pipe';

@Component({
  selector: 'app-washing-machine',
  templateUrl: './washing-machine.component.html',
  styleUrls: ['./washing-machine.component.scss'],
  imports: [
    MatButtonModule,
    MatStepperModule,

    CommonModule,
    TranslocoModule,
    WashingMachineIdentificationComponent,
    WashingMachineDamageComponent,
    WashingMachineOverviewComponent,
    WashingMachineRecommendationComponent,
    ToLabelPipe
  ]
})

export class WashingMachineComponent {
  private _formBuilder = inject(UntypedFormBuilder);
  private _washingMachineService = inject(WashingMachineService);

  washingMachineIdentification: Signal<WashingMachineIdentification> = this._washingMachineService.getWashingMachineIdentification();

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
