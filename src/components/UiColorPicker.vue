<script setup lang="ts">
import { useTheme } from "@/composition/useTheme";

defineProps<{
  modelValue: string;
  label?: string;
  isBlock?: boolean;
}>();

const emit = defineEmits({
  "update:model-value": (_value: string) => true,
});

const onInput = (event: Event) => {
  emit("update:model-value", (event.target as HTMLInputElement)?.value || "");
};

const { colors } = useTheme();
</script>

<template>
  <div class="ui-color-picker">
    <label class="picker" :class="{ '_is-block': isBlock }">
      <div
        class="picker__box box"
        :style="{
          '--color': modelValue,
        }"
      >
        <input
          class="box__input"
          type="color"
          :value="modelValue"
          @input="onInput"
        />
      </div>
      <span v-if="label || $slots.default" class="picker__label">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.ui-color-picker {
  line-height: 0;
}

.picker {
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
  --color: #000;
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid v-bind("colors.onBaseBackBorder");
  background-color: var(--color);
  line-height: 0;

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
