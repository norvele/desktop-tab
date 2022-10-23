<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { useStyleStore } from "@/stores/useStyleStore";
import { useModal } from "@/composition/useModal";
import { useTileStore } from "@/stores/useTileStore";
import { useGridStore } from "@/stores/useGridStore";

const styleStore = useStyleStore();
const tileStore = useTileStore();
const gridStore = useGridStore();

const styleModal = useModal("style");
const openStyleModal = () => {
  styleStore.editingStyle = { ...styleStore.style };
  styleModal.openModal(
    {
      ...styleStore.style,
      gridColumns: gridStore.grid.columns,
      gridRows: gridStore.grid.rows,
    },
    {
      save: async ({
        backgroundBlur,
        backgroundOverlay,
        backgroundUrl,
        gridColumns,
        gridRows,
      }) => {
        await styleStore.updateStyle({
          backgroundBlur,
          backgroundOverlay,
          backgroundUrl,
        });
        await gridStore.updateGridParams({
          columns: gridColumns,
          rows: gridRows,
        });
        styleModal.closeModal();
      },
      input: ({ backgroundBlur, backgroundOverlay, backgroundUrl }) => {
        styleStore.editingStyle = {
          backgroundBlur,
          backgroundOverlay,
          backgroundUrl,
        };
      },
    }
  );
};

const tileModal = useModal("tile");
const openTileModal = () => {
  tileModal.openModal(
    {
      title: "Add Tile",
      label: "",
      url: "",
    },
    {
      save(payload) {
        tileStore.addTile(gridStore.currentScreenId, payload);
        tileModal.closeModal();
      },
      delete() {},
    }
  );
};
</script>

<template>
  <app-header @click-add="openTileModal" @click-settings="openStyleModal">
    <slot />
  </app-header>
</template>
