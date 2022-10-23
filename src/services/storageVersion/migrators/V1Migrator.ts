import type {
  IMigrator,
  StorageConfigDataByVersion,
} from "@/services/storageVersion/types";

export class V1Migrator implements IMigrator<"v0", "v1"> {
  migrate(
    data: StorageConfigDataByVersion<"v0">
  ): StorageConfigDataByVersion<"v1"> {
    return {
      version: "v1",
      tileLists: [
        {
          id: "default",
          label: "Main",
          maxColumnCount: 0,
          tiles: data.tiles,
        },
      ],
      style: data.style,
    };
  }
}
