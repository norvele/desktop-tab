<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string;
    label?: string;
    error?: string;
  }>(),
  {
    tag: "label",
  }
);
</script>

<template>
  <component :is="tag" class="ui-field">
    <div v-if="label" class="ui-field__label">{{ label }}</div>
    <div class="ui-field__input">
      <slot />
    </div>
    <div v-if="error" class="ui-field__error">{{ error }}</div>
  </component>
</template>

<style lang="scss" scoped>
.ui-field {
  display: block;

  &__label {
    font-size: 12px;
    margin-bottom: 8px;
    color: #5f6368;
    font-weight: 600;
  }

  &__error {
    font-size: 12px;
    margin-top: 4px;
    color: #f44336;
  }

  &:focus-within {
    .ui-field__label {
      color: #3a8ef9;
    }
  }
}
</style>
