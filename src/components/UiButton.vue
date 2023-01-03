<script setup lang="ts">
defineProps<{
  color?: "primary" | "secondary";
  type?: "button" | "submit";
  form?: string;
  isDisabled?: boolean;
}>();

const emit = defineEmits({
  click: () => true,
});

const onClick = () => {
  emit("click");
};
</script>

<template>
  <button
    class="ui-button"
    :class="[`_color-${color}`, { '_is-disabled': isDisabled }]"
    :type="type ?? 'button'"
    :form="form"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.ui-button {
  border: none;
  background: none;
  border-radius: 4px;
  background-color: #f1f3f4;
  box-shadow: 0 0 2px rgba(#000, 0.12), 0 2px 2px rgba(#000, 0.24);
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #e8eaeb;
  }

  &:focus {
    outline: none;
    // box-shadow: 0 0 0 2px #1a73e8 !important;
  }

  &._color-primary {
    background-color: #3a8ef9;
    color: #fff;
    box-shadow: 0 0 2px rgba(#1a73e8, 0.12), 0 2px 2px rgba(#1a73e8, 0.24);

    &:hover {
      background-color: #4d96f3;
    }
  }

  &._is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
