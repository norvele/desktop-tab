<script lang="ts" setup>
import { useTheme } from "@/composition/useTheme";

const { colors } = useTheme();
</script>

<template>
  <a class="ui-link" href="#"><slot /></a>
</template>

<style lang="scss" scoped>
.ui-link {
  color: v-bind("colors.primaryBack");
  text-decoration: none;

  &:hover {
    color: v-bind("colors.primaryBackHover");
  }
}
</style>
