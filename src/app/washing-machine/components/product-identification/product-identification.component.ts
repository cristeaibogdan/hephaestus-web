import { Component, OnDestroy, OnInit,} from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SerialNumberValidator } from 'src/app/shared/validators/async-validators/serial-number.validator';
import { CameraComponent } from './camera/camera.component';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { QrResult } from 'src/app/washing-machine/models/qr-result.model';
import { WashingMachineIdentification } from 'src/app/washing-machine/models/washing-machine-identification.model';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineDataService } from '../../services/washing-machine.data.service';
import { ReturnType } from '../../enums/return-type.enum';
import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';

@Component({
  selector: 'app-product-identification',
  templateUrl: './product-identification.component.html',
  styleUrls: ['./product-identification.component.css']
})
export class ProductIdentificationComponent implements OnInit, OnDestroy {

  constructor(
    private _washingMachineService: WashingMachineService,
    private _washingMachineDataService:WashingMachineDataService, 
    private dialog:MatDialog, 
    private fb:NonNullableFormBuilder,
              
    private serialNumberValidator:SerialNumberValidator,             
  ) { }
  
  ngOnInit() {
    this.populateDataMatrix_Manufacturer_Field(this.washingMachineForm.controls.category.value);
  }

  ngOnDestroy() {
    this._washingMachineService.resetWashingMachineIdentificationValues();
    this._washingMachineService.resetWashingMachineDamageAssessmentValues();
  }

  returnType = ReturnType;
  damageType = DamageType;
  identificationMode = IdentificationMode;

  washingMachineForm = this.fb.group({
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

  disableDataFields_WHEN_QRCodeIsSelected() {
    this.washingMachineForm.controls.manufacturer.enable();
    this.washingMachineForm.controls.serialNumber.enable();
    this.washingMachineForm.controls.modelAndType.enable();

    if (this.washingMachineForm.value.identificationMode === IdentificationMode.QR_CODE) {
      this.washingMachineForm.controls.manufacturer.disable();
      this.washingMachineForm.controls.serialNumber.disable();
      this.washingMachineForm.controls.modelAndType.disable();
    }
  }

  disableInUse!:boolean;
  disableInTransit!:boolean;

  disableDamageTypeBasedOnReturnTypeValue() {    
    this.disableInUse = (this.washingMachineForm.value.returnType === ReturnType.TRANSPORT);
    this.disableInTransit = (
      this.washingMachineForm.value.returnType === ReturnType.SERVICE || 
      this.washingMachineForm.value.returnType === ReturnType.COMMERCIAL
    );

    this.washingMachineForm.controls.damageType.reset();
  }

  // TODO: refactor methods related to camera
  openCameraDialog() {
    const dialogRef = this.dialog.open(CameraComponent, {
      panelClass: "camera-dialog",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result:QrResult) => {
      // console.log("result from window = ", result);

      if(result) {
        this.washingMachineForm.controls.manufacturer.patchValue(result.manufacturer);
        this.washingMachineForm.controls.modelAndType.controls.model.patchValue(result.model);
        this.washingMachineForm.controls.modelAndType.controls.type.patchValue(result.type);
        this.washingMachineForm.controls.serialNumber.patchValue(result.serialNumber);
      } else {
        this.washingMachineForm.controls.manufacturer.reset();
        this.washingMachineForm.controls.modelAndType.reset();
        this.washingMachineForm.controls.serialNumber.reset();

        this.washingMachineForm.controls.identificationMode.reset();
        this.disableDataFields_WHEN_QRCodeIsSelected();
      }
    });
  }

  onSubmit() {
    if (this.washingMachineForm.invalid) {
      return;
    }

    const washingMachineModel:string = (this.washingMachineForm.controls.modelAndType.controls.model.value === '')
      ? "N/A"
      : this.washingMachineForm.controls.modelAndType.controls.model.value;

    const washingMachineType:string = (this.washingMachineForm.controls.modelAndType.controls.type.value === '')
      ? "N/A"
      : this.washingMachineForm.controls.modelAndType.controls.type.value;

    const productIdentificationResult:WashingMachineIdentification = {
      identificationMode: this.washingMachineForm.controls.identificationMode.value as IdentificationMode,
      category: this.washingMachineForm.controls.category.value,
      manufacturer: this.washingMachineForm.controls.manufacturer.value,

      model: washingMachineModel,
      type: washingMachineType,
      
      serialNumber: this.washingMachineForm.controls.serialNumber.value.toString(),
      returnType: this.washingMachineForm.controls.returnType.value as ReturnType,
      damageType: this.washingMachineForm.controls.damageType.value as DamageType
    }

    this._washingMachineService.setWashingMachineIdentificationValues(productIdentificationResult);
    this._washingMachineService.nextStep();
  }

  
  onReset(e:Event) {
    e.preventDefault(); // Prevent the default behavior. The disabled input will not appear empty and will preserve its value
    this.washingMachineForm.reset();    
    this.clearAvailableModelsAndTypes(); // clear model and type arrays
    this._washingMachineService.resetWashingMachineIdentificationValues();
  }

// **********************************
// *** POPULATE DATA MATRIX FIELDS
// **********************************

  availableManufacturers:string[] = [];
  availableModels:string[] = [];
  availableTypes:string[] = [];

  clearAvailableModelsAndTypes() {
    this.availableModels = [];
    this.availableTypes = [];
  }

  populateDataMatrix_Manufacturer_Field(category:string) {   
    this._washingMachineDataService.getManufacturers(category).subscribe(response => {
      this.availableManufacturers = response;
    });  
  }

  populateDataMatrix_Model_Type_Fields(manufacturer:string) {  

    // Do not execute a request if manufacturer is empty.
    // Happens when form is reset
    if (manufacturer === "") {
      return;
    }

    this._washingMachineDataService.getModelsAndTypes(manufacturer).subscribe(response => {    

      // clear model and type arrays
      this.clearAvailableModelsAndTypes();

      response.forEach(ProductModelTypeDTO => {
        this.availableModels.push(ProductModelTypeDTO.model);
        this.availableTypes.push(ProductModelTypeDTO.type);
      });
    });
    
    // Need to reset values, when you repopulate the models and types arrays
    // the option doesn't appear in the select input BUT it's saved in the productForm 
    // causing the controls to be valid
    this.washingMachineForm.controls.modelAndType.reset();
  }
}

