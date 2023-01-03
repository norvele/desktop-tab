<script setup lang="ts">
import type { BackgroundUrlPart } from "@/types/configRelated/v3/styleTypes";

defineProps<{
  background: BackgroundUrlPart;
}>();
</script>

<template>
  <div
    class="app-background-url"
    :style="{
      backgroundImage: background.url.url
        ? `url('${background.url.url}')`
        : undefined,
    }"
  ></div>
</template>

<style lang="scss" scoped>
.app-background-url {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
