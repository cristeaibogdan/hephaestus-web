import { Injectable } from "@angular/core";
import { BehaviorSubject} from "rxjs";
import { WashingMachineDetailDTO } from "../models/dtos/washing-machine-detail.dto";
import { CreateWashingMachineRequest } from "../models/dtos/create-washing-machine-request.dto";
import { ImageFile } from "../models/image-file.model";
import { WashingMachineIdentification } from "../models/washing-machine-identification.model";
import { WashingMachineDataService } from "./washing-machine.data.service";
import { DamageType } from "../enums/damage-type.enum";
import { ReturnType } from "../enums/return-type.enum";
import { IdentificationMode } from "../enums/identification-mode.enum";

@Injectable({providedIn: 'root'})
export class WashingMachineService {
  
  constructor(
    private _washingMachineDataService: WashingMachineDataService
  ) { }

// **************************************
// *** STEP 1 = PRODUCT IDENTIFICATION
// **************************************

  private washingMachineIdentification$ = new BehaviorSubject<WashingMachineIdentification>({
    category: "",

    damageType: DamageType.IN_TRANSIT,
    returnType: ReturnType.COMMERCIAL,
    identificationMode: IdentificationMode.DATA_MATRIX,
    
    manufacturer: "",
    serialNumber: "",
    model: "",
    type: ""
  });

  getWashingMachineIdentification() {
    return this.washingMachineIdentification$.asObservable();
  }

  getSerialNumber() {
    return this.washingMachineIdentification$.value.serialNumber;
  }

  setWashingMachineIdentificationValues(washingMachineIdentification:WashingMachineIdentification) {
    this.washingMachineIdentification$.next(washingMachineIdentification);
  }

  resetWashingMachineIdentificationValues() {
    this.washingMachineIdentification$.value.damageType = DamageType.IN_TRANSIT;
    this.washingMachineIdentification$.value.returnType = ReturnType.COMMERCIAL;
    this.washingMachineIdentification$.value.identificationMode = IdentificationMode.DATA_MATRIX;

    this.washingMachineIdentification$.value.manufacturer = "";
    this.washingMachineIdentification$.value.serialNumber = "";
    this.washingMachineIdentification$.value.model = "";
    this.washingMachineIdentification$.value.type = "";
  }
  
// *****************************************
// *** STEP 2 = PRODUCT DAMAGE ASSESSMENT
// *****************************************

  private washingMachineDetail$ = new BehaviorSubject<WashingMachineDetailDTO>({
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
    this.washingMachineDetail$.next(washingMachineDetail);
  }

  getWashingMachineDetail() {
    return this.washingMachineDetail$.asObservable();
  }

// **************************************
// *** STEP 2 = SELECTED FILES
// **************************************
  
  private selectedFiles:ImageFile[] = [];

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
    this.washingMachineDetail$.value.applicablePackageDamage = false;
    this.washingMachineDetail$.value.packageDamaged = false;
    this.washingMachineDetail$.value.packageDirty = false;
    this.washingMachineDetail$.value.packageMaterialAvailable = false;


    this.washingMachineDetail$.value.applicableVisibleSurfacesDamage = false;

    this.washingMachineDetail$.value.visibleSurfacesHasScratches = false;   
    this.washingMachineDetail$.value.visibleSurfacesScratchesLength = 0;

    this.washingMachineDetail$.value.visibleSurfacesHasDents = false;   
    this.washingMachineDetail$.value.visibleSurfacesDentsDepth = 0;

    this.washingMachineDetail$.value.visibleSurfacesHasMinorDamage = false;   
    this.washingMachineDetail$.value.visibleSurfacesMinorDamage = "";

    this.washingMachineDetail$.value.visibleSurfacesHasMajorDamage = false;   
    this.washingMachineDetail$.value.visibleSurfacesMajorDamage = "";

    
    this.washingMachineDetail$.value.applicableHiddenSurfacesDamage = false;

    this.washingMachineDetail$.value.hiddenSurfacesHasScratches = false;   
    this.washingMachineDetail$.value.hiddenSurfacesScratchesLength = 0;

    this.washingMachineDetail$.value.hiddenSurfacesHasDents = false;   
    this.washingMachineDetail$.value.hiddenSurfacesDentsDepth = 0;

    this.washingMachineDetail$.value.hiddenSurfacesHasMinorDamage = false;   
    this.washingMachineDetail$.value.hiddenSurfacesMinorDamage = "";

    this.washingMachineDetail$.value.hiddenSurfacesHasMajorDamage = false;   
    this.washingMachineDetail$.value.hiddenSurfacesMajorDamage = "";

    this.washingMachineDetail$.value.price = 0;   
    this.washingMachineDetail$.value.repairPrice = 0; 
    
    this.selectedFiles = [];
  }

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************


// **************************************
// *** STEP 4 = RECOMMENDED DECISION
// **************************************

  save(): Promise<boolean> {
    const washingMachine: CreateWashingMachineRequest = {
      category: this.washingMachineIdentification$.value.category,
      manufacturer: this.washingMachineIdentification$.value.manufacturer,

      damageType: this.washingMachineIdentification$.value.damageType,
      returnType: this.washingMachineIdentification$.value.returnType,
      identificationMode: this.washingMachineIdentification$.value.identificationMode,
      
      serialNumber: this.washingMachineIdentification$.value.serialNumber,
      model: this.washingMachineIdentification$.value.model,
      type: this.washingMachineIdentification$.value.type,
      
      washingMachineDetailDTO: this.washingMachineDetail$.getValue()
    };
    
    console.log("Saving = ", washingMachine);
    const formData = new FormData();
    formData.append("createWashingMachineRequest", new Blob ([JSON.stringify(washingMachine)],{type: 'application/json'}));

    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file.file);
    });

    return new Promise((resolve) => {
      this._washingMachineDataService.save(formData).subscribe({
        next: () => {          
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      })
    });
  }
}