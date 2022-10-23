import type { Ref } from "vue";
import type { VueComponent } from "@/types";
import type { TileDragDataTransfer } from "@/types";
import { useGridStore } from "@/stores/useGridStore";
import { onBeforeUnmount, onMounted } from "vue";

export function useTileDragging(
  gridRef: Ref<HTMLElement>,
  tileRefs: Ref<VueComponent[]>
) {
  const dragGhostRootClass = "drag-ghost-root";
  const dragContainerClass = "drag-ghost-container";
  const dragSelectedTileClass = "drag-ghost-selected-tile";
  const gridStore = useGridStore();

  const getSelectionDragGhostElement = () => {
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
        width: 100%;
        height: 100%;
        bottom: 0;
        left: 0;
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

  const onClickTile = (tileId: string, event: MouseEvent) => {
    if (!event.shiftKey) {
      return;
    }
    event.preventDefault();
    gridStore.toggleTileSelection(tileId);
  };

  const onDrag = (mainTileId: string) => {
    return (event: DragEvent) => {
      // DATA
      const mainTilePlace = gridStore.tilePlaces[mainTileId];
      const otherTilesMap = gridStore.selectedTileIds.reduce((acc, tileId) => {
        if (tileId === mainTileId) {
          return acc;
        }
        const tilePlace = gridStore.tilePlaces[tileId];
        return {
          ...acc,
          [tileId]: {
            x: tilePlace.x - mainTilePlace.x,
            y: tilePlace.y - mainTilePlace.y,
          },
        };
      }, {} as TileDragDataTransfer["otherTilesMap"]);
      const dataTransfer: TileDragDataTransfer = {
        mainTileId,
        otherTilesMap,
      };
      event.dataTransfer?.setData("text", JSON.stringify(dataTransfer));

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
    };
  };

  const onDragOver = (x: number, y: number) => {
    return (event: DragEvent) => {
      // TODO
      // Проверить что не пересекаемся с тайлами которые не в селекте
      // Проверить что не вылазим за границы
      event.preventDefault();
    };
  };

  const onDrop = (x: number, y: number) => {
    return (event: DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer?.getData("text");
      if (!rawData) {
        throw new Error("No data");
      }
      const data = JSON.parse(rawData) as TileDragDataTransfer;
      gridStore.updateTilePlacesByDragData(
        {
          x,
          y,
          screenId: gridStore.currentScreenId,
        },
        data
      );
    };
  };

  const handleClick = (event: MouseEvent) => {
    for (const ref of tileRefs.value) {
      if (ref?.$el.contains(event.target as Node)) {
        return;
      }
    }
    gridStore.deselectAllTiles();
  };

  onMounted(() => {
    document.addEventListener("click", handleClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClick);
  });

  return {
    dragContainerClass,
    dragSelectedTileClass,
    onClickTile,
    onDrag,
    onDragOver,
    onDrop,
  };
}
