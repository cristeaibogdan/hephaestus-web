import {SearchSolarPanelUseCase, SolarPanel} from "../search-solar-panel-use-case";
import {expect} from "@playwright/test";
import {HomePagePom} from "../../../tests/home/pages/home.page.pom";
import {WashingMachineCreatePagePom} from "../../../tests/washing-machine/pages/washing-machine-create.page.pom";
import {WashingMachineHistoryPagePom} from "../../../tests/washing-machine/pages/washing-machine-history.page.pom";
import {test as base} from "playwright/types/test";

export class SearchSolarPanelPlaywrightAdapter implements SearchSolarPanelUseCase { // interface because we want to think of a contract.

  searchBySerialNumber(serialNumber: string): SolarPanel {
   this.filterBySerialNumber(serialNumber);
   this.clickFilter();
   return this.getFirstSolarPanel();
  }

  private filterBySerialNumber(serialNumber: string ) {}

  private clickFilter() {}

  private getFirstSolarPanel(): SolarPanel {
    return {
      model: "",
      name: "",
      serialNumber: "",
      type: ""
    }
  }
}




