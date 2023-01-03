import type { AppStoreDefinition } from "@/stores/AppStore";
import { inject, injectable } from "inversify";
import { ServiceType } from "@/serviceTypes";
import type { BrowserService } from "@/types";

@injectable()
export class AppService {
  constructor(
    @inject(ServiceType.AppStoreDefinition)
    protected appStoreDefinition: typeof AppStoreDefinition,
    @inject(ServiceType.BrowserService)
    protected browserService: BrowserService
  ) {}

  protected get store() {
    return this.appStoreDefinition();
  }

  public async init() {
    await this.browserService.init();
    this.store.openedTabs = this.browserService.getOpenedTabs();
    this.browserService.subscribeToOpenedTabs((tabs) => {
      this.store.openedTabs = tabs;
    });
    this.store.topSites = await this.browserService.getTopSites();
  }

  public isSettingsOpen() {
    return this.store.isSettingsOpen;
  }

  public setSettingsOpen(isOpen: boolean) {
    this.store.isSettingsOpen = isOpen;
  }

  public getOpenedTabs() {
    return this.store.openedTabs;
  }

  public getTopSites() {
    return this.store.topSites;
  }
}
