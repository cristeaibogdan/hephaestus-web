import { Injectable, Signal, inject, signal } from "@angular/core";
import { firstValueFrom, switchMap } from "rxjs";
import { CreateWashingMachineRequest } from '../models/endpoints/create-washing-machine.endpoint';
import { ImageFile } from "../models/image-file.model";
import { WashingMachineIdentification } from "../models/washing-machine-identification.model";
import { WashingMachineDataService } from "./washing-machine.data.service";
import { Recommendation } from "../enums/recommendation.enum";
import { WashingMachineDetail } from "../models/washing-machine-detail.model";
import { ReturnType } from "../enums/return-type.enum";
import { DamageType } from "../enums/damage-type.enum";
import { IdentificationMode } from "../enums/identification-mode.enum";

@Injectable({providedIn: 'root'})
export class WashingMachineService {
  private _washingMachineDataService = inject(WashingMachineDataService);

// **************************************
// *** STEP 1 = PRODUCT IDENTIFICATION
// **************************************

  private readonly washingMachineIdentificationDefault: WashingMachineIdentification = {
    identificationMode: IdentificationMode.QR_CODE,
    category: "",
    manufacturer: "",
    model: "",
    type: "",
    serialNumber: "",
    returnType: ReturnType.SERVICE,
    damageType: DamageType.IN_USE 
    // TODO: Possible solution is to add a DEFAULT to each enum.
    // Possible solution = add DEFAULT, but exclude the option in each select, so inputs remain invalid
  }
  
  private washingMachineIdentification = signal<WashingMachineIdentification>(this.washingMachineIdentificationDefault);

  getWashingMachineIdentification(): Signal<WashingMachineIdentification> {
    return this.washingMachineIdentification.asReadonly();
  }

  setWashingMachineIdentification(washingMachineIdentification: WashingMachineIdentification): void {
    this.washingMachineIdentification.set(washingMachineIdentification);
  }

  resetWashingMachineIdentification(): void {
    this.washingMachineIdentification.set(this.washingMachineIdentificationDefault);
  }
  
// *****************************************
// *** STEP 2 = PRODUCT DAMAGE ASSESSMENT
// *****************************************

  private readonly washingMachineDetailDefault: WashingMachineDetail = {
    applicablePackageDamage: false,
    packageDamaged: false,
    packageDirty: false,
    packageMaterialAvailable: false,

    applicableVisibleSurfacesDamage: false,
    visibleSurfacesHasScratches: false,
    visibleSurfacesScratchesLength: 0,
    visibleSurfacesHasDents: false,
    visibleSurfacesDentsDepth: 0,
    visibleSurfacesHasMinorDamage: false,
    visibleSurfacesMinorDamage: "",
    visibleSurfacesHasMajorDamage: false,
    visibleSurfacesMajorDamage: "",

    applicableHiddenSurfacesDamage: false,
    hiddenSurfacesHasScratches: false,
    hiddenSurfacesScratchesLength: 0,
    hiddenSurfacesHasDents: false,
    hiddenSurfacesDentsDepth: 0,
    hiddenSurfacesHasMinorDamage: false,
    hiddenSurfacesMinorDamage: "",
    hiddenSurfacesHasMajorDamage: false,
    hiddenSurfacesMajorDamage: "",

    price: 0,
    repairPrice: 0
  };

  private washingMachineDetail = signal<WashingMachineDetail>(this.washingMachineDetailDefault);

  setWashingMachineDetail(washingMachineDetail: WashingMachineDetail): void {
    this.washingMachineDetail.set(washingMachineDetail);
  }

  getWashingMachineDetail(): Signal<WashingMachineDetail> {
    return this.washingMachineDetail.asReadonly();
  }

  resetWashingMachineDetail(): void {
    this.washingMachineDetail.set(this.washingMachineDetailDefault);
  }

// **************************************
// *** STEP 2 = SELECTED FILES
// **************************************
  
  private selectedFiles: ImageFile[] = [];

  setSelectedFiles(selectedFiles: ImageFile[]): void {
    this.selectedFiles = selectedFiles;
  }

  getSelectedFiles(): ImageFile[] {
    return this.selectedFiles;
  }

  clearSelectedFiles(): void {
    this.selectedFiles = [];
  }

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  create(): Promise<boolean> {
    const washingMachineIdentification = this.washingMachineIdentification();
    const washingMachineDetail = this.washingMachineDetail();

    const createWashingMachineRequest: CreateWashingMachineRequest = {
      category: washingMachineIdentification.category,
      manufacturer: washingMachineIdentification.manufacturer,

      damageType: washingMachineIdentification.damageType,
      returnType: washingMachineIdentification.returnType,
      identificationMode: washingMachineIdentification.identificationMode,
      
      serialNumber: washingMachineIdentification.serialNumber,
      model: washingMachineIdentification.model,
      type: washingMachineIdentification.type,
      
      washingMachineDetail: {
        packageDamaged: washingMachineDetail.packageDamaged,
        packageDirty: washingMachineDetail.packageDirty,
        packageMaterialAvailable: washingMachineDetail.packageMaterialAvailable,

        visibleSurfacesScratchesLength: washingMachineDetail.visibleSurfacesScratchesLength,
        visibleSurfacesDentsDepth: washingMachineDetail.visibleSurfacesDentsDepth,
        visibleSurfacesMinorDamage: washingMachineDetail.visibleSurfacesMinorDamage,
        visibleSurfacesMajorDamage: washingMachineDetail.visibleSurfacesMajorDamage,

        hiddenSurfacesScratchesLength: washingMachineDetail.hiddenSurfacesScratchesLength,
        hiddenSurfacesDentsDepth: washingMachineDetail.hiddenSurfacesDentsDepth,
        hiddenSurfacesMinorDamage: washingMachineDetail.hiddenSurfacesMinorDamage,
        hiddenSurfacesMajorDamage: washingMachineDetail.hiddenSurfacesMajorDamage,

        price: washingMachineDetail.price,
        repairPrice: washingMachineDetail.repairPrice
      }
    };
    
    console.log("Saving = ", createWashingMachineRequest);
    const formData = new FormData();
    formData.append("createWashingMachineRequest", new Blob ([JSON.stringify(createWashingMachineRequest)], {type: 'application/json'}));

    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file.file);
    });

    return firstValueFrom(this._washingMachineDataService.create(formData).pipe(
      switchMap(() => {
        return this._washingMachineDataService.getRecommendation(washingMachineIdentification.serialNumber);
      })
    )).then((response) => {
      this.recommendation = response;
      return true;
    });
  }

// **************************************
// *** STEP 4 = RECOMMENDED DECISION
// **************************************

  private recommendation!: Recommendation;

  getRecommendation(): Recommendation {
    return this.recommendation;
  }  
}