<script setup lang="ts">
import AppMultipleTilesAddModal from "@/components/AppMultipleTilesAddModal.vue";
import { useOpenedTabs } from "@/composition/useOpenedTabs";
import { useTopSites } from "@/composition/useTopSites";
import {
  getGridService,
  getScreenService,
  getTileService,
} from "@/composition/injectors";
import { computed } from "vue";
import type { TileSource } from "@/types";
import { useModal } from "@/composition/useModal";

const gridService = getGridService();
const screenService = getScreenService();
const tileService = getTileService();

const { closeModal } = useModal("multipleTilesAddModal");
const { openedTabs } = useOpenedTabs();
const { topSites } = useTopSites();
const freePlacesNumber = computed(() =>
  gridService.getFreeScreenPlacesNumber(screenService.getCurrentScreenId())
);

const onSubmit = async (tileSources: TileSource[]) => {
  await tileService.bulkAddTilesFromSources(
    screenService.getCurrentScreenId(),
    tileSources
  );
  closeModal();
};
</script>

<template>
  <app-multiple-tiles-add-modal
    :opened-tabs="openedTabs"
    :top-sites="topSites"
    :free-places-number="freePlacesNumber"
    :on-submit="onSubmit"
    @close="closeModal"
  />
</template>
