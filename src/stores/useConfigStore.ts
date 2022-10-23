import { defineStore } from "pinia";
import { ref } from "vue";
import type { StorageConfigData } from "@/services/storageVersion/types";
import { injectContainer } from "@/container";
import type { AppStyle, TilePlace, GridParams, Tile } from "@/types";
import type { TilePlaces } from "@/types";

export const useConfigStore = defineStore("configStore", () => {
  const { storageService } = injectContainer();

  const config = ref<StorageConfigData>(storageService.getDefaultConfigData());
  const isLoaded = ref(false);

  const init = async () => {
    await syncFromStorage();
    isLoaded.value = true;
  };

  const syncToStorage = async () => {
    await storageService.setConfigData(config.value);
  };

  const syncFromStorage = async () => {
    config.value = await storageService.getConfigData();
  };

  const getDefaultStyle = (): AppStyle => {
    return storageService.getDefaultConfigData().style;
  };

  const updateStyle = async (style: Partial<AppStyle>) => {
    config.value.style = {
      ...config.value.style,
      ...style,
    };
    await syncToStorage();
  };

  const updateGrid = async (
    grid: Partial<GridParams>,
    tilePlaces: TilePlaces
  ) => {
    config.value.grid = {
      ...config.value.grid,
      ...grid,
    };
    config.value.tilePlaces = tilePlaces;
    await syncToStorage();
  };

  const updateTile = async (tile: Pick<Tile, "id"> & Partial<Tile>) => {
    config.value.tiles[tile.id] = {
      ...config.value.tiles[tile.id],
      ...tile,
    };
    await syncToStorage();
  };

  const updateMultipleTilePlaces = async (
    data: Array<{ tileId: string; place: TilePlace }>
  ) => {
    data.forEach(({ tileId, place }) => {
      config.value.tilePlaces[tileId] = {
        ...config.value.tilePlaces[tileId],
        ...place,
      };
    });
    await syncToStorage();
  };

  const addTile = async (tile: Tile, place: TilePlace) => {
    config.value.tiles[tile.id] = tile;
    config.value.tilePlaces[tile.id] = place;
    await syncToStorage();
  };

  const deleteTile = async (tileId: string) => {
    delete config.value.tiles[tileId];
    delete config.value.tilePlaces[tileId];
    await syncToStorage();
  };

  return {
    isLoaded,
    config,
    init,
    getDefaultStyle,
    updateStyle,
    updateGrid,
    updateTile,
    updateMultipleTilePlaces,
    addTile,
    deleteTile,
  };
});
