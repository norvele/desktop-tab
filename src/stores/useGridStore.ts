import { defineStore } from "pinia";
import { useConfigStore } from "@/stores/useConfigStore";
import { computed, ref } from "vue";
import { injectContainer } from "@/container";
import type { GridParams, TileDragDataTransfer, TilePlace } from "@/types";
import type { Coordinates } from "@/types";

export const useGridStore = defineStore("gridStore", () => {
  const { tileGridService } = injectContainer();
  const configStore = useConfigStore();

  const currentScreenId = ref("");
  const selectedTileIds = ref<string[]>([]);
  const grid = computed(() => configStore.config.grid);
  const tilePlaces = computed(() => configStore.config.tilePlaces);

  const invertedTilePlaces = computed(() => {
    return tileGridService.getInvertedTilePlaces(configStore.config.tilePlaces);
  });

  const getTileIdByPlace = (place: TilePlace) => {
    const key = tileGridService.getPlaceKey(place);
    return invertedTilePlaces.value[key];
  };

  const getFirstFreeCoordinates = (screenId: string) => {
    return tileGridService.getFirstFreeCoordinates(
      grid.value,
      screenId,
      configStore.config.tilePlaces
    );
  };

  const updateGridParams = async (grid: GridParams) => {
    const screenIds = tileGridService.getUsedScreenIds(
      configStore.config.tilePlaces
    );
    const newTilePlaces = screenIds.reduce((acc, screenId) => {
      return tileGridService.getFittedTilePlaces(grid, screenId, acc);
    }, configStore.config.tilePlaces);
    await configStore.updateGrid(grid, newTilePlaces);
  };

  const updateTilePlacesByDragData = async (
    newPlace: TilePlace,
    dataTransfer: TileDragDataTransfer
  ) => {
    const data = [
      {
        tileId: dataTransfer.mainTileId,
        place: newPlace,
      },
    ];
    Object.entries(dataTransfer.otherTilesMap).forEach(
      ([tileId, relativeCoords]) => {
        data.push({
          tileId,
          place: {
            screenId: newPlace.screenId,
            x: newPlace.x + relativeCoords.x,
            y: newPlace.y + relativeCoords.y,
          },
        });
      }
    );
    await configStore.updateMultipleTilePlaces(data);
  };

  const selectTiles = (tileIds: string[]) => {
    selectedTileIds.value = selectedTileIds.value.concat(tileIds);
  };

  const deselectTiles = (tileIds: string[]) => {
    selectedTileIds.value = selectedTileIds.value.filter(
      (id) => !tileIds.includes(id)
    );
  };

  const toggleTileSelection = (tileId: string) => {
    if (selectedTileIds.value.includes(tileId)) {
      deselectTiles([tileId]);
    } else {
      selectTiles([tileId]);
    }
  };

  const deselectAllTiles = () => {
    selectedTileIds.value = [];
  };

  const isTileSelected = (tileId: string) => {
    return selectedTileIds.value.includes(tileId);
  };

  return {
    grid,
    tilePlaces,
    currentScreenId,
    selectedTileIds,
    getFirstFreeCoordinates,
    updateGridParams,
    getTileIdByPlace,
    updateTilePlacesByDragData,
    selectTiles,
    deselectTiles,
    deselectAllTiles,
    toggleTileSelection,
    isTileSelected,
  };
});
