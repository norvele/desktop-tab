import type {
  IMigrator,
  StorageConfigDataByVersion,
} from "@/services/storageVersion/types";

type Tile = StorageConfigDataByVersion<"v2">["tiles"][0];
type TilesMap = StorageConfigDataByVersion<"v2">["tiles"];
type Coordinates = StorageConfigDataByVersion<"v2">["tilePlaces"];

export class V2Migrator implements IMigrator<"v1", "v2"> {
  migrate(
    data: StorageConfigDataByVersion<"v1">
  ): StorageConfigDataByVersion<"v2"> {
    const tilesMatrix = data.tileLists.map((tileList) => tileList.tiles);
    const tiles = ([] as Tile[]).concat(...tilesMatrix);

    return {
      version: "v2",
      grid: {
        columns: tiles.length,
        rows: 1,
      },
      tilePlaces: tiles.reduce((acc, tile, index) => {
        acc[tile.id] = {
          screenId: "",
          x: index,
          y: 0,
        };
        return acc;
      }, {} as Coordinates),
      tiles: tiles.reduce((acc, tile) => {
        acc[tile.id] = tile;
        return acc;
      }, {} as TilesMap),
      style: {
        ...data.style,
        backgroundBlur: 0,
      },
    };
  }
}
