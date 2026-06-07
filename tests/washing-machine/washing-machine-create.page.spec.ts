import { test, expect } from '@playwright/test';
import { customTest } from '../base';
import { IdentificationStep } from './pages/identification.step';
import { DamageStep } from './pages/damage.step';
import { TEST_FILES } from 'tests/assets/file.provider';

test.describe('Identification', () => {

  let identificationStep: IdentificationStep;

  customTest.beforeEach(async ({ washingMachineCreatePom }) => {
    await washingMachineCreatePom.goto();
    identificationStep = washingMachineCreatePom.identificationStep();
  });

  customTest('cannot proceed to next step when fields are empty', async () => {
    await identificationStep.next();

    await expect(identificationStep.manufacturerRequired()).toBeVisible();
    await expect(identificationStep.modelAndTypeRequired()).toBeVisible();
    await expect(identificationStep.serialNumberRequired()).toBeVisible();
  });

  customTest('navigates to next step when valid input is provided', async ({ washingMachineCreatePom }) => {
    await identificationStep.selectIdentificationMode('Data Matrix');
    await identificationStep.selectManufacturer('Bosch');
    await identificationStep.selectModel('WGB256A1GB');
    await identificationStep.selectType('BOS001');
    await identificationStep.fillSerialNumber('Un serial');
    await identificationStep.selectReturnType('Service');
    await identificationStep.selectDamageType('In Use');
    await identificationStep.next();

    await expect(washingMachineCreatePom.damageStep().getDamageStepHeader()).toBeVisible();
  });

});

test.describe('Damage', () => {

  let damageStep: DamageStep;

  customTest.beforeEach(async ({ washingMachineCreatePom }) => {
    await washingMachineCreatePom.goto();
    await washingMachineCreatePom.identificationStep().complete();
    damageStep = washingMachineCreatePom.damageStep();
  });

  customTest('shows error when no image is uploaded', async () => {
    await damageStep.next();

    await expect(damageStep.noImageUploadedError()).toBeVisible();
  });

  customTest('shows error when more than 3 images are uploaded', async () => {
    await damageStep.uploadImages(
      TEST_FILES.images.jpg.landscape,
      TEST_FILES.images.jpeg.mountains,
      TEST_FILES.images.bmp.trail,
      TEST_FILES.images.jpg.tree
    );

    await expect(damageStep.tooManyFilesError()).toBeVisible();
  });

  customTest('shows error when uploaded file has invalid extension', async () => {
    await damageStep.uploadImages(
      TEST_FILES.files.txt.empty
    );

    await expect(damageStep.invalidFileExtensionError()).toBeVisible();
  });

  customTest('navigates to next step when valid input is provided', async ({ washingMachineCreatePom }) => {
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
    await expect(washingMachineCreatePom.overviewStep().getOverviewStepHeader()).toBeVisible();
  });
});

test.describe('Overview', () => {

  customTest('shows previously selected values when Overview is reached', async ({ washingMachineCreatePom }) => {
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
  });
});
