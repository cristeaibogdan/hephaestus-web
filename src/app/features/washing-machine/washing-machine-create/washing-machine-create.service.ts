import {Injectable, Signal, inject, signal, computed} from "@angular/core";
import { firstValueFrom, switchMap } from "rxjs";
import { CreateWashingMachineRequest } from '../models/endpoints/create-washing-machine.endpoint';
import { ImageFile } from "../models/image-file.model";
import { Identification } from "../models/identification.model";
import { WashingMachineApi } from "../washing-machine.api";
import { Recommendation } from "../enums/recommendation.enum";
import { Damage } from "../models/detail.model";
import { ReturnType } from "../enums/return-type.enum";
import { DamageType } from "../enums/damage-type.enum";
import { IdentificationMode } from "../enums/identification-mode.enum";

@Injectable({providedIn: 'root'})
export class WashingMachineCreateService {
  private _washingMachineApi = inject(WashingMachineApi);

// **************************************
// *** STEP 1 = PRODUCT IDENTIFICATION
// **************************************

  private readonly identificationDefault: Identification = {
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

  private readonly _identification = signal<Identification>(this.identificationDefault);
  readonly identification = computed(() => Object.freeze(this._identification()));

  setIdentification(identification: Identification): void {
    this._identification.set(identification);
  }

  resetIdentification(): void {
    this._identification.set(this.identificationDefault);
  }

// *****************************************
// *** STEP 2 = PRODUCT DAMAGE ASSESSMENT
// *****************************************

  private readonly damageDefault: Damage = {
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

  private readonly _damage = signal<Damage>(this.damageDefault);
  readonly damage = computed(() => Object.freeze(this._damage()));

  setDamage(damage: Damage): void {
    this._damage.set(damage);
  }

  resetDamage(): void {
    this._damage.set(this.damageDefault);
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
    const identification = this._identification();
    const damage = this._damage();

    const createWashingMachineRequest: CreateWashingMachineRequest = {
      category: identification.category,
      manufacturer: identification.manufacturer,

      damageType: identification.damageType,
      returnType: identification.returnType,
      identificationMode: identification.identificationMode,

      serialNumber: identification.serialNumber,
      model: identification.model,
      type: identification.type,

      washingMachineDetail: {
        packageDamaged: damage.packageDamaged,
        packageDirty: damage.packageDirty,
        packageMaterialAvailable: damage.packageMaterialAvailable,

        visibleSurfacesScratchesLength: damage.visibleSurfacesScratchesLength,
        visibleSurfacesDentsDepth: damage.visibleSurfacesDentsDepth,
        visibleSurfacesMinorDamage: damage.visibleSurfacesMinorDamage,
        visibleSurfacesMajorDamage: damage.visibleSurfacesMajorDamage,

        hiddenSurfacesScratchesLength: damage.hiddenSurfacesScratchesLength,
        hiddenSurfacesDentsDepth: damage.hiddenSurfacesDentsDepth,
        hiddenSurfacesMinorDamage: damage.hiddenSurfacesMinorDamage,
        hiddenSurfacesMajorDamage: damage.hiddenSurfacesMajorDamage,

        price: damage.price,
        repairPrice: damage.repairPrice
      }
    };

    console.log("Saving = ", createWashingMachineRequest);
    const formData = new FormData();
    formData.append("createWashingMachineRequest", new Blob ([JSON.stringify(createWashingMachineRequest)], {type: 'application/json'}));

    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file.file);
    });

    return firstValueFrom(this._washingMachineApi.create(formData).pipe(
      switchMap(() => {
        return this._washingMachineApi.getRecommendation(identification.serialNumber);
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
