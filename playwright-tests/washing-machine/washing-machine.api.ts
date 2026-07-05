import {APIRequestContext} from "@playwright/test";
import {environment} from "../../src/environments/environment";
import {
  CreateWashingMachineRequest
} from "../../src/app/features/washing-machine/models/endpoints/create-washing-machine.endpoint";
import * as fs from "node:fs";
import {TEST_FILES} from "../assets/file.provider";

export class WashingMachineApi {
  private readonly apiURL = environment.apiBaseUrl;
  private createdSerialNumbers: string[] = [];

  constructor(private readonly request: APIRequestContext) {}

  async create(request: CreateWashingMachineRequest): Promise<void> {
    const formData = new FormData();
    formData.append("createWashingMachineRequest", new Blob([JSON.stringify(request)]));
    formData.append("imageFiles", new File([fs.readFileSync(TEST_FILES.images.jpg.landscape)], "landscape.jpg"));

    const response = await this.request.post(
      this.apiURL.concat("/v1/washing-machines/create"),
      { multipart: formData }
    );

    if (!response.ok()) {
      throw new Error(`Failed to create ${request.serialNumber}: ${response.status()} ${await response.text()}`);
    }

    this.createdSerialNumbers.push(request.serialNumber);
  }

  async delete(serialNumber: string): Promise<void> {
    const response = await this.request.delete(
      this.apiURL.concat(`/v1/washing-machines/${serialNumber}`)
    );

    /**
     * Different from 404 to not cause problems when testing the delete flow:
     *
     * 1. Test creates test-123 via washingMachineApi.create().
     * 2. Test deletes test-123 through the UI — this is the thing being tested.
     * 3. Test ends. Fixture's finally calls cleanup().
     * 4. cleanup() calls delete("test-123") again — but it's already gone.
     * 5. Backend correctly returns 404.
     * 6. Without the carve-out: this throws, and your passing test gets reported as failed due to teardown.
    */
    if (!response.ok() && response.status() !== 404) {
      throw new Error(`Failed to delete washing machine ${serialNumber}.`);
    }
  }

  async cleanup(): Promise<void> {
    const serials = [...this.createdSerialNumbers];
    this.createdSerialNumbers = [];

    const errors: string[] = [];
    for (const serialNumber of serials) {
      try {
        await this.delete(serialNumber);
      } catch (err) {
        errors.push(`${serialNumber}: ${err}`);
      }
    }

    if (errors.length) {
      throw new Error(`Cleanup failed for ${errors.length}: ${errors.join("; ")}`);
    }
  }
}
