<script setup lang="ts">
import type { PropType } from "vue";
import type { FormControl } from "@/services/form/FormControl";
import UiSelect from "@/components/UiSelect.vue";
import { useFormControl } from "@/containers/form/useFormControl";
import { computed, toRef } from "vue";
import type { FormControlSelectConfig } from "@/services/form/types";

type FormControlType = FormControl<FormControlSelectConfig>;

const props = defineProps({
  formControl: {
    type: [Object, String] as PropType<FormControlType | string>,
    required: true,
  },
});

const { controlProps, formControl } = useFormControl(
  toRef(props, "formControl")
);
const options = computed(() => formControl.value.getConfig().options);
</script>

<template>
  <ui-select v-bind="controlProps" :options="options" />
</template>
