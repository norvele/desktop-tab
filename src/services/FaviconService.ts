import type { Icon } from "@/types";
import { getHexFromString } from "@/utils/getHexFromString";
import { injectable } from "inversify";

@injectable()
export class FaviconService {
  public async getIcon(url: string, label: string): Promise<Icon> {
    const src = await this.scrapIconSrc(url);
    const iconFromLabel = this.getIconFromLabel(label);

    return {
      src: src || "",
      symbol: iconFromLabel.symbol,
      color: iconFromLabel.color,
    };
  }

  public async scrapIconSrc(url: string): Promise<string> {
    const urlObject = new URL(url);
    const size = 96;

    try {
      const result = await fetch(
        `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObject.origin}&size=${size}`
      );
      if (result.status === 200) {
        return result.url;
      }
      throw new Error("No result");
    } catch (e) {
      return "";
    }
  }

  // Quick return icon src (used in the list of top sites, its api doesn't have icons)
  public getIconSrc(url: string) {
    const urlObject = new URL(url);
    const size = 96;
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObject.origin}&size=${size}`;
  }

  public getIconFromLabel(label: string): Icon {
    return {
      src: "",
      symbol: label[0].toUpperCase(),
      color: getHexFromString(label),
    };
  }
}
