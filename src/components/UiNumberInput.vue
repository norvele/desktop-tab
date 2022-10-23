<script setup lang="ts">
defineProps<{
  modelValue: number;
  placeholder?: string;
}>();

const emit = defineEmits({
  "update:model-value": (value: number) => true,
});

const onInput = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement)?.value || "0");
  emit("update:model-value", value);
};
</script>

<template>
  <input
    class="ui-text-input"
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<style lang="scss" scoped>
.ui-text-input {
  box-sizing: border-box;
  background: #f1f3f4;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  padding: 6px 8px;
  width: 100%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #1a73e8;
  }
}
</style>
