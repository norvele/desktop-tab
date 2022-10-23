import { inject } from "vue";
import type { StorageClientServiceInterface } from "@/types";
import { ChromeExtensionStorageClient } from "@/services/ChromeExtensionStorageClient";
import { LocalStorageClient } from "@/services/LocalStorageClient";
import { StorageService } from "@/services/StorageService";
import { FaviconService } from "@/services/FaviconService";
import { StorageMigrationService } from "@/services/storageVersion/StorageMigrationService";
import { TileGridService } from "@/services/TileGridService";

export interface ContainerInterface {
  storageService: StorageService;
  faviconService: FaviconService;
  tileGridService: TileGridService;
}

export const containerKey = Symbol("container");

export function injectContainer(): ContainerInterface {
  return inject(containerKey) as ContainerInterface;
}

export function createContainer(isProduction: boolean): ContainerInterface {
  const storageClient: StorageClientServiceInterface = isProduction
    ? new ChromeExtensionStorageClient()
    : new LocalStorageClient();
  const storageMigrationService = new StorageMigrationService();

  return {
    storageService: new StorageService(storageClient, storageMigrationService),
    faviconService: new FaviconService(),
    tileGridService: new TileGridService(),
  };
}
