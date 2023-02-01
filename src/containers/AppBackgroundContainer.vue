<script setup lang="ts">
import AppBackground from "@/components/AppBackground.vue";
import { computed } from "vue";
import { getStyleService } from "@/composition/injectors";

const styleService = getStyleService();

const style = computed(() => styleService.getStyle());
const setBackgroundAvgColor = (value: string) =>
  styleService.setBackgroundAvgColor(value);
</script>

<template>
  <app-background
    :background="style.background"
    :overlay="style.overlay"
    @avg-color-change="setBackgroundAvgColor"
  />
</template>
