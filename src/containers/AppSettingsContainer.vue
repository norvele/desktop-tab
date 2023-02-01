<script setup lang="ts">
import UiTabs from "@/components/UiTabs.vue";
import type { UiTab } from "@/types";
import { ref } from "vue";
import AppStyleSettingsContainer from "@/containers/settings/AppStyleSettingsContainer.vue";
import AppGridSettingsContainer from "@/containers/settings/AppGridSettingsContainer.vue";
import { useTheme } from "@/composition/useTheme";

const { colors } = useTheme();

enum Tab {
  style = "style",
  grid = "grid",
}

const tabs: UiTab[] = [
  {
    id: Tab.style,
    label: "Style",
  },
  {
    id: Tab.grid,
    label: "Grid",
  },
];
const activeTabId = ref(Tab.style);
const setActiveTabId = (tabId: string) => {
  activeTabId.value = tabId as Tab;
};
</script>

<template>
  <div class="app-settings-container">
    <div class="app-settings-container__header header">
      <ui-tabs
        :tabs="tabs"
        :active-tab-id="activeTabId"
        @tab-click="setActiveTabId($event.id)"
      />
    </div>
    <div class="app-settings-container__content content">
      <app-style-settings-container v-if="activeTabId === Tab.style" />
      <app-grid-settings-container v-else-if="activeTabId === Tab.grid" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-settings-container {
  display: flex;
  flex-direction: column;

  &__header {
    flex-grow: 0;
    flex-shrink: 0;
  }

  &__content {
    flex-grow: 1;
    flex-shrink: 1;
  }
}

.header {
  padding: 8px 16px;
  border-bottom: 2px solid v-bind("colors.onBaseBackBorder");
}

.content {
  overflow: auto;
  min-height: 0;
}
</style>
