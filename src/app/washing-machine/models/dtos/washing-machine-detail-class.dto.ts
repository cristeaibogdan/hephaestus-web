export class WashingMachineDetailClassDTO {
  constructor(
    // PACKAGE
    public packageDamaged: boolean,
    public packageDirty: boolean,
    public packageMaterialAvailable: boolean,

    // VISIBLE SURFACES
    public visibleSurfacesHasScratches: boolean,
    public visibleSurfacesScratchesLength: number,

    public visibleSurfacesHasDents: boolean,
    public visibleSurfacesDentsDepth: number,

    public visibleSurfacesHasMinorDamage: boolean,
    public visibleSurfacesMinorDamage: string,

    public visibleSurfacesHasMajorDamage: boolean,
    public visibleSurfacesMajorDamage: string,

    // HIDDEN SURFACES
    public hiddenSurfacesHasScratches: boolean,
    public hiddenSurfacesScratchesLength: number,

    public hiddenSurfacesHasDents: boolean,
    public hiddenSurfacesDentsDepth: number,

    public hiddenSurfacesHasMinorDamage: boolean,
    public hiddenSurfacesMinorDamage: string,

    public hiddenSurfacesHasMajorDamage: boolean,
    public hiddenSurfacesMajorDamage: string,

    // PRICING
    public price: number,
    public repairPrice: number
  ) {}

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
