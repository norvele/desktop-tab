<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  backgroundUrl: string;
  backgroundOverlay: number;
}>();

const overlayColor = computed(() => {
  if (props.backgroundOverlay < 0.5) {
    return "dark";
  }
  return "light";
});

const overlayOpacity = computed(() => {
  return Math.abs(props.backgroundOverlay - 0.5) * 2;
});
</script>

<template>
  <div
    class="app-background"
    :style="{
      backgroundImage: props.backgroundUrl
        ? `url('${props.backgroundUrl}')`
        : undefined,
    }"
  >
    <div
      class="app-background__overlay overlay"
      :class="[`_color-${overlayColor}`]"
      :style="{ opacity: overlayOpacity }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.app-background {
  position: relative;
  background-size: cover;
  background-position: center;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.overlay {
  &._color-dark {
    background-color: #000;
  }
  &._color-light {
    background-color: #fff;
  }
}
</style>
