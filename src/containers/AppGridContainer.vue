<script setup lang="ts">
import type { Ref } from "vue";
import { computed, ref } from "vue";
import AppTile from "@/components/AppTile.vue";
import type { VueComponent } from "@/types";
import { useTileDragging } from "@/composition/useTileDragging";
import { openGridCellContextMenu } from "@/composition/grid";
import { openTileContextMenu } from "@/composition/tile";
import {
  getGridService,
  getScreenService,
  getStorageService,
  getStyleService,
  getTileService,
} from "@/composition/injectors";
import AppAreaSelector from "@/components/AppAreaSelector.vue";

const tileRefs = ref<VueComponent[]>([]);

const tileService = getTileService();
const gridService = getGridService();
const screenService = getScreenService();
const storageService = getStorageService();
const styleService = getStyleService();
const tileStyle = computed(() => styleService.getStyle().tile.style);

const selectableTileClassName = ref("selectable-tile");
const rows = computed(() => gridService.getGridParams().rows);
const columns = computed(() => gridService.getGridParams().columns);
const currentScreenId = computed(() => screenService.getCurrentScreenId());

const grid = computed(() => {
  const grid = [];
  for (let y = 0; y < rows.value; y++) {
    const row = [];
    for (let x = 0; x < columns.value; x++) {
      const tileId = storageService.getTileIdByPlace({
        x,
        y,
        screenId: currentScreenId.value,
      });
      if (tileId) {
        const tile = tileService.getTileById(tileId);
        if (tile) {
          row.push(tile);
          continue;
        }
      }
      row.push(null);
    }
    grid.push(row);
  }
  return grid;
});

const onCellContextMenu = (event: MouseEvent, x: number, y: number) => {
  const tileId = storageService.getTileIdByPlace({
    x,
    y,
    screenId: currentScreenId.value,
  });
  const tile = tileId ? tileService.getTileById(tileId) : undefined;
  if (tile) {
    gridService.selectTiles([tile.id]);
    openTileContextMenu(event, currentScreenId.value, tile);
  } else {
    gridService.setSelectedTiles([]);
    openGridCellContextMenu(event, currentScreenId.value, { x, y });
  }
};

// Dragging
const gridRef = ref() as Ref<HTMLDivElement>;
const {
  dragContainerClass,
  dragSelectedTileClass,
  isDragging,
  onDrag,
  onDragOver,
  onDrop,
  onDragEnter,
  isDragHoveredCell,
} = useTileDragging(gridRef);

const aboutToSelectTileIds = ref<string[]>([]);
const selectedTileIds = computed(() => gridService.getSelectedTileIds());

const updateAboutToSelectTileIds = (tileIds: string[]) => {
  aboutToSelectTileIds.value = tileIds;
};

const updateSelectedTileIds = (tileIds: string[]) => {
  gridService.setSelectedTiles(tileIds);
};

const isAboutToSelect = (id: string) => {
  return aboutToSelectTileIds.value.includes(id);
};
const isTileSelected = (tileId: string) => {
  return gridService.isTileSelected(tileId);
};
</script>

<template>
  <app-area-selector
    :selectable-class-name="selectableTileClassName"
    selectable-id-attr-name="data-tile-id"
    :selected-ids="selectedTileIds"
    class="app-grid-wrapper"
    @about-to-select="updateAboutToSelectTileIds"
    @select="updateSelectedTileIds"
  >
    <div
      ref="gridRef"
      class="app-grid"
      :class="[
        dragContainerClass,
        {
          '_is-dragging': isDragging,
          '_is-selecting-by-area': false,
        },
      ]"
      :style="{
        '--grid-columns': columns,
        '--grid-rows': rows,
      }"
    >
      <template v-for="(row, y) in grid" :key="y">
        <div
          v-for="(tile, x) in row"
          :key="x"
          class="app-grid__cell"
          :class="{
            '_first-row': y === 0,
            '_first-column': x === 0,
            '_is-drag-hovered': isDragHoveredCell(x, y),
          }"
          @dragover="onDragOver"
          @drop="onDrop($event, x, y)"
          @dragenter="onDragEnter(x, y)"
          @contextmenu.prevent="onCellContextMenu($event, x, y)"
        >
          <app-tile
            v-if="tile"
            ref="tileRefs"
            :data-tile-id="tile.id"
            class="tile"
            :class="[
              selectableTileClassName,
              {
                [dragSelectedTileClass]: isTileSelected(tile.id),
              },
            ]"
            :label="tile.label"
            :url="tile.url"
            :icon="tile.icon"
            :style="tileStyle"
            :is-selected="isTileSelected(tile.id)"
            :is-about-to-select="isAboutToSelect(tile.id)"
            :draggable="true"
            :ondragstart="onDrag(tile.id)"
          />
        </div>
      </template>
    </div>
  </app-area-selector>
</template>

<style lang="scss" scoped>
$serifSize: 8px;

.app-grid-wrapper {
  position: relative;
  user-select: none;
}

.app-grid {
  --cell-width: calc(100vw / var(--grid-columns));
  --cell-height: calc((100vh - var(--app-header-height)) / var(--grid-rows));
  --tile-size: calc(min(var(--cell-width), var(--cell-height)) - 8px);
  --min-tile-size: 64px;
  --max-tile-size: 128px;

  display: grid;
  grid-template-columns: repeat(var(--grid-columns), var(--cell-width));
  grid-template-rows: repeat(var(--grid-rows), var(--cell-height));
  width: 100%;
  height: 100%;

  &__cell {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      z-index: 10;
    }

    &._is-drag-hovered {
      &::before {
        $offset: 4px;
        content: "";
        position: absolute;
        top: $offset;
        left: $offset;
        width: calc(100% - #{$offset * 2});
        height: calc(100% - #{$offset * 2});
        background-color: rgba(#fff, 0.1);
        border-radius: 4px;
      }
    }
  }

  &._is-selecting-by-area {
    .app-grid__cell {
      pointer-events: none;
    }
  }
}

.tile {
  width: var(--tile-size);
  height: var(--tile-size);
  min-width: var(--min-tile-size);
  min-height: var(--min-tile-size);
  max-width: var(--max-tile-size);
  max-height: var(--max-tile-size);

  &._disabled {
    pointer-events: none;
  }
}
</style>
