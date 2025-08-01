import { Component, OnDestroy, OnInit, inject,} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SerialNumberValidator } from 'src/app/shared/validators/async-validators/serial-number.validator';
import { CameraComponent } from './camera/camera.component';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { WashingMachineIdentification } from 'src/app/washing-machine/models/washing-machine-identification.model';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineDataService } from '../../services/washing-machine.data.service';
import { ReturnType } from '../../enums/return-type.enum';
import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { MatStepper } from '@angular/material/stepper';
import { GetProductIdentificationResponse } from 'src/app/shared/models/get-product-identification.response';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { ProductDataService } from 'src/app/services/product-data.service';

@Component({
    selector: 'app-washing-machine-identification',
    templateUrl: './washing-machine-identification.component.html',
    styleUrls: ['./washing-machine-identification.component.scss'],
    imports: [
      MatCardModule,
      MatButtonToggleModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,

      CommonModule,
      ReactiveFormsModule,
      TranslocoModule,
      StepperButtonsDirective
    ]
})
export class WashingMachineIdentificationComponent implements OnInit, OnDestroy {
  private stepper = inject(MatStepper);
  private _washingMachineService =  inject(WashingMachineService);
  private _washingMachineDataService = inject(WashingMachineDataService);
  private _productDataService = inject(ProductDataService);
  private dialog = inject(MatDialog);
  private fb = inject(NonNullableFormBuilder);
            
  private serialNumberValidator = inject(SerialNumberValidator);
  
  ngOnInit(): void {
    this.populateDataMatrix_Manufacturer_Field(this.washingMachineIdentificationForm.controls.category.value);
  }

  ngOnDestroy(): void {
    this._washingMachineService.resetWashingMachineIdentification();
    this._washingMachineService.resetWashingMachineDetail();
    this._washingMachineService.clearSelectedFiles();
  }

  returnType = ReturnType;
  damageType = DamageType;
  identificationMode = IdentificationMode;

  washingMachineIdentificationForm = this.fb.group({
    identificationMode: ["", Validators.required],
        
    category: [{value:"Washing Machine", disabled:true}],
    manufacturer: ["", Validators.required],

    modelAndType: this.fb.group({
      model: "",
      type: ""
    }, {validators: CustomValidators.atLeastOneControlRequired("model","type")}),

    serialNumber: ["", {
      validators: Validators.required,
      asyncValidators: this.serialNumberValidator.validate.bind(this.serialNumberValidator),
      updateOn: "blur"
    }],
  
    returnType: ["", Validators.required],
    damageType: ["", Validators.required],
  });
    
// *****************************************
// *** FORM FUNCTIONALITY
// *****************************************

  disableDataFields_WHEN_QRCodeIsSelected(): void {
    this.washingMachineIdentificationForm.controls.manufacturer.enable();
    this.washingMachineIdentificationForm.controls.modelAndType.enable();

    if (this.washingMachineIdentificationForm.value.identificationMode === IdentificationMode.QR_CODE) {
      this.washingMachineIdentificationForm.controls.manufacturer.disable();
      this.washingMachineIdentificationForm.controls.modelAndType.disable();
    }
  }

  disableInUse!:boolean;
  disableInTransit!:boolean;

  disableDamageTypeBasedOnReturnTypeValue(): void {    
    this.disableInUse = (this.washingMachineIdentificationForm.value.returnType === ReturnType.TRANSPORT);
    this.disableInTransit = (
      this.washingMachineIdentificationForm.value.returnType === ReturnType.SERVICE || 
      this.washingMachineIdentificationForm.value.returnType === ReturnType.COMMERCIAL
    );

    this.washingMachineIdentificationForm.controls.damageType.reset();
  }

  // TODO: refactor methods related to camera
  openCameraDialog(): void {
    const dialogRef = this.dialog.open(CameraComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: GetProductIdentificationResponse) => {
      // console.log("result from window = ", result);

      if(result) {
        this.washingMachineIdentificationForm.controls.manufacturer.patchValue(result.manufacturer);
        this.washingMachineIdentificationForm.controls.modelAndType.controls.model.patchValue(result.model);
        this.washingMachineIdentificationForm.controls.modelAndType.controls.type.patchValue(result.type);        
      } else {
        this.washingMachineIdentificationForm.controls.manufacturer.reset();
        this.washingMachineIdentificationForm.controls.modelAndType.reset();
        this.washingMachineIdentificationForm.controls.serialNumber.reset();

        this.washingMachineIdentificationForm.controls.identificationMode.reset();
        this.disableDataFields_WHEN_QRCodeIsSelected();
      }
    });
  }

  onSubmit(): void {
    if (this.washingMachineIdentificationForm.invalid || this.washingMachineIdentificationForm.pending) {
      return;
    }

    const washingMachineModel:string = (this.washingMachineIdentificationForm.controls.modelAndType.controls.model.value === '')
      ? "N/A"
      : this.washingMachineIdentificationForm.controls.modelAndType.controls.model.value;

    const washingMachineType:string = (this.washingMachineIdentificationForm.controls.modelAndType.controls.type.value === '')
      ? "N/A"
      : this.washingMachineIdentificationForm.controls.modelAndType.controls.type.value;

    const productIdentificationResult:WashingMachineIdentification = {
      identificationMode: this.washingMachineIdentificationForm.controls.identificationMode.value as IdentificationMode,
      category: this.washingMachineIdentificationForm.controls.category.value,
      manufacturer: this.washingMachineIdentificationForm.controls.manufacturer.value,

      model: washingMachineModel,
      type: washingMachineType,
      
      serialNumber: this.washingMachineIdentificationForm.controls.serialNumber.value.toString(),
      returnType: this.washingMachineIdentificationForm.controls.returnType.value as ReturnType,
      damageType: this.washingMachineIdentificationForm.controls.damageType.value as DamageType
    }

    this._washingMachineService.setWashingMachineIdentification(productIdentificationResult);
    this.stepper.next();
  }
  
  onReset(e:Event): void {
    e.preventDefault(); // Prevent the default behavior. The disabled input will not appear empty and will preserve its value   
    this.clearAvailableModelsAndTypes();
    this._washingMachineService.resetWashingMachineIdentification();
  }

// **********************************
// *** POPULATE DATA MATRIX FIELDS
// **********************************

  availableManufacturers: string[] = [];
  availableModels: string[] = [];
  availableTypes: string[] = [];

  private clearAvailableModelsAndTypes(): void {
    this.availableModels = [];
    this.availableTypes = [];
  }

  populateDataMatrix_Manufacturer_Field(category: string): void {   
    this._productDataService.getManufacturers(category).subscribe(response => {
      this.availableManufacturers = response;
    });  
  }

  populateDataMatrix_Model_Type_Fields(manufacturer: string): void {  

    // Do not execute a request if manufacturer is empty.
    // Happens when form is reset
    if (manufacturer === "") {
      return;
    }

    this._productDataService.getModelsAndTypes(manufacturer).subscribe(response => {    

      this.clearAvailableModelsAndTypes();

      response.forEach(getModelAndTypeResponse => {
        this.availableModels.push(getModelAndTypeResponse.model);
        this.availableTypes.push(getModelAndTypeResponse.type);
      });
    });
    
    // Need to reset values, when you repopulate the models and types arrays
    // the option doesn't appear in the select input BUT it's saved in the productForm 
    // causing the controls to be valid
    this.washingMachineIdentificationForm.controls.modelAndType.reset();
  }
}

