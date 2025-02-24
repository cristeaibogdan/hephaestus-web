import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineService } from '../../services/washing-machine.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WashingMachineDetail } from '../../models/washing-machine-detail.model';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { DragAndDropDirective } from 'src/app/shared/directives/drag-and-drop.directive';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { PricingFormComponent } from './pricing-form/pricing-form.component';
import { PackageFormComponent } from './package-damage-form/package-form.component';
import { VisibleSurfacesFormComponent } from './visible-surfaces-form/visible-surfaces-form.component';
import { HiddenSurfacesFormComponent } from './hidden-surfaces-form/hidden-surfaces-form.component';

@Component({
  selector: 'app-washing-machine-damage',
  templateUrl: './washing-machine-damage.component.html',
  styleUrls: ['./washing-machine-damage.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatStepperModule, // for the directive matStepperPrevious

    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    DragAndDropDirective,
    StepperButtonsDirective,

    PricingFormComponent,
    PackageFormComponent,
    VisibleSurfacesFormComponent,
    HiddenSurfacesFormComponent
  ]
})
export class WashingMachineDamageComponent {  
  private stepper = inject(MatStepper);
  private fb = inject(NonNullableFormBuilder);
  private _washingMachineService = inject(WashingMachineService);
  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);
  private sanitizer = inject(DomSanitizer);
  
  washingMachineDetailForm = this.fb.group({
    applicablePackageDamage: [false],
    packageForm : this.fb.group({
      packageDamaged : [false],
      packageDirty : [false],
      packageMaterialAvailable : [false],
    }, {validators: CustomValidators.atLeastOneTrueOutOf(
      "packageDamaged", 
      "packageDirty", 
      "packageMaterialAvailable")}
    ),
    

    applicableVisibleSurfacesDamage: [false],
    visibleSurfacesForm: this.fb.group({
      visibleSurfacesHasScratches: [false],
      visibleSurfacesScratchesLength: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      visibleSurfacesHasDents: [false],
      visibleSurfacesDentsDepth: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      visibleSurfacesHasMinorDamage: [false],
      visibleSurfacesMinorDamage : [{value:"", disabled: true},
        [Validators.required]
      ],

      visibleSurfacesHasMajorDamage: [false],
      visibleSurfacesMajorDamage : [{value:"", disabled: true},
        [Validators.required]
      ]
    }, {validators: CustomValidators.atLeastOneTrueOutOf(
      "visibleSurfacesHasScratches",
      "visibleSurfacesHasDents",
      "visibleSurfacesHasMinorDamage",
      "visibleSurfacesHasMajorDamage")}
    ),


    applicableHiddenSurfacesDamage: [false],
    hiddenSurfacesForm: this.fb.group({
      hiddenSurfacesHasScratches: [false],
      hiddenSurfacesScratchesLength: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hiddenSurfacesHasDents: [false],
      hiddenSurfacesDentsDepth: [{value: 0, disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hiddenSurfacesHasMinorDamage: [false],
      hiddenSurfacesMinorDamage : [{value:"", disabled: true},
        [Validators.required]
      ],

      hiddenSurfacesHasMajorDamage: [false],
      hiddenSurfacesMajorDamage : [{value:"", disabled: true},
        [Validators.required]
      ]
    }, {validators: CustomValidators.atLeastOneTrueOutOf(
        "hiddenSurfacesHasScratches",
        "hiddenSurfacesHasDents",
        "hiddenSurfacesHasMinorDamage",
        "hiddenSurfacesHasMajorDamage")}
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
    
// *******************************
// *** FORM RESET AND SUBMIT
// *******************************
  
  onReset(e:Event): void {
    e.preventDefault();
    this.washingMachinePricingForm.reset();
    this.resetSelectedFiles();    
  }  

  onSubmit(): void {
    if(this.selectedFiles.length === 0) {
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
      packageDamaged: this.washingMachineDetailForm.controls.packageForm.controls.packageDamaged.value,
      packageDirty: this.washingMachineDetailForm.controls.packageForm.controls.packageDirty.value,
      packageMaterialAvailable: this.washingMachineDetailForm.controls.packageForm.controls.packageMaterialAvailable.value,


      applicableVisibleSurfacesDamage: this.washingMachineDetailForm.controls.applicableVisibleSurfacesDamage.value,

      visibleSurfacesHasScratches: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasScratches.value,
      visibleSurfacesScratchesLength: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesScratchesLength.value,

      visibleSurfacesHasDents: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasDents.value,
      visibleSurfacesDentsDepth: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesDentsDepth.value,

      visibleSurfacesHasMinorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.value,
      visibleSurfacesMinorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesMinorDamage.value,

      visibleSurfacesHasMajorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.value,
      visibleSurfacesMajorDamage: this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesMajorDamage.value,


      applicableHiddenSurfacesDamage: this.washingMachineDetailForm.controls.applicableHiddenSurfacesDamage.value,

      hiddenSurfacesHasScratches: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.value,
      hiddenSurfacesScratchesLength: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesScratchesLength.value,

      hiddenSurfacesHasDents: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.value,
      hiddenSurfacesDentsDepth: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesDentsDepth.value,

      hiddenSurfacesHasMinorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.value,
      hiddenSurfacesMinorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMinorDamage.value,

      hiddenSurfacesHasMajorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.value,
      hiddenSurfacesMajorDamage: this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMajorDamage.value,

      price: this.washingMachinePricingForm.controls.price.value,
      repairPrice: this.washingMachinePricingForm.controls.repairPrice.value
    };

    this._washingMachineService.setWashingMachineDetail(washingMachineDetail);
    this._washingMachineService.setSelectedFiles(this.selectedFiles);
    this.stepper.next();
  }


// *****************************
// *** MULTIPLE PICTURES
// *****************************

  selectedFiles:ImageFile[] = [];

  onDrop(droppedFiles:FileList): void {
    this.processFiles(droppedFiles);
  }

  onFileUpload(event: any): void {
    // console.log(event);
    const htmlInput = event.target as HTMLInputElement;
    if(htmlInput.files) {
      this.processFiles(htmlInput.files);
    }
  }

  private processFiles(files: FileList): void {    
    // 1. Validate file length
    const totalFilesCount = this.selectedFiles.length + files.length;
    if (totalFilesCount > 3) {
      this._notifService.showError(this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_LIMIT"),0);
      return;
    }
      
    for (let i = 0; i < files.length; i++) {
      const uploadedFile:File = files[i];      
      
      // 2. Validate file extension
      if(this.invalidFileExtension(uploadedFile.name)) {
        this._notifService.showError(
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_FILE")
          +" "+uploadedFile.name+" "+
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_EXTENSION_TEXT"),0);
        return;
      }
      
      // 3. Validate file size, must not exceed 3 MB
      if(this.invalidFileSize(uploadedFile.size, 3)) {
        this._notifService.showError(
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_FILE")
          +" "+uploadedFile.name+" "+
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_SIZE_TEXT"),0);
        return;
      }
            
      const imageFile:ImageFile = {
        file: uploadedFile,
        url: this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(uploadedFile)
        )
      }

      this.selectedFiles.push(imageFile);  
    }    
  }

  onRemoveImage(index:number): void {
    this.selectedFiles.splice(index, 1);
  }

  resetSelectedFiles(): void {
    this.selectedFiles = [];
  }

//************************
//***** HELPER METHODS
//************************
  
  invalidFileExtension(fileName: string): boolean {
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
  
    switch(extension.toLowerCase()) {
      case 'png': return false;  
      case 'jpg': return false;
      case 'jpeg': return false;
      case 'bmp': return false;

      default: return true;
    }
  }

  invalidFileSize(fileSize:number, maxFileSizeInMB:number): boolean {
    const fileSizeInMB:number = fileSize / (1024 * 1024);
    return (fileSizeInMB < maxFileSizeInMB) 
      ? false 
      : true;
  }

}