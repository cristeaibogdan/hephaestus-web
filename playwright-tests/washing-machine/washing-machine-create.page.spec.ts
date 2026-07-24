import {expect, test} from '@playwright/test';
import {pageTest} from '../base';
import {IdentificationStep} from './pages/identification.step';
import {DamageStep} from './pages/damage.step';
import {TEST_FILES} from 'playwright-tests/assets/file.provider';
import {Recommendation} from "../../src/app/features/washing-machine/enums/recommendation.enum";

test.describe('Identification', () => {

  let identificationStep: IdentificationStep;

  pageTest.beforeEach(async ({ washingMachineCreatePom }) => {
    await washingMachineCreatePom.goto();
    identificationStep = washingMachineCreatePom.identificationStep();
  });

  pageTest('cannot proceed to next step when fields are empty', async ({ washingMachineApiMock }) => {
    await washingMachineApiMock.getManufacturers(["Model A", "Model B"]);

    await identificationStep.next();

    await expect(identificationStep.manufacturerRequired()).toBeVisible();
    await expect(identificationStep.modelAndTypeRequired()).toBeVisible();
    await expect(identificationStep.serialNumberRequired()).toBeVisible();
  });

  pageTest('navigates to next step when valid input is provided', async ({ washingMachineCreatePom, washingMachineApiMock }) => {
    await washingMachineApiMock.getManufacturers(["Bosch"]);
    await washingMachineApiMock.getModelsAndTypes([
      {
        model: "WGB256A1GB",
        type: "BOS001"
      }
    ]);
    await washingMachineApiMock.validate(false);

    await identificationStep.selectIdentificationMode('Data Matrix');
    await identificationStep.selectManufacturer('Bosch');
    await identificationStep.selectModel('WGB256A1GB');
    await identificationStep.selectType('BOS001');
    await identificationStep.fillSerialNumber('someSerialNumber');
    await identificationStep.selectReturnType('Service');
    await identificationStep.selectDamageType('In Use');
    await identificationStep.next();

    await expect(washingMachineCreatePom.damageStep().getDamageStepHeader()).toBeVisible();
  });

});

test.describe('Damage', () => {

  let damageStep: DamageStep;

  pageTest.beforeEach(async ({ washingMachineCreatePom, washingMachineApiMock }) => {
    await washingMachineCreatePom.goto();

    await washingMachineApiMock.getManufacturers(["Bosch"]);
    await washingMachineApiMock.getModelsAndTypes([
      {
        model: "WGB256A1GB",
        type: "BOS001"
      }
    ]);
    await washingMachineApiMock.validate(false);

    await washingMachineCreatePom.identificationStep().complete({
      manufacturer: "Bosch",
      model: "WGB256A1GB",
      type: "BOS001",
    });
    damageStep = washingMachineCreatePom.damageStep();
  });

  pageTest('shows error when no image is uploaded', async ({ notificationPom }) => {
    await damageStep.next();

    await expect(notificationPom.getMessage("At least one image must be uploaded")).toBeVisible();
  });

  pageTest('shows error when more than 3 images are uploaded', async ({ notificationPom }) => {
    await damageStep.uploadImages(
      TEST_FILES.images.jpg.landscape,
      TEST_FILES.images.jpeg.mountains,
      TEST_FILES.images.bmp.trail,
      TEST_FILES.images.jpg.tree
    );

    await expect(notificationPom.getMessage('Upload is limited to 3 files')).toBeVisible();
  });

  pageTest('shows error when uploaded file has invalid extension', async ({ notificationPom }) => {
    await damageStep.uploadImages(
      TEST_FILES.files.txt.empty
    );

    await expect(notificationPom.getMessage('File empty.txt is not supported. Only jpg, jpeg, png and bmp extensions are supported.')).toBeVisible();
  });

  pageTest('navigates to next step when valid input is provided', async ({ washingMachineCreatePom }) => {
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

  pageTest('shows previously selected values when Overview is reached', async ({ washingMachineCreatePom, washingMachineApiMock }) => {
    await washingMachineCreatePom.goto();
    await washingMachineApiMock.getManufacturers(["Bosch"]);
    await washingMachineApiMock.getModelsAndTypes([
      {
        model: "WGB256A1GB",
        type: "BOS001"
      }
    ]);
    await washingMachineApiMock.validate(false);

    // 1. Identification
    await washingMachineCreatePom.identificationStep().complete({
      identificationMode: 'Data Matrix',
      manufacturer: "Bosch",
      model: "WGB256A1GB",
      type: "BOS001",
      serialNumber: 'someSerial',
      returnType: 'Service',
      damageType: 'In Use'
    });

    // 2. Damage
    const damageStep = washingMachineCreatePom.damageStep();
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
    // TODO: Worth exposing a single method that returns everything on the page?
    const overview = washingMachineCreatePom.overviewStep();
    await expect(overview.category()).toContainText('Washing Machine');
    await expect(overview.manufacturer()).toContainText('Bosch');
    await expect(overview.serialNumber()).toContainText('someSerial');
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

test.describe('Recommendation', () => {

  pageTest('shows success message when Recommendation is reached', async ({ washingMachineCreatePom, washingMachineApiMock, notificationPom }) => {
    await washingMachineCreatePom.goto();
    await washingMachineApiMock.getManufacturers(["Bosch"]);
    await washingMachineApiMock.getModelsAndTypes([
      {
        model: "WGB256A1GB",
        type: "BOS001"
      }
    ]);
    await washingMachineApiMock.validate(false);

    // 1. Identification
    await washingMachineCreatePom.identificationStep().complete({
      identificationMode: 'Data Matrix',
      manufacturer: "Bosch",
      model: "WGB256A1GB",
      type: "BOS001",
      serialNumber: 'someSerial',
      returnType: 'Service',
      damageType: 'In Use'
    });

    // 2. Damage
    const damageStep = washingMachineCreatePom.damageStep();
    await damageStep.complete();
    await damageStep.next();

    // 3. Overview
    await washingMachineApiMock.create();
    await washingMachineApiMock.getRecommendation(Recommendation.DISASSEMBLE)
    await washingMachineCreatePom.overviewStep().generateRecommendation();

    // 4. Recommendation
    await expect(washingMachineCreatePom.recommendationStep().getText()).toBeVisible();
    await expect(notificationPom.getMessage('Product has been successfully saved')).toBeVisible();
  });
});
