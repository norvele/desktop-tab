import { injectable } from "inversify";
import type { BrowserService, BrowserTopSite } from "@/types";

@injectable()
export class BaseBrowserService implements BrowserService {
  public async init() {
    return Promise.resolve();
  }

  public openUrl(url: string) {
    window.open(url);
  }

  public openUrlInNewTab(url: string) {
    window.open(url, "_blank");
  }

  public openUrlInNewWindow(
    url: string,
    params?: { width: number; height: number }
  ) {
    const features = params
      ? `width=${params.width},height=${params.height}`
      : undefined;
    window.open(url, "_blank", features);
  }

  public getOpenedTabs() {
    return [
      {
        id: "1",
        iconUrl: "https://www.google.com/favicon.ico",
        title: "Test tab",
        url: "http://google.com",
      },
      {
        id: "2",
        iconUrl: "https://www.google.com/favicon.ico",
        title: "Google",
        url: "http://google.com",
      },
      {
        id: "3",
        iconUrl: "https://www.google.com/favicon.ico",
        title: "Another one Another one Another one Another one Another one",
        url: "http://google.com",
      },
    ];
  }

  public subscribeToOpenedTabs() {
    return "";
  }

  public unsubscribeFromOpenedTabs() {
    // nothing
  }

  public getTopSites(): Promise<BrowserTopSite[]> {
    return Promise.resolve([
      {
        title: "Test tab",
        url: "http://google.com",
      },
      {
        title: "Google",
        url: "http://google.com",
      },
    ]);
  }
}
