import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { DragAndDropDirective } from 'src/app/shared/directives/drag-and-drop.directive';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-washing-machine-damage',
  templateUrl: './washing-machine-damage.component.html',
  styleUrls: ['./washing-machine-damage.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSliderModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatStepperModule, // for the directive matStepperPrevious

    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    DragAndDropDirective,
    StepperButtonsDirective
  ]
})
export class WashingMachineDamageComponent implements OnDestroy {  
  private stepper = inject(MatStepper)
  private fb = inject(NonNullableFormBuilder);
  private _washingMachineService = inject(WashingMachineService);
  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);
  private sanitizer = inject(DomSanitizer);
  
  private subscriptions:Subscription[] = [];

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
  
  minorDamageDescriptionCharacterLimit:number = 200;
  majorDamageDescriptionCharacterLimit:number = 200;

  ngOnInit(): void {
    // *****************************
    // *** PACKAGE DAMAGE
    // *****************************

    const applicablePackageDamage = this.washingMachineDetailForm.controls.applicablePackageDamage
    const packageForm = this.washingMachineDetailForm.controls.packageForm;

    // 1. If false from the start, reset and disable packageForm
    if(!applicablePackageDamage.value) {
      packageForm.reset();
      packageForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.subscriptions.push(applicablePackageDamage.valueChanges.subscribe(value =>{      
      if(value) {
        packageForm.enable({emitEvent: false});
        packageForm.controls.packageMaterialAvailable.disable();
      } else {
        packageForm.reset();
        packageForm.disable({emitEvent: false});
      }
    })
    );

    // 3. If packageDamaged or packageDirty is true, enable packageMaterialAvailable
    this.subscriptions.push(packageForm.valueChanges.subscribe(value => {
      if(value.packageDamaged || value.packageDirty) {
        packageForm.controls.packageMaterialAvailable.enable({emitEvent: false});       
      } else {
        packageForm.controls.packageMaterialAvailable.setValue(false, {emitEvent: false});
        packageForm.controls.packageMaterialAvailable.disable({emitEvent: false}); 
      }
    })
    );

    // *****************************
    // *** VISIBLE SURFACES DAMAGE
    // *****************************

    const applicableVisibleSurfacesDamage = this.washingMachineDetailForm.controls.applicableVisibleSurfacesDamage
    const visibleSurfacesForm = this.washingMachineDetailForm.controls.visibleSurfacesForm;

    // 1. If false from the start, reset and disable visibleSurfacesForm
    if(!applicableVisibleSurfacesDamage.value) {
      visibleSurfacesForm.reset();
      visibleSurfacesForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.subscriptions.push(applicableVisibleSurfacesDamage.valueChanges.subscribe(value=> {
      if(value) {
        visibleSurfacesForm.controls.visibleSurfacesHasScratches.enable({emitEvent: false});
        visibleSurfacesForm.controls.visibleSurfacesHasDents.enable({emitEvent: false});
        visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.enable({emitEvent: false});
        visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.enable({emitEvent: false});
      } else {
        visibleSurfacesForm.reset();
        visibleSurfacesForm.disable({emitEvent: false});
      }
    })
    );

    // *****************************
    // *** HIDDEN SURFACES DAMAGE
    // *****************************

    const applicableHiddenSurfacesDamage = this.washingMachineDetailForm.controls.applicableHiddenSurfacesDamage
    const hiddenSurfacesForm = this.washingMachineDetailForm.controls.hiddenSurfacesForm;

    // 1. If false from the start, reset and disable hiddenSurfacesForm
    if(!applicableHiddenSurfacesDamage.value) {
      hiddenSurfacesForm.reset();
      hiddenSurfacesForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.subscriptions.push(applicableHiddenSurfacesDamage.valueChanges.subscribe(value=> {
      if(value) {
        hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.enable({emitEvent: false});
        hiddenSurfacesForm.controls.hiddenSurfacesHasDents.enable({emitEvent: false});
        hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.enable({emitEvent: false});
        hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.enable({emitEvent: false});
      } else {
        hiddenSurfacesForm.reset();
        hiddenSurfacesForm.disable({emitEvent: false});
      }
    })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

// **********************************
// *** VISIBLE SURFACES DAMAGE TOGGLES
// **********************************

  toggleFormControl(control: AbstractControl, enableWhen: boolean): void {
    if (enableWhen) {
      control.enable({ emitEvent: false });
    } else {
      control.reset();
      control.disable({ emitEvent: false });
    }
  }

  toggle_VisibleSurfaces_ScratchesLength(): void {   
    const control = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesScratchesLength;
    const enableWhen = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasScratches.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_DentsDepth(): void {
    const control = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesDentsDepth;
    const enableWhen = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasDents.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_MinorDamage(): void {  
    const control = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesMinorDamage;
    const enableWhen = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_MajorDamage(): void {
    const control = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesMajorDamage;
    const enableWhen = this.washingMachineDetailForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }
    
// ********************************
// *** HIDDEN SURFACES DAMAGE TOGGLES
// *********************************

  toggle_HiddenSurfaces_ScratchesLength(): void {
    const control = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesScratchesLength;
    const enableWhen = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_DentsDepth(): void {  
    const control = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesDentsDepth;
    const enableWhen = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_MinorDamage(): void {
    const control = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMinorDamage;
    const enableWhen = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_MajorDamage(): void {  
    const control = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMajorDamage;
    const enableWhen = this.washingMachineDetailForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

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