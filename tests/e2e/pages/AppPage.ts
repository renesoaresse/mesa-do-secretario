import type { Page, Locator } from '@playwright/test';

export class AppPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly previewContainer: Locator;
  readonly appTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('.sidebar');
    this.previewContainer = page.locator('.main');
    this.appTitle = page.locator('.sidebar-header');
  }

  async goto() {
    await this.page.goto('/');
  }

  async isSidebarVisible() {
    return this.sidebar.isVisible();
  }

  async isPreviewVisible() {
    return this.previewContainer.isVisible();
  }
}
