<script setup lang="ts">
import IconCheck from "@/components/icons/IconCheck.vue";
import { computed } from "vue";
import IconMinus from "@/components/icons/IconMinus.vue";
import { getControlEmits, useControl } from "@/composition/useControl";

type Value = string | boolean | null;

const props = defineProps<{
  modelValue: Value;
  label?: string;
  isBlock?: boolean;
  stringValues?: {
    checked: string;
    unchecked: string;
  };
}>();

const emit = defineEmits(getControlEmits<Value>());

const getValueFromEvent = (event: Event) => {
  const raw = (event.target as HTMLInputElement)?.checked || false;
  if (props.stringValues) {
    return raw ? props.stringValues.checked : props.stringValues.unchecked;
  }
  return raw;
};

const isChecked = computed(() => {
  if (props.stringValues) {
    return props.modelValue === props.stringValues.checked;
  }
  return !!props.modelValue;
});

const isIndeterminate = computed(() => props.modelValue === null);

const { onInput, onChange } = useControl<Value>({ emit, getValueFromEvent });
const changeHandler = (event: Event) => {
  onChange(event);
  onInput(event);
};
</script>

<template>
  <div class="ui-checkbox">
    <label class="checkbox" :class="{ '_is-block': isBlock }">
      <div
        class="checkbox__box box"
        :class="{ '_is-active': isIndeterminate || isChecked }"
      >
        <input
          class="box__input"
          type="checkbox"
          :checked="isChecked"
          @change="changeHandler"
        />
        <icon-minus class="box__icon" v-if="isIndeterminate" />
        <icon-check class="box__icon" v-else-if="isChecked" />
      </div>
      <span v-if="label || $slots.default" class="checkbox__label">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.ui-checkbox {
  line-height: 0;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-wrap: nowrap;
  max-width: 100%;

  &__box {
    flex-shrink: 0;
    flex-grow: 0;
  }

  &__label {
    flex-shrink: 1;
    flex-grow: 1;
    margin-left: 8px;
    line-height: normal;
    min-width: 0;
  }

  &._is-block {
    display: flex;
  }
}

.box {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #f1f3f4;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dfe1e2;

  &__input {
    display: none;
  }

  &__icon {
    width: 16px;
    height: 16px;
  }

  &._is-active {
    background: #3a8ef9;
    border-color: #3a8ef9;
    color: #fff;
  }
}
</style>
