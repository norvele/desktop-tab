import { useContextMenuStore } from "@/stores/useContextMenuStore";
import { openTileModal } from "@/composition/tile";
import { getStorageService } from "@/composition/injectors";
import type { DropdownMenuItem } from "@/types";
import { getDropdownItemsFromOpenedTabs } from "@/composition/useOpenedTabs";

export const openGridCellContextMenu = async (
  event: MouseEvent,
  screenId: string,
  cellCoords: { x: number; y: number }
) => {
  const storageService = getStorageService();
  const contextMenuStore = useContextMenuStore();

  const tabItems = getDropdownItemsFromOpenedTabs(screenId, cellCoords);

  const hasTile = !!storageService.getTileIdByPlace({
    screenId,
    ...cellCoords,
  });
  if (hasTile) {
    return;
  }

  const addFromOpenedTabs: DropdownMenuItem = {
    label: "Add Link from Tab",
    items: tabItems,
  };

  const items: DropdownMenuItem[] = [
    {
      label: "Add Link",
      onClick: () => {
        openTileModal(screenId, undefined, cellCoords);
      },
    },
  ];
  if (tabItems.length > 0) {
    items.push(addFromOpenedTabs);
  }
  contextMenuStore.open(items, {
    x: event.clientX,
    y: event.clientY,
  });
};
