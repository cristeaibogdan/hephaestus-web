import {Page} from "@playwright/test";
import {
  SearchWashingMachineResponse
} from "../../src/app/features/washing-machine/models/endpoints/search-washing-machine.endpoint";
import {GetModelAndTypeResponse} from "../../src/app/shared/models/get-model-and-type.response";
import {Recommendation} from "../../src/app/features/washing-machine/enums/recommendation.enum";
import {
  GetWashingMachineFullResponse
} from "../../src/app/features/washing-machine/models/endpoints/get-washing-machine-full.endpoint";
import {PRODUCT_ENDPOINTS, WASHING_MACHINE_ENDPOINTS} from "../../src/environments/endpoints";

export class WashingMachineApiMock {
  private readonly baseUrl = '**';
  constructor(private readonly page: Page) {}

  async getManufacturers(manufacturers: string[]): Promise<void> {
    await this.page.route(this.baseUrl + PRODUCT_ENDPOINTS.getManufacturers('*'), async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(manufacturers)
      });
    });
  }

  async getModelsAndTypes(modelsAndTypes: GetModelAndTypeResponse[]): Promise<void> {
    await this.page.route(this.baseUrl + PRODUCT_ENDPOINTS.getModelsAndTypes("*"), async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(modelsAndTypes)
      });
    });
  }

  async validate(serialNumberIsInUse: boolean): Promise<void> {
    await this.page.route(this.baseUrl + WASHING_MACHINE_ENDPOINTS.validate("*"), async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(serialNumberIsInUse)
      });
    });
  }

  async create(): Promise<void> {
    await this.page.route(this.baseUrl + WASHING_MACHINE_ENDPOINTS.create(), async route => {
      await route.fulfill({
        status: 200,
      });
    });
  }

  async getRecommendation(recommendation: Recommendation): Promise<void> {
    await this.page.route(this.baseUrl + WASHING_MACHINE_ENDPOINTS.getRecommendation("*"), async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(recommendation),
      });
    });
  }

  async search(washingMachines: SearchWashingMachineResponse[]): Promise<void> {
    await this.page.route(this.baseUrl + WASHING_MACHINE_ENDPOINTS.search(), async route => {
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

  // TODO: Since frontend is using expecting a ProblemDetail, this method has been modified to return just that.
  //  We might need methods that throw normal exceptions too.
  async searchError(status: number, message: string): Promise<void> {
    await this.page.route(this.baseUrl + WASHING_MACHINE_ENDPOINTS.search(), async route => {
      await route.fulfill({
        status,
        contentType: "application/problem+json",
        body: JSON.stringify({
          status,
          detail: message
        })
      });
    });
  }

  async loadMany(response: Record<string, GetWashingMachineFullResponse>): Promise<void> {
    await this.page.route(this.baseUrl + WASHING_MACHINE_ENDPOINTS.loadMany(), async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response)
      });
    });
  }
}
