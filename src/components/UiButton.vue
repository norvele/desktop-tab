<script setup lang="ts">
import { useTheme } from "@/composition/useTheme";

defineProps<{
  color?: "primary" | "secondary";
  type?: "button" | "submit";
  form?: string;
  isDisabled?: boolean;
}>();

const emit = defineEmits({
  click: () => true,
});

const { colors } = useTheme();

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
  background-color: v-bind("colors.baseButtonBack");
  color: v-bind("colors.onBaseButtonBack");
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: v-bind("colors.baseButtonBackHover");
  }

  &:focus {
    outline: none;
  }

  &._color-primary {
    background-color: v-bind("colors.primaryBack");
    color: v-bind("colors.onPrimaryBack");

    &:hover {
      background-color: v-bind("colors.primaryBackHover");
    }
  }

  &._is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
