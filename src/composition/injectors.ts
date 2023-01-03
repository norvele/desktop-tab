import { injectContainer } from "@/container";
import type { GridService } from "@/services/GridService";
import type { TileService } from "@/services/TileService";
import type { ScreenService } from "@/services/ScreenService";
import type { StorageService } from "@/services/StorageService";
import type { GridHelperService } from "@/services/GridHelperService";
import type { StyleService } from "@/services/StyleService";
import type { AppService } from "@/services/AppService";
import { ServiceType } from "@/serviceTypes";
import type { BrowserService } from "@/types";
import type { FaviconService } from "@/services/FaviconService";
import type { FormBuilderService } from "@/services/form/FormBuilderService";

export function getStorageService() {
  return injectContainer().get<StorageService>(ServiceType.StorageService);
}

export function getGridService() {
  return injectContainer().get<GridService>(ServiceType.GridService);
}

export function getGridHelperService() {
  return injectContainer().get<GridHelperService>(
    ServiceType.GridHelperService
  );
}

export function getTileService() {
  return injectContainer().get<TileService>(ServiceType.TileService);
}

export function getScreenService() {
  return injectContainer().get<ScreenService>(ServiceType.ScreenService);
}

export function getStyleService() {
  return injectContainer().get<StyleService>(ServiceType.StyleService);
}

export function getAppService() {
  return injectContainer().get<AppService>(ServiceType.AppService);
}

export function getBrowserService() {
  return injectContainer().get<BrowserService>(ServiceType.BrowserService);
}

export function getFaviconService() {
  return injectContainer().get<FaviconService>(ServiceType.FaviconService);
}

export function getFormBuilderService() {
  return injectContainer().get<FormBuilderService>(
    ServiceType.FormBuilderService
  );
}
