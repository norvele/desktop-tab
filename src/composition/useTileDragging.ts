import type { Ref } from "vue";
import type { TilePlace } from "@/types";
import type { TileDragDataTransfer } from "@/types";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { TilePlaces } from "@/types";
import {
  getGridService,
  getScreenService,
  getTileService,
} from "@/composition/injectors";

export function useTileDragging(gridRef: Ref<HTMLElement>) {
  const dragGhostRootClass = "drag-ghost-root";
  const dragContainerClass = "drag-ghost-container";
  const dragSelectedTileClass = "drag-ghost-selected-tile";
  const gridService = getGridService();
  const tileService = getTileService();
  const screenService = getScreenService();

  const draggingDataTransfer = ref<TileDragDataTransfer>();
  const isDragging = ref(false);
  const dragHoveredCells = ref<Record<string, true>>({});
  const currentScreenId = computed(() => screenService.getCurrentScreenId());
  const tilePlaces = computed(() => gridService.getTilePlaces());
  const selectedTileIds = computed(() => gridService.getSelectedTileIds());

  const getTilePlacesFromDragDataTransfer = (
    newPlace: TilePlace,
    dataTransfer: TileDragDataTransfer
  ): TilePlaces => {
    const data = {
      [dataTransfer.mainTileId]: newPlace,
    } as TilePlaces;
    Object.entries(dataTransfer.otherTilesMap).reduce(
      (acc, [tileId, relativeCoords]) => {
        acc[tileId] = {
          screenId: newPlace.screenId,
          x: newPlace.x + relativeCoords.x,
          y: newPlace.y + relativeCoords.y,
        };
        return acc;
      },
      data
    );
    return data;
  };

  const getSelectionDragGhostElement = () => {
    const gridBounding = gridRef.value.getBoundingClientRect();
    // const gridComputedStyle = getComputedStyle(gridRef.value);
    const element = document.querySelector(`.${dragGhostRootClass}`);
    if (element) {
      return element;
    }
    // Это должно быть в пределах вьюпорта, иначе ничего не будет работать
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>
      .${dragGhostRootClass} {
        position: absolute;
        width: ${gridBounding.width}px;
        height: ${gridBounding.height}px;
        top: ${gridBounding.top}px;
        left: ${gridBounding.left}px;
        z-index: -2;
      }
      .${dragGhostRootClass} .${dragContainerClass} {
        visibility: hidden;
      }
      .${dragGhostRootClass} .${dragSelectedTileClass} {
        visibility: visible;
      }
      </style>`
    );
    const selectionDragGhost = document.createElement("div");
    selectionDragGhost.classList.add(dragGhostRootClass);
    document.body.appendChild(selectionDragGhost);
    return selectionDragGhost;
  };

  const onDrag = (mainTileId: string) => {
    return (event: DragEvent) => {
      isDragging.value = true;
      // DATA
      const mainTilePlace = tilePlaces.value[mainTileId];
      const otherTilesMap = selectedTileIds.value.reduce((acc, tileId) => {
        if (tileId === mainTileId) {
          return acc;
        }
        const tilePlace = tilePlaces.value[tileId];
        return {
          ...acc,
          [tileId]: {
            x: tilePlace.x - mainTilePlace.x,
            y: tilePlace.y - mainTilePlace.y,
          },
        };
      }, {} as TileDragDataTransfer["otherTilesMap"]);
      const dataTransfer: TileDragDataTransfer = {
        dataTransferType: "tile",
        mainTileId,
        otherTilesMap,
      };
      event.dataTransfer?.setData("text", JSON.stringify(dataTransfer));
      draggingDataTransfer.value = dataTransfer;

      // GHOST
      const gridBounding = gridRef.value.getBoundingClientRect();
      const deltaX = event.clientX - gridBounding.left;
      const deltaY = event.clientY - gridBounding.top;
      getSelectionDragGhostElement().innerHTML = gridRef.value.outerHTML;
      if (Object.keys(dataTransfer.otherTilesMap).length) {
        event.dataTransfer?.setDragImage(
          getSelectionDragGhostElement(),
          deltaX,
          deltaY
        );
      }
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
      }
    };
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDrop = (event: DragEvent, x: number, y: number) => {
    event.preventDefault();
    isDragging.value = false;
    draggingDataTransfer.value = undefined;
    dragHoveredCells.value = {};
    const data = getDragDataTransfer(event);
    if (!data) {
      return;
    }
    const newTilePlaces = getTilePlacesFromDragDataTransfer(
      { x, y, screenId: currentScreenId.value },
      data
    );
    tileService.moveTilesSafely(newTilePlaces).catch(() => {
      // nothing
    });
  };

  const onDragEnter = (x: number, y: number) => {
    if (!draggingDataTransfer.value) {
      return;
    }
    dragHoveredCells.value = {};
    dragHoveredCells.value[`${x}:${y}`] = true;
    const otherPlaces = getTilePlacesFromDragDataTransfer(
      { x, y, screenId: currentScreenId.value },
      draggingDataTransfer.value
    );
    Object.values(otherPlaces).forEach(
      (place) => (dragHoveredCells.value[`${place.x}:${place.y}`] = true)
    );
  };
  const onDragEnd = () => {
    dragHoveredCells.value = {};
  };
  const isDragHoveredCell = (x: number, y: number) => {
    return dragHoveredCells.value[`${x}:${y}`] || false;
  };

  onMounted(() => {
    document.addEventListener("dragend", onDragEnd);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("dragend", onDragEnd);
  });

  return {
    dragContainerClass,
    dragSelectedTileClass,
    isDragging,
    onDrag,
    onDragOver,
    onDrop,
    onDragEnter,
    isDragHoveredCell,
  };
}

export function getDragDataTransfer(event: DragEvent) {
  const rawData = event.dataTransfer?.getData("text");
  if (!rawData) {
    return undefined;
  }
  try {
    const data = JSON.parse(rawData) as TileDragDataTransfer;
    return data.dataTransferType === "tile" ? data : undefined;
  } catch (e) {
    return undefined;
  }
}
