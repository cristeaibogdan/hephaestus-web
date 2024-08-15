import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WashingMachineService } from 'src/app/services/washing-machine.service';
import { DataService } from 'src/app/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ImageFile } from '../../models/image-file.model';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { WashingMachineDetailsDTO } from '../../models/dtos/washing-machine-details.dto';

@Component({
  selector: 'app-product-damage',
  templateUrl: './product-damage.component.html',
  styleUrls: ['./product-damage.component.css']
})
export class ProductDamage implements OnInit, OnDestroy {
  
  subscriptions:Subscription[] = [];

  constructor(
    private _washingMachineService: WashingMachineService,
    private _dataService: DataService,
    private _translate: TranslateService,
    private sanitizer:DomSanitizer,
    private fb:NonNullableFormBuilder,
  ) {}

  washingMachineDetailsForm = this.fb.group({
    applicablePackageDamage: [false],
    packageForm : this.fb.group({
      packageDamaged : [false],
      packageDirty : [false],
      packageMaterialAvailable : [false],
    }, {validators: CustomValidators.atLeastOneOutOfThreeTrue(
      "packageDamaged", 
      "packageDirty", 
      "packageMaterialAvailable")}
    ),
    

    applicableVisibleSurfacesDamage: [false],
    visibleSurfacesForm: this.fb.group({
      visibleSurfacesHasScratches: [false],
      visibleSurfacesScratchesLength: [{
        value: 0, 
        disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      visibleSurfacesHasDents: [false],
      visibleSurfacesDentsDepth: [{
        value: 0, 
        disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      visibleSurfacesHasMinorDamage: [false],
      visibleSurfacesMinorDamage : [{
        value:"",
        disabled: true},
        [Validators.required]
      ],

      visibleSurfacesHasMajorDamage: [false],
      visibleSurfacesMajorDamage : [{
        value:"",
        disabled: true},
        [Validators.required]
      ]
    }, {validators: CustomValidators.atLeastOneOutOfFourTrue(
      "visibleSurfacesHasScratches",
      "visibleSurfacesHasDents",
      "visibleSurfacesHasMinorDamage",
      "visibleSurfacesHasMajorDamage"
    )}
    ),


    applicableHiddenSurfacesDamage: [false],
    hiddenSurfacesForm: this.fb.group({
      hiddenSurfacesHasScratches: [false],
      hiddenSurfacesScratchesLength: [{
        value: 0, 
        disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hiddenSurfacesHasDents: [false],
      hiddenSurfacesDentsDepth: [{
        value: 0, 
        disabled: true}, 
        [Validators.required, Validators.min(0.5)]
      ],

      hiddenSurfacesHasMinorDamage: [false],
      hiddenSurfacesMinorDamage : [{
        value:"",
        disabled: true},
        [Validators.required]
      ],

      hiddenSurfacesHasMajorDamage: [false],
      hiddenSurfacesMajorDamage : [{
        value:"",
        disabled: true},
        [Validators.required]
      ]
    }, {validators: CustomValidators.atLeastOneOutOfFourTrue(
        "hiddenSurfacesHasScratches",
        "hiddenSurfacesHasDents",
        "hiddenSurfacesHasMinorDamage",
        "hiddenSurfacesHasMajorDamage"
      )}
    ),
  },{validators: CustomValidators.atLeastOneOutOfThreeTrue(
      "applicablePackageDamage",
      "applicableVisibleSurfacesDamage",
      "applicableHiddenSurfacesDamage")
    });

  washingMachinePricingForm = this.fb.group({
    price : [0, [Validators.min(0), Validators.max(10000)]],
    repairPrice : [0, [Validators.min(0), Validators.max(10000)]],
  });
  
  minorDamageDescriptionCharacterLimit:number = 200;
  majorDamageDescriptionCharacterLimit:number = 200;

  ngOnInit() {
    // *****************************
    // *** PACKAGE DAMAGE
    // *****************************

    const applicablePackageDamage = this.washingMachineDetailsForm.controls.applicablePackageDamage
    const packageForm = this.washingMachineDetailsForm.controls.packageForm;

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

    const applicableVisibleSurfacesDamage = this.washingMachineDetailsForm.controls.applicableVisibleSurfacesDamage
    const visibleSurfacesForm = this.washingMachineDetailsForm.controls.visibleSurfacesForm;

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

    const applicableHiddenSurfacesDamage = this.washingMachineDetailsForm.controls.applicableHiddenSurfacesDamage
    const hiddenSurfacesForm = this.washingMachineDetailsForm.controls.hiddenSurfacesForm;

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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

// **********************************
// *** VISIBLE SURFACES DAMAGE TOGGLES
// **********************************

  toggleFormControl(control: AbstractControl, enableWhen: boolean) {
    if (enableWhen) {
      control.enable({ emitEvent: false });
    } else {
      control.reset();
      control.disable({ emitEvent: false });
    }
  }

  toggle_VisibleSurfaces_ScratchesLength() {   
    const control = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesScratchesLength;
    const enableWhen = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasScratches.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_DentsDepth() {
    const control = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesDentsDepth;
    const enableWhen = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasDents.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_MinorDamage() {  
    const control = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesMinorDamage;
    const enableWhen = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_MajorDamage() {
    const control = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesMajorDamage;
    const enableWhen = this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }
    
// ********************************
// *** HIDDEN SURFACES DAMAGE TOGGLES
// *********************************

  toggle_HiddenSurfaces_ScratchesLength() {
    const control = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesScratchesLength;
    const enableWhen = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_DentsDepth() {  
    const control = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesDentsDepth;
    const enableWhen = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_MinorDamage() {
    const control = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMinorDamage;
    const enableWhen = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_MajorDamage() {  
    const control = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMajorDamage;
    const enableWhen = this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

// *******************************
// *** FORM RESET AND SUBMIT
// *******************************
  
  onReset(e:Event) {
    e.preventDefault();
    this.washingMachineDetailsForm.reset();
    this.washingMachinePricingForm.reset();
    this.resetSelectedFiles();    
  }  

  onSubmit() {
    const washingMachineDetails:WashingMachineDetailsDTO = {
      applicablePackageDamage: this.washingMachineDetailsForm.controls.applicablePackageDamage.value,
      packageDamaged: this.washingMachineDetailsForm.controls.packageForm.controls.packageDamaged.value,
      packageDirty: this.washingMachineDetailsForm.controls.packageForm.controls.packageDirty.value,
      packageMaterialAvailable: this.washingMachineDetailsForm.controls.packageForm.controls.packageMaterialAvailable.value,


      applicableVisibleSurfacesDamage: this.washingMachineDetailsForm.controls.applicableVisibleSurfacesDamage.value,

      visibleSurfacesHasScratches: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasScratches.value,
      visibleSurfacesScratchesLength: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesScratchesLength.value,

      visibleSurfacesHasDents: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasDents.value,
      visibleSurfacesDentsDepth: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesDentsDepth.value,

      visibleSurfacesHasMinorDamage: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.value,
      visibleSurfacesMinorDamage: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesMinorDamage.value,

      visibleSurfacesHasMajorDamage: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.value,
      visibleSurfacesMajorDamage: this.washingMachineDetailsForm.controls.visibleSurfacesForm.controls.visibleSurfacesMajorDamage.value,


      applicableHiddenSurfacesDamage: this.washingMachineDetailsForm.controls.applicableHiddenSurfacesDamage.value,

      hiddenSurfacesHasScratches: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.value,
      hiddenSurfacesScratchesLength: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesScratchesLength.value,

      hiddenSurfacesHasDents: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.value,
      hiddenSurfacesDentsDepth: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesDentsDepth.value,

      hiddenSurfacesHasMinorDamage: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.value,
      hiddenSurfacesMinorDamage: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMinorDamage.value,

      hiddenSurfacesHasMajorDamage: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.value,
      hiddenSurfacesMajorDamage: this.washingMachineDetailsForm.controls.hiddenSurfacesForm.controls.hiddenSurfacesMajorDamage.value,

      price: this.washingMachinePricingForm.controls.price.value,
      repairPrice: this.washingMachinePricingForm.controls.repairPrice.value
    };

    this._washingMachineService.setWashingMachineDetails(washingMachineDetails);
    this._washingMachineService.setSelectedFiles(this.selectedFiles);
    this._washingMachineService.getDamageEvaluationAndGoToNextStep();
  }


// *****************************
// MULTIPLE PICTURES
// *****************************

  selectedFiles:ImageFile[] = [];

  onDrop(droppedFiles:FileList) {
    this.onFileUpload({target: {files: droppedFiles}});
  }

  onFileUpload(event: any) {
    // console.log(event);
  
    // 1. Validate file length
    const totalFilesCount = this.selectedFiles.length + event.target.files.length;
    if (totalFilesCount > 3) {
      this._dataService.openSnackBar_Error(this._translate.instant("I18N.CUSTOM_ERROR.IMAGE_LIMIT"),0);
      return;
    }
      
    for (let i = 0; i < event.target.files.length; i++) {
      const uploadedFile:File = event.target.files[i];      
      
      // 2. Validate file extension
      if(this.invalidFileExtension(uploadedFile.name)) {
        this._dataService.openSnackBar_Error(
          this._translate.instant("I18N.CUSTOM_ERROR.IMAGE_FILE")
          +" "+uploadedFile.name+" "+
          this._translate.instant("I18N.CUSTOM_ERROR.IMAGE_EXTENSION_TEXT"),0);
        return;
      }
      
      // 3. Validate file size, must not exceed 3 MB
      if(this.invalidFileSize(uploadedFile.size, 3)) {
        this._dataService.openSnackBar_Error(
          this._translate.instant("I18N.CUSTOM_ERROR.IMAGE_FILE")
          +" "+uploadedFile.name+" "+
          this._translate.instant("I18N.CUSTOM_ERROR.IMAGE_SIZE_TEXT"),0);
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

  onRemoveImage(index:number) {
    this.selectedFiles.splice(index, 1);
  }

  resetSelectedFiles() {
    this.selectedFiles = [];
  }

//************************
//***** HELPER METHODS
//************************
  
  invalidFileExtension(fileName: String) {
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
  
    switch(extension.toLowerCase()) {
      case 'png': return false;  
      case 'jpg': return false;
      case 'jpeg': return false;
      case 'bmp': return false;

      default: return true;
    }
  }

  invalidFileSize(fileSize:number, maxFileSizeInMB:number) {
    const fileSizeInMB:number = fileSize / (1024 * 1024);
    return (fileSizeInMB < maxFileSizeInMB) ? false : true;
  }

}