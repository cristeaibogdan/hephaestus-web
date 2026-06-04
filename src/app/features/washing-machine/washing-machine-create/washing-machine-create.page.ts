import { Component, inject, Signal } from '@angular/core';
import { UntypedFormBuilder, Validators} from '@angular/forms';
import { WashingMachineCreateService } from './washing-machine-create.service';
import { WashingMachineIdentification } from '../models/washing-machine-identification.model';
import { IdentificationStep } from './identification/identification.step';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatStepperModule } from '@angular/material/stepper';
import { DamageStep } from './damage/damage.step';
import { RecommendationStep } from './recommendation/recommendation.step';
import { OverviewStep } from './overview/overview.step';
import { ToLabelPipe } from 'src/app/shared/pipes/to-label.pipe';

@Component({
  selector: 'app-washing-machine-create',
  templateUrl: './washing-machine-create.page.html',
  styleUrls: ['./washing-machine-create.page.scss'],
  imports: [
    MatButtonModule,
    MatStepperModule,

    CommonModule,
    TranslocoModule,
    IdentificationStep,
    DamageStep,
    OverviewStep,
    RecommendationStep,
    ToLabelPipe
  ]
})

export class WashingMachineCreatePage {
  private _formBuilder = inject(UntypedFormBuilder);
  private _washingMachineCreateService = inject(WashingMachineCreateService);

  washingMachineIdentification: Signal<WashingMachineIdentification> = this._washingMachineCreateService.getWashingMachineIdentification();

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
