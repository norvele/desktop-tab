<script setup lang="ts">
import AppMultipleTilesAddModal from "@/components/AppMultipleTilesAddModal.vue";
import { useOpenedTabs } from "@/composition/useOpenedTabs";
import { useTopSites } from "@/composition/useTopSites";
import {
  getGridHelperService,
  getGridService,
  getScreenService,
  getTileService,
} from "@/composition/injectors";
import type { TileSource } from "@/types";
import { useModal } from "@/composition/useModal";

const gridService = getGridService();
const gridHelperService = getGridHelperService();
const screenService = getScreenService();
const tileService = getTileService();

const { closeModal } = useModal("welcomeModal");
const { openedTabs } = useOpenedTabs();
const { topSites } = useTopSites();

const onSubmit = async (tileSources: TileSource[]) => {
  const gridParams = gridHelperService.getAutoGridParamsByNeededPlacesNumber(
    window.innerWidth,
    window.innerHeight,
    tileSources.length
  );
  await gridService.updateGridParams(gridParams);
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
    :on-submit="onSubmit"
    title="Welcome!"
    close-button-text="Skip"
    submit-button-text="Add"
    @close="closeModal"
  >
    <template #pre-content>
      <div class="pre-content">
        You can add links from your opened tabs or your top sites.
      </div>
    </template>
  </app-multiple-tiles-add-modal>
</template>

<style lang="scss" scoped>
.pre-content {
  margin-bottom: 16px;
}
</style>
