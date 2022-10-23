<script setup lang="ts">
defineProps<{
  isInverse?: boolean;
  isMuted?: boolean;
}>();
</script>

<template>
  <button
    class="ui-icon-button"
    :class="{ '_is-inverse': isInverse, '_is-muted': isMuted }"
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
  width: 28px;
  height: 28px;
  border-radius: 50%;

  & > :deep(*) {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: rgba(#202124, 0.1);
  }

  &._is-inverse {
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
