import type { Ref } from "vue";
import { computed, inject } from "vue";
import type { FormGroup } from "@/services/form/FormGroup";
import { FormControl } from "@/services/form/FormControl";
import type { FormControlConfig } from "@/services/form/types";

export function useFormControl<Config extends FormControlConfig>(
  control: Ref<FormControl<Config> | string>
) {
  const formGroup = inject<FormGroup>("formGroup");
  const formControl = computed(() => {
    if (control.value instanceof FormControl) {
      return control.value;
    }
    if (!formGroup) {
      throw new Error("No form group provided");
    }
    const result = formGroup.getChild(control.value);
    if (!(result instanceof FormControl)) {
      throw new Error(`${control.value} is not a form control`);
    }
    return result as FormControl<Config>;
  });

  const controlProps = computed(() => getControlProps(formControl.value));

  return { controlProps, formControl };
}

export function getControlProps<Config extends FormControlConfig>(
  control: FormControl<Config>
) {
  let settingValueEvent = "onUpdate:modelValue";
  if (control.getConfig().updateOn === "change") {
    settingValueEvent = "onChange";
  }
  return {
    modelValue: control.getValue(),
    [settingValueEvent]: (value: Config["value"]) => control.setValue(value),
    // hasError: control.getErrors().length > 0,
  };
}
