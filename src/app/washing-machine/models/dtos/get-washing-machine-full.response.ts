import { SearchWashingMachineResponse } from './search-washing-machine.response';

export interface GetWashingMachineFullResponse extends SearchWashingMachineResponse {
  washingMachineDetail?: WashingMachineDetail,
  washingMachineImages?: WashingMachineImage[]
}

export interface WashingMachineDetail {

    // PACKAGE
    applicablePackageDamage: boolean;
    packageDamaged: boolean;
    packageDirty: boolean;
    packageMaterialAvailable: boolean;

    // VISIBLE SURFACES
    applicableVisibleSurfacesDamage: boolean;

    visibleSurfacesHasScratches: boolean;
    visibleSurfacesScratchesLength: number;

    visibleSurfacesHasDents: boolean;
    visibleSurfacesDentsDepth: number;

    visibleSurfacesHasMinorDamage: boolean;
    visibleSurfacesMinorDamage: string;

    visibleSurfacesHasMajorDamage: boolean;
    visibleSurfacesMajorDamage: string;

    // HIDDEN SURFACES
    applicableHiddenSurfacesDamage: boolean;

    hiddenSurfacesHasScratches: boolean;
    hiddenSurfacesScratchesLength: number;

    hiddenSurfacesHasDents: boolean;
    hiddenSurfacesDentsDepth: number;

    hiddenSurfacesHasMinorDamage: boolean;
    hiddenSurfacesMinorDamage: string;

    hiddenSurfacesHasMajorDamage: boolean;
    hiddenSurfacesMajorDamage: string;

    // PRICING
    price: number;
    repairPrice: number;
}

export interface WashingMachineImage {
  imagePrefix: string;
  image: string;
}
