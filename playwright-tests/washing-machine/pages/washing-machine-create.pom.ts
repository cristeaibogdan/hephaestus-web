import { type Page } from '@playwright/test';
import { IdentificationStep } from './identification.step';
import { DamageStep } from './damage.step';
import { OverviewStep } from './overview.step';
import {RecommendationStep} from "./recommendation.step";

export class WashingMachineCreatePom {

  constructor(
    private page: Page
  ) {}

  async goto(): Promise<void> {
    await this.page.goto('/washing-machines');
  }

  identificationStep(): IdentificationStep {
    return new IdentificationStep(this.page);
  }

  damageStep(): DamageStep {
    return new DamageStep(this.page);
  }

  overviewStep(): OverviewStep {
    return new OverviewStep(this.page);
  }

  recommendationStep(): RecommendationStep {
    return new RecommendationStep(this.page);
  }
}
