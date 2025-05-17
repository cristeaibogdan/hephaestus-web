import { Injectable, Signal, inject, signal } from "@angular/core";
import { BehaviorSubject, firstValueFrom, Observable, switchMap } from "rxjs";
import { CreateWashingMachineRequest } from "../models/dtos/create-washing-machine.request";
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

  private washingMachineDetail$ = new BehaviorSubject<WashingMachineDetail | null>(null);

  setWashingMachineDetail(washingMachineDetail: WashingMachineDetail): void {
    this.washingMachineDetail$.next(washingMachineDetail);
  }

  getWashingMachineDetail(): Observable<WashingMachineDetail | null> {
    return this.washingMachineDetail$.asObservable();
  }

  resetWashingMachineDetail(): void {
    this.washingMachineDetail$.next(null);
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

  save(): Promise<boolean> {
    const washingMachineIdentification = this.washingMachineIdentification();

    if (this.washingMachineDetail$.value == null) {
      return Promise.reject(); //TODO: Remove this once Detail is a Signal
    }

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
    
    console.log("Saving = ", createWashingMachineRequest);
    const formData = new FormData();
    formData.append("createWashingMachineRequest", new Blob ([JSON.stringify(createWashingMachineRequest)],{type: 'application/json'}));

    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file.file);
    });

    return firstValueFrom(this._washingMachineDataService.save(formData).pipe(
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