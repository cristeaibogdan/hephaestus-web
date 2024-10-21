import { Injectable } from "@angular/core";
import { BehaviorSubject, switchMap} from "rxjs";
import { CreateWashingMachineRequest } from "../models/dtos/create-washing-machine-request.dto";
import { ImageFile } from "../models/image-file.model";
import { WashingMachineIdentification } from "../models/washing-machine-identification.model";
import { WashingMachineDataService } from "./washing-machine.data.service";
import { DamageType } from "../enums/damage-type.enum";
import { ReturnType } from "../enums/return-type.enum";
import { IdentificationMode } from "../enums/identification-mode.enum";
import { Recommendation } from "../enums/recommendation.enum";
import { WashingMachineDetail } from "../models/washing-machine-detail.model";

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

  setWashingMachineIdentification(washingMachineIdentification: WashingMachineIdentification) {
    this.washingMachineIdentification$.next(washingMachineIdentification);
  }

  resetWashingMachineIdentification() {
    const initialWashingMachineIdentification: WashingMachineIdentification = {
      category: "",
      damageType: DamageType.IN_TRANSIT,
      returnType: ReturnType.COMMERCIAL,
      identificationMode: IdentificationMode.DATA_MATRIX,
      manufacturer: "",
      serialNumber: "",
      model: "",
      type: "",
    }
    this.washingMachineIdentification$.next(initialWashingMachineIdentification);
  }
  
// *****************************************
// *** STEP 2 = PRODUCT DAMAGE ASSESSMENT
// *****************************************

  private washingMachineDetail$ = new BehaviorSubject<WashingMachineDetail>({
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

  setWashingMachineDetail(washingMachineDetail: WashingMachineDetail) {
    this.washingMachineDetail$.next(washingMachineDetail);
  }

  getWashingMachineDetail() {
    return this.washingMachineDetail$.asObservable();
  }

  resetWashingMachineDetail() {    
    const initialWashingMachineDetail: WashingMachineDetail = {
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
    }
    this.washingMachineDetail$.next(initialWashingMachineDetail);
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

  clearSelectedFiles() {
    this.selectedFiles = [];
  }

// **************************************
// *** STEP 3 = OVERVIEW
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
      
      createWashingMachineDetailRequest: {
        packageDamaged: this.washingMachineDetail$.value.packageDamaged,
        packageDirty: this.washingMachineDetail$.value.packageDirty,
        packageMaterialAvailable: this.washingMachineDetail$.value.packageMaterialAvailable,

        visibleSurfacesScratchesLength: this.washingMachineDetail$.value.visibleSurfacesScratchesLength,
        visibleSurfacesDentsDepth: this.washingMachineDetail$.value.visibleSurfacesDentsDepth,
        visibleSurfacesMinorDamage: this.washingMachineDetail$.value.visibleSurfacesMinorDamage,
        visibleSurfacesMajorDamage: this.washingMachineDetail$.value.visibleSurfacesMajorDamage,

        hiddenSurfacesScratchesLength: this.washingMachineDetail$.value.hiddenSurfacesScratchesLength,
        hiddenSurfacesDentsDepth: this.washingMachineDetail$.value.hiddenSurfacesDentsDepth,
        hiddenSurfacesMinorDamage: this.washingMachineDetail$.value.hiddenSurfacesMinorDamage,
        hiddenSurfacesMajorDamage: this.washingMachineDetail$.value.hiddenSurfacesMajorDamage,

        price: this.washingMachineDetail$.value.price,
        repairPrice: this.washingMachineDetail$.value.repairPrice
      }
    };
    
    console.log("Saving = ", washingMachine);
    const formData = new FormData();
    formData.append("createWashingMachineRequest", new Blob ([JSON.stringify(washingMachine)],{type: 'application/json'}));

    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file.file);
    });

    return new Promise((resolve) => {
      this._washingMachineDataService.save(formData).pipe(
        switchMap(() => { 
          return this._washingMachineDataService.getRecommendation(this.washingMachineIdentification$.value.serialNumber)
        })
      ).subscribe({
        next: (response) => {
          this.recommendation = response;
          resolve(true);        
        },
        error: () => {
          resolve(false);
        },
      })
    });
  }

// **************************************
// *** STEP 4 = RECOMMENDED DECISION
// **************************************

  private recommendation!: Recommendation;

  getRecommendation() {
    return this.recommendation;
  }  
}