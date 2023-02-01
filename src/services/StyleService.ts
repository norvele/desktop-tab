import type { StorageService } from "@/services/StorageService";
import type { StyleStoreDefinition } from "@/stores/StyleStore";
import { inject, injectable } from "inversify";
import { ServiceType } from "@/serviceTypes";
import type { AppStyle } from "@/types/configRelated/v3/styleTypes";
import { getContrast } from "color2k";

@injectable()
export class StyleService {
  constructor(
    @inject(ServiceType.StyleStoreDefinition)
    protected styleStoreDefinition: typeof StyleStoreDefinition,
    @inject(ServiceType.StorageService) protected storageService: StorageService
  ) {}

  public getStyle(): AppStyle {
    return this.storageService.getConfig().style;
  }

  public async updateStyle(style: Partial<AppStyle>) {
    await this.storageService.updateStyle(style);
  }

  public updateStyleWithoutSaving(style: Partial<AppStyle>) {
    this.storageService.updateStyleWithoutSaving(style);
  }

  public setBackgroundAvgColor(color: string) {
    this.styleStoreDefinition().backgroundAvgColor = color;
  }

  public getOnBackgroundTextColor() {
    const onBackgroundTextColorSetting = this.getStyle().onBackgroundTextColor;
    if (onBackgroundTextColorSetting === "auto") {
      const contrast = getContrast(
        this.styleStoreDefinition().backgroundAvgColor || "#000000",
        "#fff"
      );
      return contrast < 1.7 ? "dark" : "light";
    }
    return onBackgroundTextColorSetting;
  }

  public isBackgroundAvgColorCalculated() {
    return !!this.styleStoreDefinition().backgroundAvgColor;
  }
}
