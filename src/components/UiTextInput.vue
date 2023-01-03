<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { getControlEmits, useControl } from "@/composition/useControl";

type Value = string;

const props = defineProps<{
  modelValue: Value;
  placeholder?: string;
  autofocus?: boolean;
}>();

const emit = defineEmits(getControlEmits<Value>());

const getValueFromEvent = (event: Event) =>
  (event.target as HTMLInputElement)?.value || "";

const { onInput, onChange } = useControl<Value>({ emit, getValueFromEvent });

const inputRef = ref() as Ref<HTMLInputElement>;

onMounted(() => {
  if (props.autofocus) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <input
    ref="inputRef"
    class="ui-text-input"
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
    @change="onChange"
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
    box-shadow: 0 0 0 2px #3a8ef9;
  }
}
</style>
