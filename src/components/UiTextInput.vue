<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { getControlEmits, useControl } from "@/composition/useControl";
import { useTheme } from "@/composition/useTheme";

type Value = string;

const props = defineProps<{
  modelValue: Value;
  placeholder?: string;
  autofocus?: boolean;
}>();

const emit = defineEmits(getControlEmits<Value>());

const { colors } = useTheme();

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
  background: v-bind("colors.inputBack");
  color: v-bind("colors.onInputBack");
  border: none;
  border-radius: 4px;
  font-size: 14px;
  padding: 6px 8px;
  width: 100%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px v-bind("colors.primaryBack");
  }
}
</style>
