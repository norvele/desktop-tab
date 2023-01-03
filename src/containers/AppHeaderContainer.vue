<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { openTileModal, openMultipleTilesAddModal } from "@/composition/tile";
import {
  getAppService,
  getGridService,
  getScreenService,
} from "@/composition/injectors";
import { openScreenModal } from "@/composition/screen";
import { computed } from "vue";
import { getDropdownItemsFromOpenedTabs } from "@/composition/useOpenedTabs";

const screenService = getScreenService();
const gridService = getGridService();
const appService = getAppService();

const tabItems = computed(() => {
  return getDropdownItemsFromOpenedTabs(screenService.getCurrentScreenId());
});

const hasFreePlaces = computed(() => {
  return !!gridService.getFreeScreenPlacesNumber(
    screenService.getCurrentScreenId()
  );
});

const onAddTile = () => {
  openTileModal(screenService.getCurrentScreenId());
};

const onAddTileMultiple = () => {
  openMultipleTilesAddModal(screenService.getCurrentScreenId());
};

const openSettings = () => {
  appService.setSettingsOpen(true);
};
</script>

<template>
  <app-header
    :has-free-places="hasFreePlaces"
    :tab-items="tabItems"
    @click-add-tile="onAddTile"
    @click-add-tile-multiple="onAddTileMultiple"
    @click-add-screen="openScreenModal"
    @click-settings="openSettings"
  >
    <slot />
  </app-header>
</template>
