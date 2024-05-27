export interface WashingMachineDetailsDTO {
  
// PACKAGE
    applicablePackageDamage:boolean,
    packageDamaged:boolean,
    packageDirty:boolean,
    packageMaterialAvailable:boolean,

// VISIBLE SURFACES
    applicableVisibleSurfacesDamage:boolean,

    visibleSurfacesHasScratches:boolean,
    visibleSurfacesScratchesLength:number,

    visibleSurfacesHasDents:boolean,
    visibleSurfacesDentsDepth:number,

    visibleSurfacesHasSmallDamage:boolean,
    visibleSurfacesSmallDamage:string,

    visibleSurfacesHasBigDamage:boolean,
    visibleSurfacesBigDamage:string,

// HIDDEN SURFACES
    applicableHiddenSurfacesDamage:boolean,

    hiddenSurfacesHasScratches:boolean,
    hiddenSurfacesScratchesLength:number,

    hiddenSurfacesHasDents:boolean,
    hiddenSurfacesDentsDepth:number,

    hiddenSurfacesHasSmallDamage:boolean,
    hiddenSurfacesSmallDamage:string,

    hiddenSurfacesHasBigDamage:boolean,
    hiddenSurfacesBigDamage:string,

// PRICING
    price:number,
    repairPrice:number
}