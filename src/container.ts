import { Container } from "inversify";
import { LocalStorageClient } from "@/services/LocalStorageClient";
import { StorageService } from "@/services/StorageService";
import { FaviconService } from "@/services/FaviconService";
import { StorageMigrationService } from "@/services/storageVersion/StorageMigrationService";
import { GridHelperService } from "@/services/GridHelperService";
import { ConfigStoreDefinition } from "@/stores/configStore";
import { GridStoreDefinition } from "@/stores/GridStore";
import { GridService } from "@/services/GridService";
import { TileService } from "@/services/TileService";
import { ScreenStoreDefinition } from "@/stores/ScreenStore";
import { ScreenService } from "@/services/ScreenService";
import { StyleStoreDefinition } from "@/stores/StyleStore";
import { StyleService } from "@/services/StyleService";
import { EventEmitterService } from "@/services/EventEmitterService";
import { AppStoreDefinition } from "@/stores/AppStore";
import { AppService } from "@/services/AppService";
import { ServiceType } from "@/serviceTypes";
import { ChromeBrowserService } from "@/services/CromeBrowserService";
import { BaseBrowserService } from "@/services/BaseBrowserService";
import { FormBuilderService } from "@/services/form/FormBuilderService";

export function createContainer(isProduction: boolean) {
  const BrowserServiceClass = isProduction
    ? ChromeBrowserService
    : BaseBrowserService;

  const container = new Container();
  // Stores
  container
    .bind(ServiceType.AppStoreDefinition)
    .toConstantValue(AppStoreDefinition);
  container
    .bind(ServiceType.ConfigStoreDefinition)
    .toConstantValue(ConfigStoreDefinition);
  container
    .bind(ServiceType.GridStoreDefinition)
    .toConstantValue(GridStoreDefinition);
  container
    .bind(ServiceType.ScreenStoreDefinition)
    .toConstantValue(ScreenStoreDefinition);
  container
    .bind(ServiceType.StyleStoreDefinition)
    .toConstantValue(StyleStoreDefinition);

  // Services
  container.bind(ServiceType.LocalStorageClient).to(LocalStorageClient);
  container.bind(ServiceType.StorageClient).to(LocalStorageClient);
  container.bind(ServiceType.EventEmitterService).to(EventEmitterService);
  container
    .bind(ServiceType.StorageMigrationService)
    .to(StorageMigrationService);
  container.bind(ServiceType.FaviconService).to(FaviconService);
  container.bind(ServiceType.GridHelperService).to(GridHelperService);
  container.bind(ServiceType.StorageService).to(StorageService);
  container.bind(ServiceType.GridService).to(GridService);
  container.bind(ServiceType.TileService).to(TileService);
  container.bind(ServiceType.ScreenService).to(ScreenService);
  container.bind(ServiceType.StyleService).to(StyleService);
  container.bind(ServiceType.AppService).to(AppService);
  container.bind(ServiceType.BrowserService).to(BrowserServiceClass);
  container.bind(ServiceType.FormBuilderService).to(FormBuilderService);

  return container;
}

const containerKey = Symbol("container");

export function injectContainer(): ReturnType<typeof createContainer> {
  return (globalThis as any)[containerKey];
}

export function provideContainer(
  container: ReturnType<typeof createContainer>
) {
  (globalThis as any)[containerKey] = container;
}
