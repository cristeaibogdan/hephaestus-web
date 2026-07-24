import { type Locator, type Page } from '@playwright/test';

export class RecommendationStep {

  constructor(
    private page: Page
  ) {}

  getText(): Locator { // TODO: Move to dedicated pom that has all messages
    return this.page.getByText('Based on the damages sustained by the');
  }

}
