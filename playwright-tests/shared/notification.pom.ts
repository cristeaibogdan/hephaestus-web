import {Locator, Page} from "@playwright/test";

export class NotificationPom {
  constructor(private page: Page) {}

  getMessage(message: string, exact = false): Locator {
    return this.page.getByText(message, { exact: exact });
  }
}
