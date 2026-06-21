import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WashingMachineCreateService } from '../washing-machine-create.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Damage } from '../../models/detail.model';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { PricingFormComponent } from './pricing-form/pricing-form.component';
import { PackageFormComponent } from './package-damage-form/package-form.component';
import { VisibleSurfacesFormComponent } from './visible-surfaces-form/visible-surfaces-form.component';
import { HiddenSurfacesFormComponent } from './hidden-surfaces-form/hidden-surfaces-form.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CustomValidators } from 'src/app/shared/validators/custom.validators';
import { ImageFile } from '../../models/image-file.model';
import {NotificationService} from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-damage',
  templateUrl: './damage.step.html',
  styleUrls: ['./damage.step.scss'],
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
export class DamageStep {
  private stepper = inject(MatStepper);
  private fb = inject(NonNullableFormBuilder);
  private _washingMachineCreateService = inject(WashingMachineCreateService);
  private _notifService = inject(NotificationService);

  washingMachineDamageForm = this.fb.group({
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

  selectedImages = signal<ImageFile[]>([]);

// *******************************
// *** FORM RESET AND SUBMIT
// *******************************

  onReset(e:Event): void {
    e.preventDefault();
    this.washingMachinePricingForm.reset();
    this.selectedImages.set([]);
  }

  onSubmit(): void {
    if(this.selectedImages().length === 0) {
      this._notifService.showError("At least one image must be uploaded");
      return;
    }

    if(this.washingMachineDamageForm.invalid) {
      this._notifService.showError("At least one applicable damage must be selected");
      return;
    }

    if(this.washingMachinePricingForm.invalid) {
      return;
    }

    const damage: Damage = {
      applicablePackageDamage: this.washingMachineDamageForm.controls.applicablePackageDamage.value,
      packageDamaged: this.washingMachineDamageForm.controls.packageForm.controls.damaged.value,
      packageDirty: this.washingMachineDamageForm.controls.packageForm.controls.dirty.value,
      packageMaterialAvailable: this.washingMachineDamageForm.controls.packageForm.controls.packageMaterialAvailable.value,


      applicableVisibleSurfacesDamage: this.washingMachineDamageForm.controls.applicableVisibleSurfacesDamage.value,

      visibleSurfacesHasScratches: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.hasScratches.value,
      visibleSurfacesScratchesLength: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.scratchesLength.value,

      visibleSurfacesHasDents: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.hasDents.value,
      visibleSurfacesDentsDepth: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.dentsDepth.value,

      visibleSurfacesHasMinorDamage: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.hasMinorDamage.value,
      visibleSurfacesMinorDamage: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.minorDamage.value,

      visibleSurfacesHasMajorDamage: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.hasMajorDamage.value,
      visibleSurfacesMajorDamage: this.washingMachineDamageForm.controls.visibleSurfacesForm.controls.majorDamage.value,


      applicableHiddenSurfacesDamage: this.washingMachineDamageForm.controls.applicableHiddenSurfacesDamage.value,

      hiddenSurfacesHasScratches: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.hasScratches.value,
      hiddenSurfacesScratchesLength: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.scratchesLength.value,

      hiddenSurfacesHasDents: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.hasDents.value,
      hiddenSurfacesDentsDepth: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.dentsDepth.value,

      hiddenSurfacesHasMinorDamage: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.hasMinorDamage.value,
      hiddenSurfacesMinorDamage: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.minorDamage.value,

      hiddenSurfacesHasMajorDamage: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.hasMajorDamage.value,
      hiddenSurfacesMajorDamage: this.washingMachineDamageForm.controls.hiddenSurfacesForm.controls.majorDamage.value,

      price: this.washingMachinePricingForm.controls.price.value,
      repairPrice: this.washingMachinePricingForm.controls.repairPrice.value
    };

    this._washingMachineCreateService.setDamage(damage);
    this._washingMachineCreateService.setSelectedFiles(this.selectedImages());
    this.stepper.next();
    // console.log("Sent = ", damage);
    // TODO: Restructure the DTO into nested DTOs - package, visible, hidden, costAssessment
    console.log(this._washingMachineCreateService.selectedFiles());
  }
}
