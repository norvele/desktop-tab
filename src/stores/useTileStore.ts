import { defineStore } from "pinia";
import type { Coordinates, Tile } from "@/types";
import { getRandomString } from "@/utils/getRandomString";
import { injectContainer } from "@/container";
import { useConfigStore } from "@/stores/useConfigStore";
import { useGridStore } from "@/stores/useGridStore";
import { computed } from "vue";

export const useTileStore = defineStore("tileStore", () => {
  const { faviconService } = injectContainer();
  const configStore = useConfigStore();
  const gridStore = useGridStore();

  const tiles = computed(() => configStore.config.tiles);

  const addTile = async (
    screenId: string,
    payload: Pick<Tile, "label" | "url">
  ) => {
    const icon = await faviconService.getIcon(payload.url, payload.label);
    const coords = gridStore.getFirstFreeCoordinates(screenId);

    if (!coords) {
      throw new Error("No empty cells");
    }

    await configStore.addTile(
      {
        ...payload,
        id: getRandomString(10),
        icon,
      },
      {
        screenId,
        ...coords,
      }
    );
  };

  const updateTile = async (payload: Pick<Tile, "id" | "label" | "url">) => {
    const icon = await faviconService.getIcon(payload.url, payload.label);

    await configStore.updateTile({
      ...payload,
      icon,
    });
  };

  const deleteTile = async (tileId: string) => {
    await configStore.deleteTile(tileId);
  };

  return {
    tiles,
    addTile,
    updateTile,
    deleteTile,
  };
});
