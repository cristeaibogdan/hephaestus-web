import { Injectable } from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import { BehaviorSubject} from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { WashingMachineDetailsDTO } from "../models/dtos/washing-machine-details.dto";
import { WashingMachineDTO } from "../models/dtos/washing-machine.dto";
import { ImageFile } from "../models/image-file.model";
import { WashingMachineIdentification } from "../models/washing-machine-identification.model";
import { WashingMachineDataService } from "./washing-machine.data.service";
import { NotificationService } from "src/app/services/notification.service";


@Injectable({providedIn: 'root'})
export class WashingMachineService {
  
  constructor(
    private _washingMachineDataService: WashingMachineDataService,
    private _notifService: NotificationService,
    private translate: TranslateService 
  ) { }

// **************************************
// *** STEP 1 = PRODUCT IDENTIFICATION
// **************************************

  private washingMachine = new BehaviorSubject<WashingMachineDTO>({
    category:"",

    damageType:"",
    returnType:"",
    identificationMode:"",
    
    manufacturer:"",
    serialNumber:"",
    model:"",
    type:"",

    damageLevel:0,
    recommendation:""
  });

  getWashingMachine() {
    return this.washingMachine.asObservable();
  }

  getSerialNumber() {
    return this.washingMachine.value.serialNumber;
  }

  setWashingMachineIdentificationValues(washingMachineIdentification:WashingMachineIdentification) {
    this.washingMachine.value.category = washingMachineIdentification.category;
    this.washingMachine.value.damageType = washingMachineIdentification.damageType;
    this.washingMachine.value.returnType = washingMachineIdentification.returnType;
    this.washingMachine.value.identificationMode = washingMachineIdentification.identificationMode;
    this.washingMachine.value.manufacturer = washingMachineIdentification.manufacturer;
    this.washingMachine.value.serialNumber = washingMachineIdentification.serialNumber;
    this.washingMachine.value.model = washingMachineIdentification.model;
    this.washingMachine.value.type = washingMachineIdentification.type;
  }

  resetWashingMachineIdentificationValues() {
    this.washingMachine.value.damageType = "";
    this.washingMachine.value.returnType = "";
    this.washingMachine.value.identificationMode = "";

    this.washingMachine.value.manufacturer = "";
    this.washingMachine.value.serialNumber = "";
    this.washingMachine.value.model = "";
    this.washingMachine.value.type = "";

    this.washingMachine.value.damageLevel = 0;
    this.washingMachine.value.recommendation = "";    
  }

// **************************************
// *** STEP 1.1 = PRODUCT IDENTIFICATION - CAMERA DIALOG
// **************************************

private stepperContainer!: MatStepper;

setStepper(stepper :MatStepper) {
  this.stepperContainer = stepper;
}

nextStep() {
  this.stepperContainer?.next();   
}

previousStep() {
  this.stepperContainer?.previous();   
}
  
// *****************************************
// *** STEP 2 = PRODUCT DAMAGE ASSESSMENT
// *****************************************

  private washingMachineDetails = new BehaviorSubject<WashingMachineDetailsDTO>({
    applicablePackageDamage:false,
    packageDamaged:false,
    packageDirty:false,
    packageMaterialAvailable:false,


    applicableVisibleSurfacesDamage:false,

    visibleSurfacesHasScratches:false,
    visibleSurfacesScratchesLength:0,

    visibleSurfacesHasDents:false,
    visibleSurfacesDentsDepth:0,

    visibleSurfacesHasMinorDamage:false,
    visibleSurfacesMinorDamage:"",

    visibleSurfacesHasMajorDamage:false,
    visibleSurfacesMajorDamage:"",


    applicableHiddenSurfacesDamage:false,

    hiddenSurfacesHasScratches:false,
    hiddenSurfacesScratchesLength:0,

    hiddenSurfacesHasDents:false,
    hiddenSurfacesDentsDepth:0,

    hiddenSurfacesHasMinorDamage:false,
    hiddenSurfacesMinorDamage:"",

    hiddenSurfacesHasMajorDamage:false,
    hiddenSurfacesMajorDamage:"",

    price:0,
    repairPrice:0
  });

  setWashingMachineDetails(washingMachineDetails:WashingMachineDetailsDTO) {
    this.washingMachineDetails.next(washingMachineDetails);
  }

  getWashingMachineDetails() {
    return this.washingMachineDetails.asObservable();
  }

// **************************************
// *** STEP 2 = SELECTED FILES
// **************************************
  
  private selectedFiles!:ImageFile[];

  setSelectedFiles(selectedFiles :ImageFile[]) {
    this.selectedFiles = selectedFiles;
  }

  getSelectedFiles() {
    return this.selectedFiles;
  }
    
// **************************************
// *** RESETS FOR STEP 2
// **************************************

  resetWashingMachineDamageAssessmentValues() {    
    this.washingMachineDetails.value.applicablePackageDamage = false;
    this.washingMachineDetails.value.packageDamaged = false;
    this.washingMachineDetails.value.packageDirty = false;
    this.washingMachineDetails.value.packageMaterialAvailable = false;


    this.washingMachineDetails.value.applicableVisibleSurfacesDamage = false;

    this.washingMachineDetails.value.visibleSurfacesHasScratches = false;   
    this.washingMachineDetails.value.visibleSurfacesScratchesLength = 0;

    this.washingMachineDetails.value.visibleSurfacesHasDents = false;   
    this.washingMachineDetails.value.visibleSurfacesDentsDepth = 0;

    this.washingMachineDetails.value.visibleSurfacesHasMinorDamage = false;   
    this.washingMachineDetails.value.visibleSurfacesMinorDamage = "";

    this.washingMachineDetails.value.visibleSurfacesHasMajorDamage = false;   
    this.washingMachineDetails.value.visibleSurfacesMajorDamage = "";

    
    this.washingMachineDetails.value.applicableHiddenSurfacesDamage = false;

    this.washingMachineDetails.value.hiddenSurfacesHasScratches = false;   
    this.washingMachineDetails.value.hiddenSurfacesScratchesLength = 0;

    this.washingMachineDetails.value.hiddenSurfacesHasDents = false;   
    this.washingMachineDetails.value.hiddenSurfacesDentsDepth = 0;

    this.washingMachineDetails.value.hiddenSurfacesHasMinorDamage = false;   
    this.washingMachineDetails.value.hiddenSurfacesMinorDamage = "";

    this.washingMachineDetails.value.hiddenSurfacesHasMajorDamage = false;   
    this.washingMachineDetails.value.hiddenSurfacesMajorDamage = "";

    this.washingMachineDetails.value.price = 0;   
    this.washingMachineDetails.value.repairPrice = 0; 
    
    this.selectedFiles = [];
  }

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

// Executes when NEXT on STEP 2 is clicked
  getDamageEvaluationAndGoToNextStep() {
    this._washingMachineDataService.getDamageEvaluation(this.washingMachineDetails.getValue()).subscribe(
      (response) => {        
      this.washingMachine.value.damageLevel = response.damageLevel;
      this.washingMachine.value.recommendation = response.recommendation;
      this.nextStep();
    });
  }

// **************************************
// *** STEP 4 = RECOMMENDED DECISION
// **************************************

  save() {
    const washingMachine:WashingMachineDTO = {
      category: this.washingMachine.value.category,
      manufacturer: this.washingMachine.value.manufacturer,

      damageType: this.washingMachine.value.damageType,
      returnType: this.washingMachine.value.returnType,
      identificationMode: this.washingMachine.value.identificationMode,
      
      serialNumber: this.washingMachine.value.serialNumber,
      model: this.washingMachine.value.model,
      type: this.washingMachine.value.type,

      damageLevel: this.washingMachine.value.damageLevel,
      recommendation: this.washingMachine.value.recommendation,
      
      washingMachineDetailsDTO: this.washingMachineDetails.getValue()
    };
    
    console.log("Saving = ", washingMachine);
    const formData = new FormData();
    formData.append("washingMachineDTO", new Blob ([JSON.stringify(washingMachine)],{type: 'application/json'}));

    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file.file);
    });

    this._washingMachineDataService.save(formData).subscribe(() => {
      this._notifService.showSuccess(this.translate.instant("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"),4000);       
    });
  }
  
}
