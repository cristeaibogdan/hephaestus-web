import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, switchMap, withLatestFrom} from "rxjs";
import { CreateWashingMachineRequest } from "../models/dtos/create-washing-machine.request";
import { ImageFile } from "../models/image-file.model";
import { WashingMachineIdentification } from "../models/washing-machine-identification.model";
import { WashingMachineDataService } from "./washing-machine.data.service";
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
  
  private washingMachineIdentification$ = new BehaviorSubject<WashingMachineIdentification | null>(null);

  getWashingMachineIdentification(): Observable<WashingMachineIdentification | null> {
    return this.washingMachineIdentification$.asObservable();
  }

  setWashingMachineIdentification(washingMachineIdentification: WashingMachineIdentification): void {
    this.washingMachineIdentification$.next(washingMachineIdentification);
  }

  resetWashingMachineIdentification(): void {
    this.washingMachineIdentification$.next(null);
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
    if (this.washingMachineIdentification$.value == null || this.washingMachineDetail$.value == null) {
      return Promise.reject();
    }

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
        withLatestFrom(this.getWashingMachineIdentification()),
        switchMap(([_, identification]) => {
          if(!identification) {
            return EMPTY;
          }
          return this._washingMachineDataService.getRecommendation(identification.serialNumber);
        })
      ).subscribe({
        next: (response) => {
          this.recommendation = response;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          throw error; // re-throw to be handled by GlobalErrorHandler
        },
      })
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