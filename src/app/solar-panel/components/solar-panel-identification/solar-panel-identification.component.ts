import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { SerialNumberValidator } from 'src/app/shared/validators/async-validators/serial-number.validator';
import { CustomValidators } from 'src/app/shared/validators/custom.validators';
import { SolarPanelDataService } from '../../services/solar-panel-data.service';
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';
import { SolarPanelService } from '../../services/solar-panel.service';

@Component({
  selector: 'app-solar-panel-identification',
  templateUrl: './solar-panel-identification.component.html',
  styleUrls: ['./solar-panel-identification.component.css']
})
export class SolarPanelIdentificationComponent implements OnInit {
  
  constructor(
    private fb: NonNullableFormBuilder,
    private _solarPanelDataService: SolarPanelDataService,
    private _solarPanelService: SolarPanelService,

    private serialNumberValidator: SerialNumberValidator //TODO: Use async validator to check the serial number
  ){}

  ngOnInit() {
    this.getManufacturer(this.solarPanelForm.controls.category.value);
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
    
    this._solarPanelService.setSolarPanelIdentificationValues(solarPanelIdentification);
  }

  onReset(e:Event) {
    e.preventDefault(); // Prevent the default behavior. The disabled input will not appear empty and will preserve its value
    this.solarPanelForm.reset();
    this.clearAvailableModelsAndTypes(); // clear model and type arrays
  }

// **********************************
// *** POPULATE DATA MATRIX FIELDS
// **********************************

  availableManufacturers: string[] = [];
  availableModels: string[] = [];
  availableTypes: string[] = [];

  clearAvailableModelsAndTypes() {
    this.availableModels = [];
    this.availableTypes = [];
  }

  getManufacturer(category: string) {   
    this.availableManufacturers = this._solarPanelDataService.getManufacturers(category);
  }

  getModelsAndTypes(manufacturer: string) {
    
    if (manufacturer === "") {// Do not execute a request if manufacturer is empty. Happens when form is reset
      return;
    }
    
    this.clearAvailableModelsAndTypes();

    this._solarPanelDataService.getModelsAndTypes(manufacturer)?.forEach(modelAndDTO => {
      this.availableModels.push(modelAndDTO.model);
      this.availableTypes.push(modelAndDTO.type);
    });

    // Need to reset values, when you repopulate the models and types arrays
    // the option doesn't appear in the select input BUT it's saved in the form 
    // causing the controls to be valid
    this.solarPanelForm.controls.modelAndType.reset();
  }

}
