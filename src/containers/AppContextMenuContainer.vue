<script setup lang="ts">
import { useContextMenuStore } from "@/stores/useContextMenuStore";
import type { Ref } from "vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { DropdownMenuItem, VueComponent } from "@/types";
import UiDropdownMenu from "@/components/UiDropdownMenu.vue";

const contextMenuStore = useContextMenuStore();

const contextMenuRef = ref() as Ref<VueComponent>;

const clickOutsideHandler = (event: MouseEvent) => {
  if (
    contextMenuRef.value &&
    !contextMenuRef.value.$el.contains(event.target as HTMLElement)
  ) {
    contextMenuStore.close();
  }
};

// const contextMenuClickHandler = (event: MouseEvent) => {
//   event.preventDefault();
// };

const onMenuItemClick = (item: DropdownMenuItem) => {
  if (item.onClick) {
    item.onClick();
    contextMenuStore.close();
  }
};

onMounted(() => {
  document.addEventListener("click", clickOutsideHandler);
  // document.addEventListener("contextmenu", contextMenuClickHandler);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickOutsideHandler);
  // document.removeEventListener("contextmenu", contextMenuClickHandler);
});
</script>

<template>
  <ui-dropdown-menu
    ref="contextMenuRef"
    v-if="contextMenuStore.data.isOpen"
    class="context-menu"
    :style="{
      '--x': contextMenuStore.data.coordinates.x + 'px',
      '--y': contextMenuStore.data.coordinates.y + 'px',
    }"
    :items="contextMenuStore.data.items"
    :auto-position="true"
    @item-click="onMenuItemClick"
  />
</template>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  top: var(--y);
  left: var(--x);
  z-index: 9999;
}
</style>
