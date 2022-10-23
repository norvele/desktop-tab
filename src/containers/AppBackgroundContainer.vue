<script setup lang="ts">
import { useStyleStore } from "@/stores/useStyleStore";
import AppBackground from "@/components/AppBackground.vue";
import { useModal } from "@/composition/useModal";
import { computed } from "vue";

const styleStore = useStyleStore();
const styleModal = useModal("style");

const backgroundOverlay = computed(() => {
  if (styleModal.isOpen.value) {
    return styleStore.editingStyle.backgroundOverlay;
  }
  return styleStore.style.backgroundOverlay;
});
</script>

<template>
  <app-background
    :background-overlay="backgroundOverlay"
    :background-url="styleStore.style.backgroundUrl"
  ></app-background>
</template>
