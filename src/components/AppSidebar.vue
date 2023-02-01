<script setup lang="ts">
import IconCross from "@/components/icons/IconCross.vue";
import UiIconButton from "@/components/UiIconButton.vue";
import type { Ref } from "vue";
import { ref, watch } from "vue";
import { useTheme } from "@/composition/useTheme";

const props = defineProps<{
  isOpen: boolean;
  closeButtonColor: "light" | "dark";
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const { colors } = useTheme();

const close = () => {
  emit("close");
};

const backdrop = ref() as Ref<HTMLElement>;

const clickListener = (event: MouseEvent) => {
  if (backdrop.value === event.target) {
    close();
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    close();
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("click", clickListener);
        document.addEventListener("keydown", handleEscape);
      }, 1);
    } else {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keydown", handleEscape);
    }
  }
);
</script>

<template>
  <div class="app-sidebar" :class="{ '_is-open': isOpen }">
    <div class="app-sidebar__backdrop" ref="backdrop"></div>
    <div class="app-sidebar__container container">
      <div class="container__inner">
        <template v-if="isOpen"><slot /></template>
      </div>
      <ui-icon-button
        class="container__close"
        :color="closeButtonColor"
        @click="close"
      >
        <icon-cross />
      </ui-icon-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__container {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 300px;
    transition: transform 0.2s ease-in-out;
    transform: translateX(0);
    will-change: transform;
    box-sizing: border-box;
  }

  &:not(._is-open) {
    pointer-events: none;

    .app-sidebar__container {
      transform: translateX(100%);
    }

    .container__close {
      display: none;
    }
  }
}

.container {
  background-color: v-bind("colors.baseBack");

  &__inner {
    position: relative;
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  &__close {
    position: absolute;
    top: 4px;
    left: -34px;
  }
}
</style>
