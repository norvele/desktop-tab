<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: number;
  min: number;
  max: number;
  hasCenter: boolean;
}>();

const emit = defineEmits({
  "update:model-value": (value: number) => true,
});

const normalizedValue = computed(() => {
  const percentage = (props.modelValue - props.min) / (props.max - props.min);
  return percentage * 100;
});

const onInput = (event: Event) => {
  const nValue = Number((event.target as HTMLInputElement)?.value) || 0;
  const percentage = nValue / 100;
  const value = percentage * (props.max - props.min) + props.min;
  emit("update:model-value", value);
};
</script>

<template>
  <div class="ui-range-input" :class="{ '_has-center': hasCenter }">
    <input
      class="ui-range-input__input"
      type="range"
      :value="normalizedValue"
      :min="0"
      :max="100"
      :step="1"
      @input="onInput"
    />
  </div>
</template>

<style lang="scss" scoped>
.ui-range-input {
  position: relative;
  line-height: 0;

  &__input {
    height: 28px;
    -webkit-appearance: none;
    margin: 0;
    width: 100%;
    position: relative;
    background: transparent;

    &:focus {
      outline: none;
    }

    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 2px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 0 0 0 #000000;
      background: #f1f3f4;
      border-radius: 2px;
      border: 0 solid #000000;
    }

    &::-webkit-slider-thumb {
      box-shadow: 0 0 0 #000000;
      border: 0 solid #2497e3;
      height: 14px;
      width: 14px;
      border-radius: 8px;
      background: #1a73e8;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -6px;
    }
    &:focus::-webkit-slider-runnable-track {
      background: #f1f3f4;
    }
  }

  &._has-center {
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 0;
      width: 2px;
      height: 100%;
      background-color: #f1f3f4;
      transform: translateX(-50%);
    }
  }
}
</style>
