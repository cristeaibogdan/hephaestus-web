import { expect } from "@playwright/test";
import { customTest } from "tests/base";

customTest('playground-create', async ({ washingMachineCreatePagePom }) => {
  await washingMachineCreatePagePom.goto();

  const identificationStep = washingMachineCreatePagePom.identificationStep();

  await identificationStep.selectIdentificationMode('Data Matrix');
  await identificationStep.selectManufacturer('Bosch');
  await identificationStep.selectModel('WGB256A1GB');
  await identificationStep.selectType('BOS001');
  await identificationStep.fillSerialNumber('Un serial');
  await identificationStep.selectReturnType('Service');
  await identificationStep.selectDamageType('In Use');
  await identificationStep.next();
});

customTest('playground-history', async ({ washingMachineHistoryPagePom }) => {
  await washingMachineHistoryPagePom.goto();

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
  await washingMachineHistoryPagePom.filterBy({
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

customTest('playground-history-header-sort', async ({ washingMachineHistoryPagePom }) => {
  await washingMachineHistoryPagePom.goto();

  await washingMachineHistoryPagePom.sortBy("Created", "desc");
  await washingMachineHistoryPagePom.sortBy("Identification Mode");
  await washingMachineHistoryPagePom.sortBy("Manufacturer");
  await washingMachineHistoryPagePom.sortBy("Model");
  await washingMachineHistoryPagePom.sortBy("Type");
  await washingMachineHistoryPagePom.sortBy("Serial Number");
  await washingMachineHistoryPagePom.sortBy("Return Type");
  await washingMachineHistoryPagePom.sortBy("Damage Type");
  await washingMachineHistoryPagePom.sortBy("Recommendation");
});

customTest('playground-history-open-view', async ({ washingMachineHistoryPagePom }) => {
  await washingMachineHistoryPagePom.goto();

  const viewModal = washingMachineHistoryPagePom.viewModal;

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