import type { StorageClientServiceInterface } from "@/types";
import type { StorageMigrationService } from "@/services/storageVersion/StorageMigrationService";
import type { StorageConfigData } from "@/services/storageVersion/types";

export class StorageService {
  protected configDataKey = "config";

  constructor(
    protected client: StorageClientServiceInterface,
    protected storageMigrationService: StorageMigrationService
  ) {}

  async getConfigData(): Promise<StorageConfigData> {
    const data = await this.client.get<StorageConfigData>(this.configDataKey);
    if (!data) {
      return this.getDefaultConfigData();
    }
    if (data.version !== this.storageMigrationService.getCurrentVersion()) {
      const result = this.storageMigrationService.migrate(data);
      console.log("Storage has been migrated", result);
      return result;
    }
    return data;
  }

  async setConfigData(data: StorageConfigData): Promise<void> {
    await this.client.set(this.configDataKey, data);
  }

  public getDefaultConfigData(): StorageConfigData {
    return {
      version: this.storageMigrationService.getCurrentVersion(),
      grid: {
        columns: 1,
        rows: 1,
      },
      tilePlaces: {},
      tiles: {},
      style: {
        backgroundUrl: "",
        backgroundOverlay: 0.5,
        backgroundBlur: 0,
      },
    };
  }
}
