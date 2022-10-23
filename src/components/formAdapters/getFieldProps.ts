import type { Field } from "@/stores/useFormStore";

export function getFieldProps<V = unknown>(field: Field<V>) {
  return {
    modelValue: field.ref,
    "onUpdate:modelValue": (value: V) => field.setValue(value),
    hasError: field.hasError && field.isErrorsVisible,
  };
}
