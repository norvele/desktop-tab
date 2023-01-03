<script setup lang="ts">
import { FormGroup } from "@/services/form/FormGroup";
import type { PropType } from "vue";
import { computed, inject, provide } from "vue";

type FormGroupName = string;

const props = defineProps({
  formGroup: {
    type: [Object, String] as PropType<FormGroup | FormGroupName>,
    required: true,
  },
});

const injectedFormGroup = inject<FormGroup | undefined>("formGroup", undefined);
const formGroup = computed(() => {
  if (props.formGroup instanceof FormGroup) {
    return props.formGroup;
  }
  if (!injectedFormGroup) {
    throw new Error("No form group provided");
  }
  const result = injectedFormGroup.getChild(props.formGroup);
  if (!(result instanceof FormGroup)) {
    throw new Error(`${props.formGroup} is not a form group`);
  }
  return result;
});
provide("formGroup", formGroup.value);
</script>

<template>
  <div>
    <slot :form-group="formGroup" />
  </div>
</template>

<style lang="scss" scoped></style>
