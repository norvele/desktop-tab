<script setup lang="ts">
import type { UiTab } from "@/types";
import { computed } from "vue";
import { useTheme } from "@/composition/useTheme";

const props = defineProps<{
  tabs: UiTab[];
  activeTabId: string;
}>();

defineEmits<{
  (event: "tab-click", tab: UiTab): void;
}>();

const { colors } = useTheme();

const activeTab = computed(() => {
  return props.tabs.find((tab) => tab.id === props.activeTabId);
});
</script>

<template>
  <div class="ui-tabs">
    <div class="ui-tabs__header header">
      <a
        class="header__tab"
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ '_is-active': tab.id === activeTabId }"
        @click="$emit('tab-click', tab)"
      >
        {{ tab.label }}
      </a>
    </div>
    <div class="ui-tabs__content" v-if="$slots.default">
      <slot :activeTab="activeTab"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;

  &__tab {
    color: v-bind("colors.onBaseBack");
    font-weight: 600;
    padding: 6px 0;
    text-decoration: none;
    cursor: pointer;

    &._is-active {
      color: v-bind("colors.onBaseBackContrast");
    }
  }
}
</style>
