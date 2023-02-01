<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

defineProps<{
  label: string;
  isNonInteractive: boolean;
  isActive: boolean;
  textColor: "light" | "dark";
}>();

const emit = defineEmits<{
  (e: "click-more"): void;
  (e: "drag-select"): void;
}>();

const dragSelectTimeoutValue = 500;
const dragSelectTimeout = ref();

const onDragEnter = () => {
  clearTimeout(dragSelectTimeout.value);
  dragSelectTimeout.value = setTimeout(() => {
    emit("drag-select");
  }, dragSelectTimeoutValue);
};

const onDragLeave = () => {
  clearTimeout(dragSelectTimeout.value);
};

onBeforeUnmount(() => {
  clearTimeout(dragSelectTimeout.value);
});
</script>

<template>
  <div
    class="app-screen-label"
    :class="[
      {
        '_is-interactive': !isNonInteractive,
        '_is-active': isActive,
      },
      `_text-color-${textColor}`,
    ]"
    :ondragenter="onDragEnter"
    :ondragleave="onDragLeave"
  >
    {{ label }}
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/delayedShowOnHover.scss";

.app-screen-label {
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  color: #fff;

  &._is-active {
    background-color: rgba(#fff, 0.2);
  }

  &._is-interactive {
    &:hover {
      background-color: rgba(#fff, 0.2);

      .app-screen-label__action {
        opacity: 1;
      }
    }
  }

  &._text-color-dark {
    color: #000;

    &._is-active {
      background-color: rgba(#000, 0.1);
    }

    &._is-interactive {
      &:hover {
        background-color: rgba(#000, 0.1);
      }
    }
  }
}
</style>
