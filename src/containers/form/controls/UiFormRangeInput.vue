<script setup lang="ts">
import type { PropType } from "vue";
import type { FormControl } from "@/services/form/FormControl";
import { useFormControl } from "@/containers/form/useFormControl";
import { computed, toRef } from "vue";
import UiRangeInput from "@/components/UiRangeInput.vue";
import type { FormControlNumberFromRangeInputConfig } from "@/services/form/types";

type FormControlType = FormControl<FormControlNumberFromRangeInputConfig>;

const props = defineProps({
  formControl: {
    type: [Object, String] as PropType<FormControlType | string>,
    required: true,
  },
});

const { controlProps, formControl } = useFormControl(
  toRef(props, "formControl")
);
const min = computed(() => formControl.value.getConfig().min);
const max = computed(() => formControl.value.getConfig().max);
</script>

<template>
  <ui-range-input v-bind="controlProps" :min="min" :max="max" />
</template>
