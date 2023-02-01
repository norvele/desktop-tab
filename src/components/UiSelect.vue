<script setup lang="ts">
import type { SelectOption } from "@/types";
import IconChevronDown from "@/components/icons/IconChevronDown.vue";
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { getControlEmits, useControl } from "@/composition/useControl";
import { useTheme } from "@/composition/useTheme";

type Value = string;

const props = defineProps<{
  modelValue: Value;
  options: SelectOption[];
  autofocus?: boolean;
}>();

const emit = defineEmits(getControlEmits<Value>());

const { colors } = useTheme();

const getValueFromEvent = (event: Event) =>
  (event.target as HTMLInputElement)?.value || "";

const { onInput, onChange } = useControl<Value>({ emit, getValueFromEvent });
const changeHandler = (event: Event) => {
  onChange(event);
  onInput(event);
};

const inputRef = ref() as Ref<HTMLSelectElement>;

onMounted(() => {
  if (props.autofocus) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <div class="ui-select">
    <select
      :value="modelValue"
      class="ui-select__input"
      ref="inputRef"
      @change="changeHandler"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.isDisabled"
      >
        {{ option.label }}
      </option>
    </select>
    <icon-chevron-down class="ui-select__icon" />
  </div>
</template>

<style scoped lang="scss">
.ui-select {
  position: relative;

  &__input {
    box-sizing: border-box;
    background: v-bind("colors.inputBack");
    color: v-bind("colors.onInputBack");
    border: none;
    border-radius: 4px;
    font-size: 14px;
    padding: 6px 8px;
    width: 100%;
    appearance: none;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px v-bind("colors.primaryBack");
    }
  }

  &__icon {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    opacity: 0.5;
    width: 20px;
    height: 20px;
    color: v-bind("colors.onInputBack");
  }
}
</style>
