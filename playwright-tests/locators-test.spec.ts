import {expect} from "@playwright/test";
import {pageTest} from "playwright-tests/base";
import {TestData} from "./test-data";
import {IdentificationMode} from "../src/app/features/washing-machine/enums/identification-mode.enum";
import {ReturnType} from "../src/app/features/washing-machine/enums/return-type.enum";
import {DamageType} from "../src/app/features/washing-machine/enums/damage-type.enum";

/**
 * Dummy class used for testing if certain pom methods work.
 */
pageTest('playground-create', async ({ washingMachineCreatePom, washingMachineApiMock }) => {
  await washingMachineApiMock.getManufacturers(["Bosch"]);
  await washingMachineApiMock.getModelsAndTypes([
    {
      model: "WGB256A1GB",
      type: "BOS001"
    }
  ]);
  await washingMachineApiMock.validate(false);

  await washingMachineCreatePom.goto();

  const identificationStep = washingMachineCreatePom.identificationStep();

  await identificationStep.selectIdentificationMode('Data Matrix');
  await identificationStep.selectManufacturer('Bosch');
  await identificationStep.selectModel('WGB256A1GB');
  await identificationStep.selectType('BOS001');
  await identificationStep.fillSerialNumber('Un serial');
  await identificationStep.selectReturnType('Service');
  await identificationStep.selectDamageType('In Use');
  await identificationStep.next();
});

pageTest('playground-history', async ({ washingMachineHistoryPom, washingMachineApiMock }) => {
  await washingMachineApiMock.search([
    TestData.createSearchWashingMachineResponse({
      manufacturer: 'Gorenje',
      model: 'WA946',
      type: 'N/A',
      serialNumber: 'sda'
    })
  ]);

  await washingMachineHistoryPom.goto();

  await washingMachineHistoryPom.filterBy({
    createdAt: "2026-05-19",
    identificationMode: "Data Matrix",
    manufacturer: "Bosch",
    model: "AAAA",
    type: "BBBB",
    serialNumber: "serial",
    returnType: "Service",
    damageType: "In Use",
    recommendation: "REPAIR"
  });
});

pageTest('playground-history-header-sort', async ({ washingMachineHistoryPom, washingMachineApiMock }) => {
  await washingMachineApiMock.search([
    TestData.createSearchWashingMachineResponse({
      manufacturer: 'Gorenje',
      model: 'WA946',
      type: 'N/A',
      serialNumber: 'sda'
    })
  ]);

  await washingMachineHistoryPom.goto();

  await washingMachineHistoryPom.sortBy("Created", "desc");
  await washingMachineHistoryPom.sortBy("Identification Mode");
  await washingMachineHistoryPom.sortBy("Manufacturer");
  await washingMachineHistoryPom.sortBy("Model");
  await washingMachineHistoryPom.sortBy("Type");
  await washingMachineHistoryPom.sortBy("Serial Number");
  await washingMachineHistoryPom.sortBy("Return Type");
  await washingMachineHistoryPom.sortBy("Damage Type");
  await washingMachineHistoryPom.sortBy("Recommendation");
});

pageTest('playground-history-open-view', async ({ washingMachineHistoryPom, washingMachineApiMock }) => {
  await washingMachineApiMock.search([
    TestData.createSearchWashingMachineResponse({
      category: 'Washing Machine',
      manufacturer: 'Gorenje',
      serialNumber: 'sdajuu',
      model: 'WGG244FRGB',
      type: 'N/A',
      identificationMode: IdentificationMode.DATA_MATRIX,
      returnType: ReturnType.SERVICE,
      damageType: DamageType.IN_USE
    })
  ]);

  await washingMachineHistoryPom.goto();

  await washingMachineHistoryPom.filterBy({serialNumber: "sdajuu"});

  await washingMachineApiMock.loadMany({
    'sdajuu': TestData.createGetWashingMachineFullResponse(
      {
        category: 'Washing Machine',
        manufacturer: 'Gorenje',
        serialNumber: 'sdajuu',
        model: 'WGG244FRGB',
        type: 'N/A',
        identificationMode: IdentificationMode.DATA_MATRIX,
        returnType: ReturnType.SERVICE,
        damageType: DamageType.IN_USE
      }
    )
  });

  const viewModal = washingMachineHistoryPom.viewModal;
  await viewModal.open(0);
  await expect(viewModal.category()).toContainText('Washing Machine');
  await expect(viewModal.manufacturer()).toContainText('Gorenje');
  await expect(viewModal.serialNumber()).toContainText('sdajuu');
  await expect(viewModal.model()).toContainText('WGG244FRGB');
  await expect(viewModal.type()).toContainText('N/A');

  await expect(viewModal.identificationMode()).toContainText('Data Matrix');
  await expect(viewModal.returnType()).toContainText('Service');
  await expect(viewModal.damageType()).toContainText('In Use');

  await viewModal.close();
});
