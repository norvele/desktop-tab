import type {
  IMigrator,
  StorageConfigDataByVersion,
} from "@/services/storageVersion/types";

export class V3Migrator implements IMigrator<"v2", "v3"> {
  public migrate(
    data: StorageConfigDataByVersion<"v2">
  ): StorageConfigDataByVersion<"v3"> {
    const isWhiteOverlay = data.style.backgroundOverlay > 0.5;

    return {
      ...data,
      version: "v3",
      style: {
        background: {
          type: "url",
          url: {
            url: data.style.backgroundUrl,
          },
        },
        overlay: {
          color: isWhiteOverlay ? "white" : "black",
          opacity: isWhiteOverlay
            ? data.style.backgroundOverlay * 2 - 1
            : 1 - data.style.backgroundOverlay * 2,
          blur: data.style.backgroundBlur,
          blendMode: "normal",
        },
        onBackgroundTextColor: "auto",
        tile: {
          style: data.style.tileStyle,
        },
        theme: "sync",
      },
    };
  }
}
