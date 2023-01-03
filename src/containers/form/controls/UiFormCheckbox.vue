<script setup lang="ts">
import type { PropType } from "vue";
import type { FormControl } from "@/services/form/FormControl";
import { useFormControl } from "@/containers/form/useFormControl";
import { computed, toRef } from "vue";
import type {
  FormControlCheckboxConfig,
  FormControlCheckboxStringConfig,
} from "@/services/form/types";
import UiCheckbox from "@/components/UiCheckbox.vue";
import { FormControlType } from "@/services/form/types";

type FormControlConfig =
  | FormControlCheckboxConfig
  | FormControlCheckboxStringConfig;

const props = defineProps({
  formControl: {
    type: [Object, String] as PropType<FormControl<FormControlConfig> | string>,
    required: true,
  },
});

const { controlProps, formControl } = useFormControl(
  toRef(props, "formControl")
);

const stringValues = computed(() => {
  const config = formControl.value.getConfig();
  if (config.type === FormControlType.CheckboxString) {
    return {
      checked: config.checkedValue,
      unchecked: config.uncheckedValue,
    };
  }
  return undefined;
});
</script>

<template>
  <ui-checkbox v-bind="controlProps" :string-values="stringValues">
    <slot />
  </ui-checkbox>
</template>
