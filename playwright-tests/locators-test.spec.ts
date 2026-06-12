import { expect } from "@playwright/test";
import { customTest } from "playwright-tests/base";

customTest('playground-create', async ({ washingMachineCreatePom }) => {
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

customTest('playground-history', async ({ washingMachineHistoryPom }) => {
  await washingMachineHistoryPom.goto();

  // await washingMachineHistoryPagePom.filterByCreatedDate("2026-05-19");
  // await washingMachineHistoryPagePom.filterByIdentificationMode("Data Matrix");
  // await washingMachineHistoryPagePom.filterByManufacturer("Bosch");
  // await washingMachineHistoryPagePom.filterByModel("AAAA");
  // await washingMachineHistoryPagePom.filterByType("BBBB");
  // await washingMachineHistoryPagePom.filterBySerialNumber("serial");
  // await washingMachineHistoryPagePom.filterByReturnType("Service");
  // await washingMachineHistoryPagePom.filterByDamageType("In Use");
  // await washingMachineHistoryPagePom.filterByRecommendation("REPAIR");

  // TODO: Alternative:
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

customTest('playground-history-header-sort', async ({ washingMachineHistoryPom }) => {
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

customTest('playground-history-open-view', async ({ washingMachineHistoryPom }) => {
  await washingMachineHistoryPom.goto();

  await washingMachineHistoryPom.filterBy({
    serialNumber: "sdajuu",
  });
  await washingMachineHistoryPom.applyFilter();

  const viewModal = washingMachineHistoryPom.viewModal;

  await viewModal.open(0);
  await expect(viewModal.category()).toContainText('Washing Machine');
  await expect(viewModal.manufacturer()).toContainText('Bosch');
  await expect(viewModal.serialNumber()).toContainText('sdajuu');
  await expect(viewModal.model()).toContainText('WGG244FRGB');
  await expect(viewModal.type()).toContainText('N/A');

  await expect(viewModal.identificationMode()).toContainText('Data Matrix');
  await expect(viewModal.returnType()).toContainText('Service');
  await expect(viewModal.damageType()).toContainText('In Use');

  await viewModal.close();
});
