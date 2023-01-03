import { useModal } from "@/composition/useModal";
import type { TileScreen } from "@/types";
import { useContextMenuStore } from "@/stores/useContextMenuStore";
import {
  getGridHelperService,
  getGridService,
  getScreenService,
} from "@/composition/injectors";

export const openScreenModal = (screen?: TileScreen) => {
  const screenModal = useModal("screen");
  const screenService = getScreenService();

  screenModal.openModal(
    {
      title: screen ? "Edit Screen" : "Add Screen",
      label: screen?.label || "",
    },
    {
      save(payload) {
        if (screen) {
          screenService.updateScreen({
            ...payload,
            id: screen.id,
          });
        } else {
          screenService.addScreen(payload);
        }
        screenModal.closeModal();
      },
    }
  );
};

export const openScreenDeleteModal = (screen: TileScreen) => {
  const screenDeleteModal = useModal("screenDelete");
  const screenService = getScreenService();
  const gridService = getGridService();

  screenDeleteModal.openModal(
    {
      title: `Delete Screen "${screen.label}"`,
      screenList: Object.values(screenService.getScreens()),
      screenIdToDelete: screen.id,
      getFreeScreenPlacesNumber: (screenId: string) => {
        return gridService.getFreeScreenPlacesNumber(screenId);
      },
      tilesNumber: gridService.getScreenTilesNumber(screen.id),
    },
    {
      submit({ newScreenId }) {
        screenService.deleteScreen(screen.id, newScreenId);
        screenDeleteModal.closeModal();
      },
    }
  );
};

export const openScreenContextMenu = (
  event: MouseEvent,
  screen: TileScreen
) => {
  const contextMenuStore = useContextMenuStore();
  const screenService = getScreenService();
  const gridService = getGridService();
  const gridHelperService = getGridHelperService();

  const items = [
    [
      {
        label: "Edit",
        onClick: () => {
          openScreenModal(screen);
        },
      },
    ],
  ];
  if (screenService.canDeleteScreens()) {
    items.push([
      {
        label: "Delete",
        onClick: () => {
          const tilesNumber = Object.keys(
            gridHelperService.getTilePlacesByScreenId(
              gridService.getTilePlaces(),
              screen.id
            )
          ).length;
          if (tilesNumber > 0) {
            openScreenDeleteModal(screen);
          } else {
            screenService.deleteScreen(screen.id);
          }
        },
      },
    ]);
  }
  contextMenuStore.open(items, {
    x: event.clientX,
    y: event.clientY,
  });
};
