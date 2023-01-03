import { inject, injectable } from "inversify";
import type { BrowserService, BrowserTab, BrowserTopSite } from "@/types";
import { ServiceType } from "@/serviceTypes";
import type { EventEmitterService } from "@/services/EventEmitterService";
import { EmittedEvent } from "@/types";

type OpenedTabsMap = { [tabId: string]: BrowserTab };

@injectable()
export class ChromeBrowserService implements BrowserService {
  protected openedTabsMap: OpenedTabsMap = {};

  constructor(
    @inject(ServiceType.EventEmitterService)
    protected eventEmitterService: EventEmitterService
  ) {}

  public async init() {
    await this.fetchOpenedTabs();
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.openedTabsMap[tabId] = this.normalizeTab(tab);
      this.eventEmitterService.emit(EmittedEvent.BROWSER_OPENED_TABS_UPDATED);
    });
    chrome.tabs.onRemoved.addListener((tabId) => {
      delete this.openedTabsMap[tabId];
      this.eventEmitterService.emit(EmittedEvent.BROWSER_OPENED_TABS_UPDATED);
    });
  }

  public openUrl(url: string) {
    window.open(url);
  }

  public openUrlInNewTab(url: string) {
    chrome.tabs.create({
      url,
    });
  }

  public openUrlInNewWindow(
    url: string,
    params?: { width: number; height: number }
  ) {
    chrome.windows.create({
      url,
      width: params?.width,
      height: params?.height,
    });
  }

  public getOpenedTabs() {
    return Object.values(this.openedTabsMap).filter(
      (tab) => !tab.url.startsWith("chrome://")
    );
  }

  public subscribeToOpenedTabs(callback: (tabs: BrowserTab[]) => void) {
    return this.eventEmitterService.on(
      EmittedEvent.BROWSER_OPENED_TABS_UPDATED,
      () => {
        callback(this.getOpenedTabs());
      }
    );
  }

  public unsubscribeFromOpenedTabs(id: string) {
    this.eventEmitterService.remove(id);
  }

  public async getTopSites(): Promise<BrowserTopSite[]> {
    return new Promise((resolve) => {
      chrome.topSites.get(resolve);
    });
  }

  protected async fetchOpenedTabs() {
    const tabs = await chrome.tabs.query({});
    this.openedTabsMap = tabs
      .map((tab) => {
        return this.normalizeTab(tab);
      })
      .reduce((acc, tab) => {
        acc[tab.id] = tab;
        return acc;
      }, {} as OpenedTabsMap);
  }

  protected normalizeTab(tab: chrome.tabs.Tab): BrowserTab {
    return {
      id: String(tab.id) ?? "",
      iconUrl: tab.favIconUrl ?? "",
      title: tab.title ?? "",
      url: tab.url ?? "",
    };
  }
}
