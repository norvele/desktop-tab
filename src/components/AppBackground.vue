<script setup lang="ts">
import type { AppStyle } from "@/types/configRelated/v3/styleTypes";
import AppBackgroundUrl from "@/components/AppBackgroundUrl.vue";
import type { Ref } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import AppBackgroundRandomGradient from "@/components/AppBackgroundRandomGradient.vue";
import html2canvas from "html2canvas";
import debounce from "lodash/debounce";
import { FastAverageColor } from "fast-average-color";

const props = defineProps<{
  background: AppStyle["background"];
  overlay: AppStyle["overlay"];
}>();

const emit = defineEmits<{
  (event: "avg-color-change", payload: string): void;
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

const fac = new FastAverageColor();
const root = ref() as Ref<HTMLElement>;

const calculateBrightness = async () => {
  const canvas = await html2canvas(root.value);
  const color = await fac.getColorAsync(canvas);
  emit("avg-color-change", color.hex);
};
const debouncedCalculateBrightness = debounce(calculateBrightness, 100);

watch(
  [() => props.background, () => props.overlay],
  debouncedCalculateBrightness,
  {
    deep: true,
  }
);

onMounted(() => {
  calculateBrightness();
});
</script>

<template>
  <div class="app-background" ref="root">
    <component
      class="app-background__back"
      :is="backgroundComponent"
      :background="background"
      :style="{
        '--background-blur': overlay.blur * 30 + 'px',
      }"
      @change="calculateBrightness()"
    />
    <div
      class="app-background__overlay"
      :style="{
        opacity: overlay.opacity,
        backgroundColor: overlay.color,
        mixBlendMode: overlay.blendMode,
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
