import {SearchSolarPanelUseCase, SolarPanel} from "../search-solar-panel-use-case";
import {expect} from "@playwright/test";

export class SearchSolarPanelPlaywrightAdapter implements SearchSolarPanelUseCase { // interface because we want to think of a contract.

  searchBySerialNumber(serialNumber: string): SolarPanel {
   this.filterBySerialNumber(serialNumber);
   this.clickFilter();
   return this.getFirstSolarPanel() as SolarPanel;
  }

  private filterBySerialNumber(serialNumber: string ) {}

  private clickFilter() {}

  private getFirstSolarPanel() {}
}




