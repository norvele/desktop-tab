<script setup lang="ts">
import type { PropType } from "vue";
import type { FormControl } from "@/services/form/FormControl";
import { useFormControl } from "@/containers/form/useFormControl";
import { toRef } from "vue";
import type { FormControlTextInputConfig } from "@/services/form/types";
import UiColorPicker from "@/components/UiColorPicker.vue";

type FormControlType = FormControl<FormControlTextInputConfig>;

const props = defineProps({
  formControl: {
    type: [Object, String] as PropType<FormControlType | string>,
    required: true,
  },
});

const { controlProps } = useFormControl(toRef(props, "formControl"));
</script>

<template>
  <ui-color-picker v-bind="controlProps" />
</template>
