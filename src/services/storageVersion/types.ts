import type { LastReadonlyArrayElement } from "@/types";
import type { V0 } from "@/types/configRelated/v0/v0Types";
import type { V1 } from "@/types/configRelated/v1/v1Types";
import type { V2 } from "@/types/configRelated/v2/v2Types";
import type { V3 } from "@/types/configRelated/v3/v3Types";

export const storageVersions = ["v0", "v1", "v2", "v3"] as const;
type StorageConfigPartByVersion = {
  v0: V0;
  v1: V1;
  v2: V2;
  v3: V3;
};

export type StorageVersion = typeof storageVersions[number];
export type CurrentStorageVersion = LastReadonlyArrayElement<
  typeof storageVersions
>;

export type AbstractStorageConfigData<V extends StorageVersion> = {
  version: V;
};

export type StorageConfigDataByVersion<V extends StorageVersion> =
  AbstractStorageConfigData<V> & StorageConfigPartByVersion[V];

export type CurrentStorageConfigData =
  StorageConfigDataByVersion<CurrentStorageVersion>;
export type StorageConfigData = CurrentStorageConfigData;

export interface IMigrator<F extends StorageVersion, T extends StorageVersion> {
  migrate(data: StorageConfigDataByVersion<F>): StorageConfigDataByVersion<T>;
}
