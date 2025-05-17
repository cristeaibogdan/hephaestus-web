import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SerialNumberValidator } from 'src/app/shared/validators/async-validators/serial-number.validator';
import { CustomValidators } from 'src/app/shared/validators/custom.validators';
import { SolarPanelDataService } from '../../services/solar-panel-data.service';
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';
import { SolarPanelService } from '../../services/solar-panel.service';
import { MatStepper } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { TranslocoModule } from '@jsverse/transloco';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-solar-panel-identification',
  templateUrl: './solar-panel-identification.component.html',
  styleUrls: ['./solar-panel-identification.component.scss'],
  imports: [
    MatCardModule,
    MatFormField,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,

    ReactiveFormsModule,
    TranslocoModule,
    StepperButtonsDirective
  ]
})
export class SolarPanelIdentificationComponent implements OnInit, OnDestroy {  
  private stepper = inject(MatStepper);
  private fb = inject(NonNullableFormBuilder);
  private _solarPanelDataService = inject(SolarPanelDataService);
  private _solarPanelService = inject(SolarPanelService);

  private serialNumberValidator = inject(SerialNumberValidator); //TODO: Use async validator to check the serial number

  ngOnInit() {
    this.getManufacturer(this.solarPanelForm.controls.category.value);
  }

  ngOnDestroy() {
    this._solarPanelService.resetSolarPanelIdentification();
    this._solarPanelService.resetSolarPanelDamage();
  }

  solarPanelForm = this.fb.group({        
    category: [{value:"Solar Panel", disabled:true}],
    manufacturer: ["", Validators.required],

    modelAndType: this.fb.group({
      model: "",
      type: ""
    }, {validators: CustomValidators.atLeastOneControlRequired("model","type")}),

    serialNumber: ["", {
      validators: Validators.required
    }],
  });

// *****************************************
// *** FORM FUNCTIONALITY
// *****************************************

  onSubmit() {
    if (this.solarPanelForm.invalid) {
      return;
    }

    const model:string = (this.solarPanelForm.controls.modelAndType.controls.model.value === '')
      ? "N/A"
      : this.solarPanelForm.controls.modelAndType.controls.model.value;

    const type:string = (this.solarPanelForm.controls.modelAndType.controls.type.value === '')
      ? "N/A"
      : this.solarPanelForm.controls.modelAndType.controls.type.value;

    const solarPanelIdentification: SolarPanelIdentification = {
      category: this.solarPanelForm.controls.category.value,
      manufacturer: this.solarPanelForm.controls.manufacturer.value,
      model: model,
      type: type,
      serialNumber: this.solarPanelForm.controls.serialNumber.value
    }
    
    this._solarPanelService.setSolarPanelIdentification(solarPanelIdentification);
    this.stepper.next();
  }

  onReset(e:Event) {
    e.preventDefault(); // Prevent the default behavior. The disabled input will not appear empty and will preserve its value
    this.clearAvailableModelsAndTypes();
    this._solarPanelService.resetSolarPanelIdentification();
  }

// **********************************
// *** POPULATE DROPDOWN SELECTORS
// **********************************

  availableManufacturers: string[] = [];
  availableModels: string[] = [];
  availableTypes: string[] = [];

  clearAvailableModelsAndTypes() {
    this.availableModels = [];
    this.availableTypes = [];
  }

  getManufacturer(category: string): void {   
    this._solarPanelDataService.getManufacturers(category).subscribe(response => {
      this.availableManufacturers = response;
    });  
  }

  getModelsAndTypes(manufacturer: string): void {    
    if (manufacturer === "") {// Do not execute a request if manufacturer is empty. Happens when form is reset
      return;
    }

    this._solarPanelDataService.getModelsAndTypes(manufacturer).subscribe(response => {
      this.clearAvailableModelsAndTypes();
      response.forEach(getModelAndTypeResponse => {
        this.availableModels.push(getModelAndTypeResponse.model);
        this.availableTypes.push(getModelAndTypeResponse.type);
      });
    });

    // Need to reset values, when you repopulate the models and types arrays
    // the option doesn't appear in the select input BUT it's saved in the form 
    // causing the controls to be valid
    this.solarPanelForm.controls.modelAndType.reset();
  }

}
