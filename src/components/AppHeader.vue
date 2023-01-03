<script setup lang="ts">
import UiIconButton from "@/components/UiIconButton.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import UiDropdown from "@/components/UiDropdown.vue";
import UiDropdownMenu from "@/components/UiDropdownMenu.vue";
import IconTune from "@/components/icons/IconTune.vue";
import type { DropdownMenuItem } from "@/types";
import { computed } from "vue";

const props = defineProps<{
  hasFreePlaces: boolean;
  tabItems: DropdownMenuItem[];
}>();

const emit = defineEmits<{
  (e: "click-add-tile"): void;
  (e: "click-add-tile-multiple"): void;
  (e: "click-add-screen"): void;
  (e: "click-settings"): void;
}>();

const itemsToAdd = computed(() => {
  const tileItems: DropdownMenuItem[] = [
    {
      label: "Add Link",
      onClick: () => emit("click-add-tile"),
      isDisabled: !props.hasFreePlaces,
      description: props.hasFreePlaces ? "" : "Not enough space",
    },
    {
      label: "Add a few Links",
      onClick: () => emit("click-add-tile-multiple"),
    },
  ];
  if (props.tabItems.length > 0) {
    tileItems.push({
      label: "Add Link from Tab",
      items: props.tabItems,
    });
  }
  const screenItems = [
    {
      label: "Add Screen",
      onClick: () => emit("click-add-screen"),
    },
  ];
  return [tileItems, screenItems];
});

const handleItemClick = (item: DropdownMenuItem, closeDropdown: () => void) => {
  item.onClick?.();
  closeDropdown();
};
</script>

<template>
  <div class="app-header">
    <div class="app-header__start">
      <ui-dropdown>
        <template #trigger>
          <ui-icon-button is-muted>
            <icon-plus />
          </ui-icon-button>
        </template>
        <template #body="{ close }">
          <ui-dropdown-menu
            :items="itemsToAdd"
            @item-click="handleItemClick($event, close)"
          />
        </template>
      </ui-dropdown>
    </div>
    <div class="app-header__center">
      <slot />
    </div>
    <div class="app-header__end">
      <ui-icon-button is-muted @click="$emit('click-settings')">
        <icon-tune />
      </ui-icon-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  height: var(--app-header-height);
}
</style>
