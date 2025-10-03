import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineService } from '../../services/washing-machine.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WashingMachineDetail } from '../../models/washing-machine-detail.model';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { PricingFormComponent } from './pricing-form/pricing-form.component';
import { PackageFormComponent } from './package-damage-form/package-form.component';
import { VisibleSurfacesFormComponent } from './visible-surfaces-form/visible-surfaces-form.component';
import { HiddenSurfacesFormComponent } from './hidden-surfaces-form/hidden-surfaces-form.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-washing-machine-damage',
  templateUrl: './washing-machine-damage.component.html',
  styleUrls: ['./washing-machine-damage.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    TranslocoModule,
    ReactiveFormsModule,
    StepperButtonsDirective,
    FileUploadComponent,
    PackageFormComponent,
    VisibleSurfacesFormComponent,
    HiddenSurfacesFormComponent,
    PricingFormComponent
]
})
export class WashingMachineDamageComponent {  
  private stepper = inject(MatStepper);
  private fb = inject(NonNullableFormBuilder);
  private _washingMachineService = inject(WashingMachineService);
  private _notifService = inject(NotificationService);
  
  washingMachineDetailForm = this.fb.group({
    applicablePackageDamage: [false],
    packageForm : this.fb.group({
      damaged : [false],
      dirty : [false],
      packageMaterialAvailable : [false],
    }, {validators: CustomValidators.atLeastOneTrueOutOf(
      "damaged", 
      "dirty", 
      "packageMaterialAvailable")}
    ),
    

    applicableVisibleSurfacesDamage: [false],
    visibleSurfacesForm: this.fb.group({
      hasScratches: [false],
      scratchesLength: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hasDents: [false],
      dentsDepth: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hasMinorDamage: [false],
      minorDamage : [{value:"", disabled: true},
        [Validators.required]
      ],

      hasMajorDamage: [false],
      majorDamage : [{value:"", disabled: true},
        [Validators.required]
      ]
    }, {validators: CustomValidators.atLeastOneTrueOutOf(
      "hasScratches",
      "hasDents",
      "hasMinorDamage",
      "hasMajorDamage")}
    ),


    applicableHiddenSurfacesDamage: [false],
    hiddenSurfacesForm: this.fb.group({
      hasScratches: [false],
      scratchesLength: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hasDents: [false],
      dentsDepth: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hasMinorDamage: [false],
      minorDamage : [{value:"", disabled: true},
        [Validators.required]
      ],

      hasMajorDamage: [false],
      majorDamage : [{value:"", disabled: true},
        [Validators.required]
      ]
    }, {validators: CustomValidators.atLeastOneTrueOutOf(
        "hasScratches",
        "hasDents",
        "hasMinorDamage",
        "hasMajorDamage")}
    ),
  }, {validators: CustomValidators.atLeastOneTrueOutOf(
      "applicablePackageDamage",
      "applicableVisibleSurfacesDamage",
      "applicableHiddenSurfacesDamage")}
  );

  washingMachinePricingForm = this.fb.group({
    price : [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    repairPrice : [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
  }, {validators: CustomValidators.minimumLowerThanMaximum(
    "repairPrice",
    "price")}
  );

  selectedImages: FormControl<ImageFile[]> = this.fb.control([], [Validators.required]);

// *******************************
// *** FORM RESET AND SUBMIT
// *******************************

  onReset(e:Event): void {
    e.preventDefault();
    this.washingMachinePricingForm.reset();
    this.selectedImages.reset();
  }

  onSubmit(): void {
    if(this.selectedImages.value.length === 0) {
      this._notifService.showError("At least one image must be uploaded", 0);
      return;
    }

    if(this.washingMachineDetailForm.invalid) {
      this._notifService.showError("At least one applicable damage must be selected", 0);
      return;
    }

    if(this.washingMachinePricingForm.invalid) {
      return;
    }

    const washingMachineDetail: WashingMachineDetail = {
      applicablePackageDamage: this.washingMachineDetailForm.controls.applicablePackageDamage.value,
      packageDamaged: this.washingMachineDetailForm.controls.packageForm.controls.damaged.value,
      packageDirty: this.washingMachineDetailForm.controls.packageForm.controls.dirty.value,
      packageMaterialAvailable: this.washingMachineDetailForm.controls.packageForm.controls.packageMaterialAvailable.value,


      applicableVisibleSurfacesDamage: this.washingMachineDetailForm.controls.applicableVisibleSurfacesDamage.value,

      visibleSurfacesHasScratches: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.hasScratches.value,
      visibleSurfacesScratchesLength: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.scratchesLength.value,

      visibleSurfacesHasDents: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.hasDents.value,
      visibleSurfacesDentsDepth: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.dentsDepth.value,

      visibleSurfacesHasMinorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.hasMinorDamage.value,
      visibleSurfacesMinorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.minorDamage.value,

      visibleSurfacesHasMajorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.hasMajorDamage.value,
      visibleSurfacesMajorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.majorDamage.value,


      applicableHiddenSurfacesDamage: this.washingMachineDetailForm.controls.applicableHiddenSurfacesDamage.value,

      hiddenSurfacesHasScratches: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hasScratches.value,
      hiddenSurfacesScratchesLength: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.scratchesLength.value,

      hiddenSurfacesHasDents: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hasDents.value,
      hiddenSurfacesDentsDepth: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.dentsDepth.value,

      hiddenSurfacesHasMinorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hasMinorDamage.value,
      hiddenSurfacesMinorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.minorDamage.value,

      hiddenSurfacesHasMajorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hasMajorDamage.value,
      hiddenSurfacesMajorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.majorDamage.value,

      price: this.washingMachinePricingForm.controls.price.value,
      repairPrice: this.washingMachinePricingForm.controls.repairPrice.value
    };

    this._washingMachineService.setWashingMachineDetail(washingMachineDetail);
    this._washingMachineService.setSelectedFiles(this.selectedImages.value);
    this.stepper.next();
    // console.log("Sent = ", washingMachineDetail);
    // TODO: Restructure the DTO into nested DTOs - package, visible, hidden, costAssessment
    console.log(this._washingMachineService.getSelectedFiles());
  }
}