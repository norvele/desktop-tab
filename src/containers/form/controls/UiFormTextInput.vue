<script setup lang="ts">
import type { PropType } from "vue";
import type { FormControl } from "@/services/form/FormControl";
import { useFormControl } from "@/containers/form/useFormControl";
import { toRef } from "vue";
import UiTextInput from "@/components/UiTextInput.vue";
import type { FormControlTextInputConfig } from "@/services/form/types";

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
  <ui-text-input v-bind="controlProps" />
</template>
