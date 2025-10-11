import { Component, OnDestroy, OnInit, inject,} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SerialNumberValidator } from 'src/app/shared/validators/async-validators/serial-number.validator';
import { CameraComponent } from './camera/camera.component';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { WashingMachineIdentification } from 'src/app/washing-machine/models/washing-machine-identification.model';
import { WashingMachineService } from '../../services/washing-machine.service';
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
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { ProductDataService } from 'src/app/services/product-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    ReactiveFormsModule,
    TranslocoModule,
    StepperButtonsDirective
  ]
})
export class WashingMachineIdentificationComponent implements OnInit, OnDestroy {
  private stepper = inject(MatStepper);
  private _washingMachineService =  inject(WashingMachineService);
  private _productDataService = inject(ProductDataService);
  private dialog = inject(MatDialog);
  private fb = inject(NonNullableFormBuilder);
            
  private serialNumberValidator = inject(SerialNumberValidator);

  constructor() {
    /**
     * Subscriptions should be put inside the constructor so you can use takeUntilDestroyed()
     */
    this.toggleManufacturerModelAndTypeControlsBasedOnIdentificationMode();
  }
  
  ngOnInit(): void {
    this.populateManufacturerField();

    /** Does not clear availableType and availableModel arrays from the inputs. 
     * Before reproducing make sure this method is enabled and remove (selectionChange)="populateModelAndTypeFields($event.value)
     * from the html template.
     * To reproduce:
        1. Select manufacturer
        2. Select model
        3. Click Reset
        4. Select model / type
        5. Notice you still have available options in the input.
        Another bug is that populateModelAndTypeFields is called twice when you click reset.
     */
    // this.washingMachineIdentificationForm.controls.manufacturer.valueChanges.subscribe(value => {
    //   this.populateModelAndTypeFields(value);
    // });
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
  // TODO: Use .pipe(takeUntilDestroyed()) for all forms that use valueChanges subscriptions
  private toggleManufacturerModelAndTypeControlsBasedOnIdentificationMode(): void {
    this.washingMachineIdentificationForm.controls.identificationMode.valueChanges
      .pipe(takeUntilDestroyed()) // Only works inside the constructor, reason why I moved it from onInit(). 
      .subscribe(value => {
        if (value === IdentificationMode.QR_CODE) {
          this.washingMachineIdentificationForm.controls.manufacturer.disable();
          this.washingMachineIdentificationForm.controls.modelAndType.disable();
        } else {
          this.washingMachineIdentificationForm.controls.manufacturer.enable();
          this.washingMachineIdentificationForm.controls.modelAndType.enable();
        }
      });

    /**
     * Use this console log to see if subscriptions have been closed. 
     * You get the sub by creating a variable to hold it: const sub = this.sadkajsda.valueChanges.subscribe()
     * Navigation away from the component should have isStopped: true if the subscription was properly closed.
     * Additionally, you can use a random to show people that you can have multiple active subs active, 
     * when navigating away without unsubscribing.
     */
    // const id = Math.random();
    // setInterval(() => {
    //   console.log("id = ", id, "sub = ", sub);
    // }, 1_000);
  }

  // TODO: refactor methods related to camera
  openCameraDialog(): void {
    const dialogRef = this.dialog.open(CameraComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: GetProductIdentificationResponse) => {
      // console.log("result from window = ", result);
      if(result) {
        this.washingMachineIdentificationForm.controls.manufacturer.setValue(result.manufacturer);
        this.populateModelAndTypeFields(result.manufacturer); // necessary to properly update the fields model and type in the UI when QR code is identified.
        this.washingMachineIdentificationForm.controls.modelAndType.controls.model.setValue(result.model);
        this.washingMachineIdentificationForm.controls.modelAndType.controls.type.setValue(result.type);        
      } else {
        this.washingMachineIdentificationForm.controls.manufacturer.reset();
        this.washingMachineIdentificationForm.controls.modelAndType.reset();
        this.washingMachineIdentificationForm.controls.serialNumber.reset();
        this.washingMachineIdentificationForm.controls.identificationMode.reset();
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
    /*
      e.preventDefault(); Prevents the default browser behavior for the event, 
      which is typically the form submission or a button's default action. 
      The disabled input (manufacturer) will not appear empty and will preserve its value when reset. 
    */
    e.preventDefault();
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

  private populateManufacturerField(): void {
    this._productDataService.getManufacturers(this.washingMachineIdentificationForm.controls.category.value).subscribe(response => {
      this.availableManufacturers = response;
    });
  }

  populateModelAndTypeFields(manufacturer: string): void {
    /* 
      Need to reset values, when you repopulate the models and types arrays
      the option doesn't appear in the select input BUT it's saved in the form 
      causing the controls to be valid. 
      To reproduce:
        1. Select manufacturer
        2. Select model
        3. Select a different manufacturer
        4. Don't touch model / type
        5. Type serialNumber and fill in the other fields
        6. Click Next
        7. Notice you are allowed to move to the next step.
    */
    this.clearAvailableModelsAndTypes();

    this._productDataService.getModelsAndTypes(manufacturer).subscribe(response => {
      response.forEach(getModelAndTypeResponse => {
        this.availableModels.push(getModelAndTypeResponse.model);
        this.availableTypes.push(getModelAndTypeResponse.type);
      });
    });
  }
}

