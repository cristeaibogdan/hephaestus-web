import { expect } from "@playwright/test";
import { TEST_FILES } from "tests/assets/file.provider";
import { customTest } from "tests/base";
import { WashingMachineHistoryPom } from "tests/washing-machine/pages/washing-machine-history.pom";

customTest('create and view washing machine', async ({ washingMachineCreatePom, washingMachineHistoryPom }) => {
  await washingMachineCreatePom.goto();

  const damageStep = washingMachineCreatePom.damageStep();
  const identificationStep = washingMachineCreatePom.identificationStep();

  // 1. Identification
  await identificationStep.selectIdentificationMode('Data Matrix');
  await identificationStep.selectManufacturer('Bosch');
  await identificationStep.selectModel('WGB256A1GB');
  await identificationStep.selectType('BOS001');
  await identificationStep.fillSerialNumber('Un serial');
  await identificationStep.selectReturnType('Service');
  await identificationStep.selectDamageType('In Use');
  await identificationStep.next();

  // 2. Damage
  await damageStep.uploadImages(
    TEST_FILES.images.jpg.landscape,
    TEST_FILES.images.jpeg.mountains,
    TEST_FILES.images.bmp.trail,
  );

  await damageStep.enablePackageApplicable();
  await damageStep.checkPackageApplicableDamaged();
  await damageStep.checkPackageApplicableDirty();
  await damageStep.checkPackageApplicableRepackage();

  const visibleSurfaces = damageStep.visibleSurfaces();
  await visibleSurfaces.enable();
  await visibleSurfaces.checkScratches();
  await visibleSurfaces.fillScratchesLength(5);
  await visibleSurfaces.checkDents();
  await visibleSurfaces.fillDentsDepth(8.5);
  await visibleSurfaces.checkMinorDamages();
  await visibleSurfaces.fillMinorDamages("Some Minor Damages");
  await visibleSurfaces.checkMajorDamages();
  await visibleSurfaces.fillMajorDamages("Some Major major Damages");

  const hiddenSurfaces = damageStep.hiddenSurfaces();
  await hiddenSurfaces.enable();
  await hiddenSurfaces.checkScratches();
  await hiddenSurfaces.fillScratchesLength(9);
  await hiddenSurfaces.checkDents();
  await hiddenSurfaces.fillDentsDepth(10);
  await hiddenSurfaces.checkMinorDamages();
  await hiddenSurfaces.fillMinorDamages("Some tiny minor hidden Damage");
  await hiddenSurfaces.checkMajorDamages();
  await hiddenSurfaces.fillMajorDamages("Some Major hidden Damage");

  await damageStep.fillProductPrice(100);
  await damageStep.fillProductRepairPrice(20);
  await damageStep.next();

  // 3. Overview
  const overview = washingMachineCreatePom.overviewStep();
  await expect(overview.category()).toContainText('Washing Machine');
  await expect(overview.manufacturer()).toContainText('Bosch');
  await expect(overview.serialNumber()).toContainText('Un serial');
  await expect(overview.model()).toContainText('WGB256A1GB');
  await expect(overview.type()).toContainText('BOS001');
  await expect(overview.identificationMode()).toContainText('Data Matrix');
  await expect(overview.returnType()).toContainText('Service');
  await expect(overview.damageType()).toContainText('In Use');

  await expect(overview.images()).toHaveCount(3);

  await expect(overview.packageDamaged()).toBeVisible();
  await expect(overview.packageDirty()).toBeVisible();
  await expect(overview.packageMaterialAvailable()).toBeVisible();

  await expect(overview.visibleSurfacesScratchesLength()).toContainText('5');
  await expect(overview.visibleSurfacesDentsDepth()).toContainText('8.5');
  await expect(overview.visibleSurfacesMinorDamages()).toContainText('Some Minor Damages');
  await expect(overview.visibleSurfacesMajorDamages()).toContainText('Some Major major Damages');

  await expect(overview.hiddenSurfacesScratchesLength()).toContainText('9');
  await expect(overview.hiddenSurfacesDentsDepth()).toContainText('10');
  await expect(overview.hiddenSurfacesMinorDamages()).toContainText('Some tiny minor hidden Damage');
  await expect(overview.hiddenSurfacesMajorDamages()).toContainText('Some Major hidden Damage');

  await expect(overview.productPrice()).toContainText('100 €');
  await expect(overview.repairPrice()).toContainText('20 €');

  // extract all these fields into a type so we can assert them in the history page
  // add function to click on next

  // 4. Overview
  // Check if page loaded succesfully.

  // 5. History
  await washingMachineHistoryPom.goto();

  const row = washingMachineHistoryPom.findRowBySerialNumber('fasda');

  await expect(row.manufacturer()).toHaveText('Bosch');
  await expect(row.model()).toHaveText('WGB256A1GB');
  await expect(row.type()).toHaveText('N/A');

  async function filterBySerialNumber(washingMachineHistoryPagePom: WashingMachineHistoryPom, serialNumber: string) {
    await washingMachineHistoryPagePom.filterByCreatedDate('2026-03-06');
    await washingMachineHistoryPagePom.filterByIdentificationMode('Data Matrix');
    await washingMachineHistoryPagePom.filterByManufacturer('Bosch');
    await washingMachineHistoryPagePom.filterByModel('WGB256A1GB');
    await washingMachineHistoryPagePom.filterByType('N/A');

    await washingMachineHistoryPagePom.filterBySerialNumber(serialNumber);

    await washingMachineHistoryPagePom.filterByReturnType('Service');
    await washingMachineHistoryPagePom.filterByDamageType('In Use');
    await washingMachineHistoryPagePom.filterByRecommendation('REPACKAGE');
  }
});
