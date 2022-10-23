import type { PropType } from "vue";
import { computed, defineComponent, h, mergeProps } from "vue";
import { getFieldProps } from "@/components/formAdapters/getFieldProps";
import type { Field } from "@/stores/useFormStore";

export function adaptForField(InputComponent: any) {
  return defineComponent({
    components: {
      InputComponent,
    },
    props: {
      field: {
        type: Object as PropType<Field<any>>,
        required: true,
      },
    },
    setup(props, { attrs, slots }) {
      const newProps = computed(() =>
        mergeProps(getFieldProps(props.field), attrs)
      );

      return () => h(InputComponent, newProps.value, slots);
    },
  });
}
