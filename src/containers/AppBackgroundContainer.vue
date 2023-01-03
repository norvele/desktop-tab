<script setup lang="ts">
import AppBackground from "@/components/AppBackground.vue";
import { computed } from "vue";
import { getStyleService } from "@/composition/injectors";

const styleService = getStyleService();

const style = computed(() => styleService.getStyle());
</script>

<template>
  <app-background
    :background="style.background"
    :overlay="style.overlay"
  ></app-background>
</template>
