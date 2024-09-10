import { Injectable } from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import { BehaviorSubject} from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { WashingMachineDetailDTO } from "../models/dtos/washing-machine-detail.dto";
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
    private _translate: TranslateService 
  ) { }

// **************************************
// *** STEP 1 = PRODUCT IDENTIFICATION
// **************************************

  private washingMachine = new BehaviorSubject<WashingMachineDTO>({
    category: "",

    damageType: null,
    returnType: null,
    identificationMode: null,
    
    manufacturer: "",
    serialNumber: "",
    model: "",
    type: "",

    recommendation: null
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
    this.washingMachine.value.damageType = null;
    this.washingMachine.value.returnType = null;
    this.washingMachine.value.identificationMode = null;

    this.washingMachine.value.manufacturer = "";
    this.washingMachine.value.serialNumber = "";
    this.washingMachine.value.model = "";
    this.washingMachine.value.type = "";

    this.washingMachine.value.recommendation = null;
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

  private washingMachineDetail = new BehaviorSubject<WashingMachineDetailDTO>({
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

  setWashingMachineDetail(washingMachineDetail:WashingMachineDetailDTO) {
    this.washingMachineDetail.next(washingMachineDetail);
  }

  getWashingMachineDetail() {
    return this.washingMachineDetail.asObservable();
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
    this.washingMachineDetail.value.applicablePackageDamage = false;
    this.washingMachineDetail.value.packageDamaged = false;
    this.washingMachineDetail.value.packageDirty = false;
    this.washingMachineDetail.value.packageMaterialAvailable = false;


    this.washingMachineDetail.value.applicableVisibleSurfacesDamage = false;

    this.washingMachineDetail.value.visibleSurfacesHasScratches = false;   
    this.washingMachineDetail.value.visibleSurfacesScratchesLength = 0;

    this.washingMachineDetail.value.visibleSurfacesHasDents = false;   
    this.washingMachineDetail.value.visibleSurfacesDentsDepth = 0;

    this.washingMachineDetail.value.visibleSurfacesHasMinorDamage = false;   
    this.washingMachineDetail.value.visibleSurfacesMinorDamage = "";

    this.washingMachineDetail.value.visibleSurfacesHasMajorDamage = false;   
    this.washingMachineDetail.value.visibleSurfacesMajorDamage = "";

    
    this.washingMachineDetail.value.applicableHiddenSurfacesDamage = false;

    this.washingMachineDetail.value.hiddenSurfacesHasScratches = false;   
    this.washingMachineDetail.value.hiddenSurfacesScratchesLength = 0;

    this.washingMachineDetail.value.hiddenSurfacesHasDents = false;   
    this.washingMachineDetail.value.hiddenSurfacesDentsDepth = 0;

    this.washingMachineDetail.value.hiddenSurfacesHasMinorDamage = false;   
    this.washingMachineDetail.value.hiddenSurfacesMinorDamage = "";

    this.washingMachineDetail.value.hiddenSurfacesHasMajorDamage = false;   
    this.washingMachineDetail.value.hiddenSurfacesMajorDamage = "";

    this.washingMachineDetail.value.price = 0;   
    this.washingMachineDetail.value.repairPrice = 0; 
    
    this.selectedFiles = [];
  }

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

// Executes when NEXT on STEP 2 is clicked
  getRecommendationAndGoToNextStep() {
    this._washingMachineDataService.getRecommendation(this.washingMachineDetail.getValue()).subscribe(
      (response) => {        
      this.washingMachine.value.recommendation = response;
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

      recommendation: this.washingMachine.value.recommendation,
      
      washingMachineDetailDTO: this.washingMachineDetail.getValue()
    };
    
    console.log("Saving = ", washingMachine);
    const formData = new FormData();
    formData.append("washingMachineDTO", new Blob ([JSON.stringify(washingMachine)],{type: 'application/json'}));

    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file.file);
    });

    this._washingMachineDataService.save(formData).subscribe(() => {
      this._notifService.showSuccess(this._translate.instant("I18N.CUSTOM_SUCCESS.PRODUCT_SAVED"),4000);       
    });
  }
  
}
