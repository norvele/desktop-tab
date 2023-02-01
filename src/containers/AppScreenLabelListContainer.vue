<script setup lang="ts">
import AppScreenLabelList from "@/components/AppScreenLabelList.vue";
import { openScreenContextMenu } from "@/composition/screen";
import { getScreenService, getStyleService } from "@/composition/injectors";
import { computed } from "vue";

const screenService = getScreenService();
const styleService = getStyleService();

const currentScreenId = computed(() => screenService.getCurrentScreenId());
const screenIds = computed(() => screenService.getScreenIds());
const screens = computed(() => screenService.getScreens());
const isVisible = computed(() => screenIds.value.length > 1);

const onBackgroundTextColor = computed(() =>
  styleService.getOnBackgroundTextColor()
);

const onSelect = (screenId: string) => {
  screenService.setCurrentScreenId(screenId);
};

const onResort = (screenIds: string[]) => {
  screenService.reorderScreens(screenIds);
};

const onContextMenu = (event: MouseEvent, screenId: string) => {
  const screen = screens.value[screenId];
  openScreenContextMenu(event, screen);
};
</script>

<template>
  <app-screen-label-list
    v-if="isVisible"
    :current-screen-id="currentScreenId"
    :screen-ids="screenIds"
    :screens="screens"
    :text-color="onBackgroundTextColor"
    @resort="onResort"
    @select="onSelect"
    @context-menu="onContextMenu"
  />
</template>
