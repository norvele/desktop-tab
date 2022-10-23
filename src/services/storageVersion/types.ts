import type { LastReadonlyArrayElement } from "@/types";
import type { V0, V1, V2 } from "@/services/storageVersion/storageVersionTypes";

export const storageVersions = ["v0", "v1", "v2"] as const;
type StorageConfigPartByVersion = {
  v0: V0;
  v1: V1;
  v2: V2;
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
