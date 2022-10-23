import type {
  CurrentStorageVersion,
  StorageVersion,
  AbstractStorageConfigData,
  CurrentStorageConfigData,
  IMigrator,
} from "@/services/storageVersion/types";
import { storageVersions } from "@/services/storageVersion/types";
import type { OmitFirstReadonlyArrayElement } from "@/types";
import { V1Migrator } from "@/services/storageVersion/migrators/V1Migrator";
import { V2Migrator } from "@/services/storageVersion/migrators/V2Migrator";

type VersionWithoutFirst = OmitFirstReadonlyArrayElement<
  typeof storageVersions
>[number];

export class StorageMigrationService {
  // TODO: create migratorsManager
  protected migratorsMap: {
    [key in VersionWithoutFirst]: IMigrator<StorageVersion, key>;
  } = {
    v1: new V1Migrator(),
    v2: new V2Migrator(),
  };

  public getCurrentVersion(): CurrentStorageVersion {
    return storageVersions[storageVersions.length - 1] as CurrentStorageVersion;
  }

  migrate(
    data: AbstractStorageConfigData<StorageVersion>
  ): CurrentStorageConfigData {
    const version = data.version || "v0";

    const migrationVersions = storageVersions.slice(
      storageVersions.indexOf(version) + 1
    ) as VersionWithoutFirst[];

    return migrationVersions.reduce((newData, version) => {
      return this.migratorsMap[version].migrate(
        newData
      ) as CurrentStorageConfigData;
    }, data as CurrentStorageConfigData);
  }
}
