<script setup lang="ts">
import type { BackgroundRandomGradientPart } from "@/types/configRelated/v3/styleTypes";
import { createSeededRand } from "@/utils/seededRand";
import { computed, ref, watch } from "vue";
import { getRandomHEX } from "@/utils/getRandomColor";
import { getSeedByDate } from "@/utils/getSeedByDate";
import { useInterval } from "@/composition/useInterval";

const props = defineProps<{
  background: BackgroundRandomGradientPart;
}>();

const emit = defineEmits<{
  (event: "change"): void;
}>();

const currentDate = ref(new Date());
useInterval(() => {
  currentDate.value = new Date();
}, 1000);

const rand = computed(() => {
  const type = props.background.randomGradient.type;
  let seed = "";
  if (type === "seed") {
    seed = props.background.randomGradient.seed.seed;
  } else if (type === "autoChange") {
    const { interval, unit } = props.background.randomGradient.autoChange;
    seed = getSeedByDate(currentDate.value, interval, unit);
  }
  return createSeededRand(seed);
});

const angle = computed(() => {
  return Math.round(rand.value() * 360);
});

const colors = computed(() => {
  const colorNumber = 2;
  const colors = [];
  for (let i = 0; i < colorNumber; i++) {
    colors.push(getRandomHEX(rand.value));
  }
  return colors;
});

const gradient = computed(() => {
  return `linear-gradient(${angle.value}deg, ${colors.value.join(", ")})`;
});

// Need to transition the background to avoid flickering
const gradientRefresher = ref<{
  tag: "div" | "span";
  gradient: string;
}>({
  tag: "div",
  gradient: gradient.value,
});
watch(gradient, (value) => {
  gradientRefresher.value = {
    tag: gradientRefresher.value.tag === "div" ? "span" : "div",
    gradient: value,
  };
  setTimeout(() => {
    emit("change");
  }, 300); // Wait for the transition to finish
});
</script>

<template>
  <div class="app-background-random-gradient">
    <transition name="fade">
      <component
        :is="gradientRefresher.tag"
        class="gradient"
        :style="{ background: gradientRefresher.gradient }"
      />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
