import { defineStore, getActivePinia } from "pinia";
import type { ComputedRef, Ref, UnwrapRef } from "vue";
import { computed, ref } from "vue";
import type { Validator } from "@/utils/validation";
import { combineValidators } from "@/utils/validation";

interface FieldConfig<V> {
  ref: Ref<V>; // Value = default value
  validators?: Validator<any>[];
}
type AbstractFieldConfigs = Record<string, FieldConfig<unknown>>;

interface ReactiveField<V> {
  ref: Ref<V>;
  errors: ComputedRef<string[]>;
  hasError: ComputedRef<boolean>;
  isErrorsVisible: ComputedRef<boolean>;
  setValue: (value: V) => void;
}
export type Field<V> = UnwrapRef<ReactiveField<V>>;
type ReactiveFields<FC extends AbstractFieldConfigs> = {
  [K in keyof FC]: ReactiveField<UnwrapRef<FC[K]["ref"]>>;
};
type FormData<FC extends AbstractFieldConfigs> = {
  [K in keyof FC]: UnwrapRef<FC[K]["ref"]>;
};

export function createFormStore<FC extends AbstractFieldConfigs>(
  name: string,
  fieldConfigs: FC
) {
  return defineStore(name, () => {
    return createForm(fieldConfigs);
  })();
}

function createForm<FC extends AbstractFieldConfigs>(fieldConfigs: FC) {
  const isErrorsVisible = ref(false);

  const fields = Object.entries(fieldConfigs).reduce(
    (acc, [key, config]) => ({
      ...acc,
      [key]: createField(config as FieldConfig<FC[keyof FC]>, {
        isErrorsVisible,
      }),
    }),
    {} as ReactiveFields<FC>
  );

  const formData = computed(() => {
    return Object.entries(fields).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: field.ref.value,
      }),
      {} as FormData<FC>
    );
  });

  const hasError = computed(() => {
    const fieldsIds = Object.keys(fields) as Array<keyof FC>;
    return fieldsIds.some((fieldId) => {
      return fields[fieldId].hasError.value;
    });
  });

  const setValues = (data: FormData<FC>) => {
    Object.entries(data).forEach(([key, value]) => {
      fieldConfigs[key].ref.value = value;
    });
  };

  const setErrorsVisible = (value: boolean) => {
    isErrorsVisible.value = value;
  };

  return {
    fields,
    formData,
    hasError,
    setValues,
    setErrorsVisible,
  };
}

function createField<V>(
  config: FieldConfig<V>,
  state: {
    isErrorsVisible: Ref<boolean>;
  }
): ReactiveField<V> {
  const errors = computed(() => {
    const validator = combineValidators(...(config.validators || []));
    const result = validator.validate(config.ref.value);
    if (result) {
      return ([] as string[]).concat(result);
    }
    return [];
  });

  return {
    ref: config.ref,
    errors,
    hasError: computed(() => !!errors.value.length),
    isErrorsVisible: computed(() => state.isErrorsVisible.value),
    setValue: (value: V) => {
      config.ref.value = value;
    },
  };
}
