import type { Page, Locator } from '@playwright/test';

export class AppPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly previewContainer: Locator;
  readonly appTitle: Locator;
  readonly sessionNumberInput: Locator;
  readonly lojaNameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('.sidebar');
    this.previewContainer = page.locator('.main');
    this.appTitle = page.locator('.sidebar-header');
    this.sessionNumberInput = page.getByLabel('Nº Sessão');
    this.lojaNameInput = page.getByLabel('Nome da Loja');
  }

  async goto() {
    await this.page.goto('/');
  }

  async seedStorage(key: string, value: unknown) {
    await this.page.addInitScript(
      ({ seedKey, seedValue }) => {
        window.localStorage.setItem(seedKey, JSON.stringify(seedValue));
      },
      { seedKey: key, seedValue: value },
    );
  }

  async fillSessionNumber(value: string) {
    await this.sessionNumberInput.fill(value);
  }

  async fillLojaName(value: string) {
    await this.lojaNameInput.fill(value);
  }

  async isSidebarVisible() {
    return this.sidebar.isVisible();
  }

  async isPreviewVisible() {
    return this.previewContainer.isVisible();
  }
}
