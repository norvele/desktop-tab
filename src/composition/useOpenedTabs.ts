import { getAppService, getTileService } from "@/composition/injectors";
import type { DropdownMenuItem } from "@/types";
import { computed } from "vue";
import type { TileSource } from "@/types";

export function useOpenedTabs() {
  const appService = getAppService();
  const openedTabs = computed<TileSource[]>(() => appService.getOpenedTabs());
  return {
    openedTabs,
  };
}

export function getDropdownItemsFromOpenedTabs(
  screenId: string,
  coords?: { x: number; y: number }
): DropdownMenuItem[] {
  const appService = getAppService();
  const tileService = getTileService();

  return appService.getOpenedTabs().map((tab) => ({
    icon: tab.iconUrl,
    label: tab.title,
    onClick: () => {
      tileService.addTileFromSource(screenId, tab, coords);
    },
  }));
}
