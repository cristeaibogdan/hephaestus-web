export interface WashingMachineDetailParams{
  // PACKAGE
  packageDamaged: boolean,
  packageDirty: boolean,
  packageMaterialAvailable: boolean,
  
  // VISIBLE SURFACES
  visibleSurfacesHasScratches: boolean,
  visibleSurfacesScratchesLength: number,
  
  visibleSurfacesHasDents: boolean,
  visibleSurfacesDentsDepth: number,
  
  visibleSurfacesHasMinorDamage: boolean,
  visibleSurfacesMinorDamage: string,
  
  visibleSurfacesHasMajorDamage: boolean,
  visibleSurfacesMajorDamage: string,
  
  // HIDDEN SURFACES
  hiddenSurfacesHasScratches: boolean,
  hiddenSurfacesScratchesLength: number,
  
  hiddenSurfacesHasDents: boolean,
  hiddenSurfacesDentsDepth: number,
  
  hiddenSurfacesHasMinorDamage: boolean,
  hiddenSurfacesMinorDamage: string,
  
  hiddenSurfacesHasMajorDamage: boolean,
  hiddenSurfacesMajorDamage: string,
  
  // PRICING
  price: number,
  repairPrice: number
}

export class WashingMachineDetailDTO {
    // PACKAGE
    packageDamaged: boolean;
    packageDirty: boolean;
    packageMaterialAvailable: boolean;
    
    // VISIBLE SURFACES
    visibleSurfacesHasScratches: boolean;
    visibleSurfacesScratchesLength: number;
    
    visibleSurfacesHasDents: boolean;
    visibleSurfacesDentsDepth: number;
    
    visibleSurfacesHasMinorDamage: boolean;
    visibleSurfacesMinorDamage: string;
    
    visibleSurfacesHasMajorDamage: boolean;
    visibleSurfacesMajorDamage: string;
    
    // HIDDEN SURFACES
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

  constructor(params: WashingMachineDetailParams) {
    this.packageDamaged = params.packageDamaged;
    this.packageDirty = params.packageDirty;
    this.packageMaterialAvailable = params.packageMaterialAvailable;
    
    // VISIBLE SURFACES
    this.visibleSurfacesHasScratches = params.visibleSurfacesHasScratches;
    this.visibleSurfacesScratchesLength = params.visibleSurfacesScratchesLength;
    
    this.visibleSurfacesHasDents = params.visibleSurfacesHasDents;
    this.visibleSurfacesDentsDepth = params.visibleSurfacesDentsDepth;
    
    this.visibleSurfacesHasMinorDamage = params.visibleSurfacesHasMinorDamage;
    this.visibleSurfacesMinorDamage = params.visibleSurfacesMinorDamage;
    
    this.visibleSurfacesHasMajorDamage = params.visibleSurfacesHasMajorDamage;
    this.visibleSurfacesMajorDamage = params.visibleSurfacesMajorDamage;
    
    // HIDDEN SURFACES
    this.hiddenSurfacesHasScratches = params.hiddenSurfacesHasScratches;
    this.hiddenSurfacesScratchesLength = params.hiddenSurfacesScratchesLength;
    
    this.hiddenSurfacesHasDents = params.hiddenSurfacesHasDents;
    this.hiddenSurfacesDentsDepth = params.hiddenSurfacesDentsDepth;
    
    this.hiddenSurfacesHasMinorDamage = params.hiddenSurfacesHasMinorDamage;
    this.hiddenSurfacesMinorDamage = params.hiddenSurfacesMinorDamage;
    
    this.hiddenSurfacesHasMajorDamage = params.hiddenSurfacesHasMajorDamage;
    this.hiddenSurfacesMajorDamage = params.hiddenSurfacesMajorDamage;
    
    // PRICING
    this.price = params.price;
    this.repairPrice = params.repairPrice;
  }

  isApplicablePackageDamage() {
    return this.packageDamaged || 
      this.packageDirty || 
      this.packageMaterialAvailable;
  }

  isApplicableVisibleSurfacesDamage() {
    return this.visibleSurfacesHasScratches ||
      this.visibleSurfacesHasDents ||
      this.visibleSurfacesHasMinorDamage ||
      this.visibleSurfacesHasMajorDamage;
  }

  isApplicableHiddenSurfacesDamage() {
    return this.hiddenSurfacesHasScratches ||
      this.hiddenSurfacesHasDents ||
      this.hiddenSurfacesHasMinorDamage ||
      this.hiddenSurfacesHasMajorDamage;
  }
}
