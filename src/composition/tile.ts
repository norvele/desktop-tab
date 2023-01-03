import { useModal } from "@/composition/useModal";
import type {
  DropdownMenuItem,
  DropdownMenuItems,
  Coordinates,
  Tile,
} from "@/types";
import { useContextMenuStore } from "@/stores/useContextMenuStore";
import {
  getBrowserService,
  getGridService,
  getScreenService,
  getStyleService,
  getTileService,
} from "@/composition/injectors";
import { computed } from "vue";

export const openTileModal = (
  screenId: string,
  tile?: Tile,
  coordinates?: Coordinates
) => {
  const tileModal = useModal("tile");
  const tileService = getTileService();
  const styleService = getStyleService();

  tileModal.openModal(
    {
      title: tile ? "Edit Link" : "Add Link",
      label: tile?.label || "",
      url: tile?.url || "",
      icon: tile?.icon,
      tileStyle: styleService.getStyle().tile.style,
      coordinates,
    },
    {
      save(payload, coordinates) {
        if (tile) {
          tileService.updateTile({
            ...payload,
            id: tile.id,
          });
        } else {
          tileService.addTile(screenId, payload, coordinates);
        }
        tileModal.closeModal();
      },
    }
  );
};

export const openTileContextMenu = (
  event: MouseEvent,
  screenId: string,
  tile: Tile
) => {
  const contextMenuStore = useContextMenuStore();
  const tileService = getTileService();
  const screenService = getScreenService();
  const gridService = getGridService();
  const browserService = getBrowserService();

  const selectedTileIds = computed(() => gridService.getSelectedTileIds());
  const selectedTilesNumber = computed(() => selectedTileIds.value.length);
  const selectedTiles = computed(() => {
    return selectedTileIds.value.map(
      (tileId) => tileService.getTileById(tileId) as Tile
    );
  });
  const isMultiSelect = computed(() => selectedTilesNumber.value > 1);

  const screens = screenService.getScreens();
  const screenItems = Object.values(screens)
    .filter((screen) => screen.id !== screenService.getCurrentScreenId())
    .map((screen) => {
      const isAvailableToMove =
        gridService.getFreeScreenPlacesNumber(screen.id) >=
        selectedTilesNumber.value;
      return {
        label: screen.label,
        isDisabled: !isAvailableToMove,
        description: isAvailableToMove ? "" : "Not enough space",
        onClick: () => {
          tileService.moveTilesToScreen(selectedTileIds.value, screen.id);
        },
      };
    });

  const editItems: DropdownMenuItem[] = [];
  if (!isMultiSelect.value) {
    editItems.push({
      label: "Edit",
      onClick: () => {
        openTileModal(screenId, tile);
      },
    });
  }
  if (Object.keys(screens).length > 1) {
    editItems.push({
      label: isMultiSelect.value
        ? `Move ${selectedTilesNumber.value} Links to Screen`
        : "Move to Screen",
      items: screenItems,
    });
  }

  const openItems: DropdownMenuItem[] = [
    {
      label: isMultiSelect.value
        ? `Open ${selectedTilesNumber.value} Tiles in New Tabs`
        : "Open in New Tab",
      onClick: () => {
        selectedTiles.value.forEach((tile) => {
          browserService.openUrlInNewTab(tile.url);
        });
      },
    },
    {
      label: isMultiSelect.value
        ? `Open ${selectedTilesNumber.value} Links in New Window`
        : "Open in New Window",
      onClick: () => {
        selectedTiles.value.forEach((tile) => {
          browserService.openUrlInNewWindow(tile.url, {
            width: 800,
            height: 600,
          });
        });
      },
    },
  ];

  const items: DropdownMenuItems = [openItems];
  if (editItems.length) {
    items.push(editItems);
  }
  items.push([
    {
      label: isMultiSelect.value
        ? `Delete ${selectedTilesNumber.value} Links`
        : "Delete",
      onClick: () => {
        tileService.deleteTiles(selectedTileIds.value);
      },
    },
  ]);

  contextMenuStore.open(items, {
    x: event.clientX,
    y: event.clientY,
  });
};

export function openMultipleTilesAddModal(_screenId: string) {
  const modal = useModal("multipleTilesAddModal");
  modal.openModal({}, {});
}
