<script setup lang="ts">
import type { AppStyle } from "@/types/configRelated/v3/styleTypes";
import AppBackgroundUrl from "@/components/AppBackgroundUrl.vue";
import { computed } from "vue";
import AppBackgroundRandomGradient from "@/components/AppBackgroundRandomGradient.vue";

const props = defineProps<{
  background: AppStyle["background"];
  overlay: AppStyle["overlay"];
}>();

const backgroundComponent = computed(() => {
  switch (props.background.type) {
    case "url":
      return AppBackgroundUrl;
    case "randomGradient":
      return AppBackgroundRandomGradient;
    default:
      throw new Error("Unknown background type");
  }
});
</script>

<template>
  <div class="app-background">
    <component
      class="app-background__back"
      :is="backgroundComponent"
      :background="background"
      :style="{
        '--background-blur': overlay.blur * 30 + 'px',
      }"
    ></component>
    <div
      class="app-background__overlay"
      :style="{
        opacity: overlay.opacity,
        backgroundColor: overlay.color,
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.app-background {
  position: relative;

  &__back {
    filter: blur(var(--background-blur));
    position: absolute;
    top: calc(var(--background-blur) * -2);
    left: calc(var(--background-blur) * -2);
    width: calc(100% + var(--background-blur) * 4);
    height: calc(100% + var(--background-blur) * 4);
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
