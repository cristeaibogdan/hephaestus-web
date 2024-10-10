import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { SerialNumberValidator } from 'src/app/shared/validators/async-validators/serial-number.validator';
import { CustomValidators } from 'src/app/shared/validators/custom.validators';
import { SolarPanelDataService } from '../../services/solar-panel-data.service';

@Component({
  selector: 'app-solar-panel-identification',
  templateUrl: './solar-panel-identification.component.html',
  styleUrls: ['./solar-panel-identification.component.css']
})
export class SolarPanelIdentificationComponent implements OnInit {
  
  constructor(
    private fb: NonNullableFormBuilder,
    private serialNumberValidator: SerialNumberValidator, //TODO: Use async validator to check the serial number
    private _solarPanelDataService: SolarPanelDataService
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

    console.log("Identification submitted = ", this.solarPanelForm.getRawValue());
  }

  onReset(e:Event) {
    e.preventDefault(); // Prevent the default behavior. The disabled input will not appear empty and will preserve its value
    this.solarPanelForm.reset();
  }

// **********************************
// *** POPULATE DATA MATRIX FIELDS
// **********************************

  availableManufacturers: string[] = [];
  availableModels: string[] = ["SunMax Pro 300", "EcoSolar Ultra 500", "PowerPeak 350W", "SolarWave Infinity 420", "GreenLight Horizon 275"];
  availableTypes: string[] = ["QCPF-275-5B3F90", "QCUV-500-8D7E13", "BEPE-450-2E5F91", "BESM-300-7D1C37"];


  getManufacturer(category: string) {   
    this.availableManufacturers = this._solarPanelDataService.getManufacturers(category);
  }

}
