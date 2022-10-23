import type { Icon } from "@/types";
import { getHexFromString } from "@/utils/getHexFromString";

export class FaviconService {
  public async getIcon(url: string, label: string): Promise<Icon> {
    const src = await this.scrapIconSrc(url, 32);
    const iconFromLabel = this.getIconFromLabel(label);

    return {
      src: src || "",
      symbol: iconFromLabel.symbol,
      color: iconFromLabel.color,
    };
  }

  protected async scrapIconSrc(url: string, size: number): Promise<string> {
    const urlObject = new URL(url);

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

  protected getIconFromLabel(label: string): Icon {
    return {
      src: "",
      symbol: label[0].toUpperCase(),
      color: getHexFromString(label),
    };
  }
}
