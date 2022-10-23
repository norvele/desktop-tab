<script setup lang="ts">
import { useTileStore } from "@/stores/useTileStore";
import { useGridStore } from "@/stores/useGridStore";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import AppTile from "@/components/AppTile.vue";
import type { Tile, VueComponent } from "@/types";
import { useModal } from "@/composition/useModal";
import { useTileDragging } from "@/composition/useTileDragging";

const tileStore = useTileStore();
const gridStore = useGridStore();

const tileModal = useModal("tile");
const openTileModal = (tile: Tile) => {
  tileModal.openModal(
    {
      title: "Edit Tile",
      label: tile.label,
      url: tile.url,
    },
    {
      save(payload) {
        tileStore.updateTile({
          ...payload,
          id: tile.id,
        });
        tileModal.closeModal();
      },
      delete() {
        tileStore.deleteTile(tile.id);
        tileModal.closeModal();
      },
    }
  );
};

const rows = computed(() => gridStore.grid.rows);
const columns = computed(() => gridStore.grid.columns);

const getTileByCoords = (x: number, y: number) => {
  const tileId = gridStore.getTileIdByPlace({
    screenId: gridStore.currentScreenId,
    x,
    y,
  });
  if (!tileId) {
    return undefined;
  }
  return tileStore.tiles[tileId];
};

const gridRef = ref() as Ref<HTMLDivElement>;
const tileRefs = ref<VueComponent[]>([]);
const {
  dragContainerClass,
  dragSelectedTileClass,
  onClickTile,
  onDrag,
  onDragOver,
  onDrop,
} = useTileDragging(gridRef, tileRefs);
</script>

<template>
  <div class="app-grid-wrapper">
    <div
      ref="gridRef"
      class="app-grid"
      :class="dragContainerClass"
      :style="{
        '--grid-columns': columns,
        '--grid-rows': rows,
      }"
    >
      <template v-for="(i, y) in rows" :key="y">
        <div
          class="app-grid__cell"
          v-for="(j, x) in columns"
          :key="x"
          :ondragover="onDragOver(x, y)"
          :ondrop="onDrop(x, y)"
        >
          <app-tile
            v-if="getTileByCoords(x, y)"
            ref="tileRefs"
            :class="{
              [dragSelectedTileClass]: gridStore.isTileSelected(
                getTileByCoords(x, y).id
              ),
            }"
            :label="getTileByCoords(x, y).label"
            :url="getTileByCoords(x, y).url"
            :icon="getTileByCoords(x, y).icon"
            :is-selected="gridStore.isTileSelected(getTileByCoords(x, y).id)"
            :draggable="true"
            :ondragstart="onDrag(getTileByCoords(x, y).id)"
            @click-more="openTileModal(getTileByCoords(x, y))"
            @click.capture="onClickTile(getTileByCoords(x, y).id, $event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-grid-wrapper {
  position: relative;
}

.app-grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;

  &__cell {
    box-sizing: border-box;
    width: calc(100% / var(--grid-columns));
    height: calc(100% / var(--grid-rows));
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 1px solid #a8a8a8;
  }
}
</style>
