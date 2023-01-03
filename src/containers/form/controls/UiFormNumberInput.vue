<script setup lang="ts">
import type { PropType } from "vue";
import type { FormControl } from "@/services/form/FormControl";
import { useFormControl } from "@/containers/form/useFormControl";
import { toRef } from "vue";
import type { FormControlNumberInputConfig } from "@/services/form/types";
import UiNumberInput from "@/components/UiNumberInput.vue";

type FormControlType = FormControl<FormControlNumberInputConfig>;

const props = defineProps({
  formControl: {
    type: [Object, String] as PropType<FormControlType | string>,
    required: true,
  },
});

const { controlProps } = useFormControl(toRef(props, "formControl"));
</script>

<template>
  <ui-number-input v-bind="controlProps" />
</template>
