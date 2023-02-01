<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: "light" | "dark";
    isMuted?: boolean;
  }>(),
  {
    color: "light",
  }
);
</script>

<template>
  <button
    class="ui-icon-button"
    :class="[{ '_is-muted': isMuted }, `_color-${color}`]"
    type="button"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.ui-icon-button {
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;

  & > :deep(*) {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: rgba(#202124, 0.1);
  }

  &._color-dark {
    color: #000;
  }

  &._is-muted {
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
