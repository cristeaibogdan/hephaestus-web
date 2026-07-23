import { type Locator, type Page } from '@playwright/test';

export class RecommendationStep {

  constructor(
    private page: Page
  ) {}

  getSuccessMessage(): Locator {
    return this.page.getByText('Product has been successfully saved');
  }

  getText(): Locator { // TODO: Move to dedicated pom that has all messages
    return this.page.getByText('Based on the damages sustained by the');
  }

}
