<script setup lang="ts">
import draggableComponent from "vuedraggable";
import AppScreenLabel from "@/components/AppScreenLabel.vue";
import { ref } from "vue";
import type { TileScreen } from "@/types";

defineProps<{
  currentScreenId: string;
  screenIds: string[];
  screens: Record<string, TileScreen>;
}>();

const emit = defineEmits<{
  (e: "context-menu", event: MouseEvent, screenId: string): void;
  (e: "resort", screenIds: string[]): void;
  (e: "select", screenId: string): void;
}>();

const isMove = ref(false);

const onDragSelect = (screenId: string) => {
  if (isMove.value) {
    return;
  }
  emit("select", screenId);
};
</script>

<template>
  <draggable-component
    class="app-screen-label-list"
    item-key="id"
    ghost-class="app-screen-label-list__ghost"
    :animation="200"
    :model-value="screenIds"
    @update:model-value="$emit('resort', $event)"
    @start="isMove = true"
    @end="isMove = false"
  >
    <template #item="{ element: screenId }">
      <div>
        <app-screen-label
          :label="screens[screenId].label"
          :is-non-interactive="isMove"
          :is-active="currentScreenId === screenId"
          @click="$emit('select', screenId)"
          @drag-select="onDragSelect(screenId)"
          @contextmenu.prevent="$emit('context-menu', $event, screenId)"
        />
      </div>
    </template>
  </draggable-component>
</template>

<style lang="scss" scoped>
.app-screen-label-list {
  display: flex;
  align-items: center;
  gap: 4px;

  &__ghost {
    opacity: 0;
  }
}
</style>
