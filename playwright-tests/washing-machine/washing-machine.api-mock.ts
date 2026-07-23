import {Page} from "@playwright/test";
import {
  SearchWashingMachineResponse
} from "../../src/app/features/washing-machine/models/endpoints/search-washing-machine.endpoint";
import {GetModelAndTypeResponse} from "../../src/app/shared/models/get-model-and-type.response";
import {Recommendation} from "../../src/app/features/washing-machine/enums/recommendation.enum";
import {
  GetWashingMachineFullResponse
} from "../../src/app/features/washing-machine/models/endpoints/get-washing-machine-full.endpoint";

export class WashingMachineApiMock {
  constructor(private readonly page: Page) {}

  async getManufacturers(manufacturers: string[]): Promise<void> {
    await this.page.route("**/v1/products/*/manufacturers", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(manufacturers)
      });
    });
  }

  async getModelsAndTypes(modelsAndTypes: GetModelAndTypeResponse[]): Promise<void> {
    await this.page.route("**/v1/products/*/models-and-types", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(modelsAndTypes)
      });
    });
  }

  async validate(serialNumberIsInUse: boolean): Promise<void> {
    await this.page.route("**/v1/washing-machines/*/validate", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(serialNumberIsInUse)
      });
    });
  }

  async create(): Promise<void> {
    await this.page.route("**/v1/washing-machines/create", async route => {
      await route.fulfill({
        status: 200,
      });
    });
  }

  async getRecommendation(recommendation: Recommendation): Promise<void> {
    await this.page.route("**/v1/washing-machines/*/recommendation", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(recommendation),
      });
    });
  }

  async search(washingMachines: SearchWashingMachineResponse[]): Promise<void> {
    await this.page.route("**/v1/washing-machines/search", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          content: washingMachines,
          totalElements: washingMachines.length,
          totalPages: 1,
          number: 0,
          size: washingMachines.length
        })
      });
    });
  }

  async searchError(status: number, message: string): Promise<void> {
    await this.page.route("**/v1/washing-machines/search", async route => {
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(message)
      });
    });
  }

  async loadMany(response: Record<string, GetWashingMachineFullResponse>): Promise<void> {
    await this.page.route("**/v1/washing-machines/many", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response)
      });
    });
  }
}
