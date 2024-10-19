export interface CreateWashingMachineDetailRequest {
  
// PACKAGE
    packageDamaged:boolean,
    packageDirty:boolean,
    packageMaterialAvailable:boolean,

// VISIBLE SURFACES
    visibleSurfacesScratchesLength:number,
    visibleSurfacesDentsDepth:number,
    visibleSurfacesMinorDamage:string,
    visibleSurfacesMajorDamage:string,

// HIDDEN SURFACES
    hiddenSurfacesScratchesLength:number,
    hiddenSurfacesDentsDepth:number,
    hiddenSurfacesMinorDamage:string,
    hiddenSurfacesMajorDamage:string,

// PRICING
    price:number,
    repairPrice:number
}