<script lang="ts">
import type { PropType } from "vue";
import { computed, defineComponent, h, inject, mergeProps } from "vue";
import UiField from "@/components/UiField.vue";
import { FormControl } from "@/services/form/FormControl";
import type { FormGroup } from "@/services/form/FormGroup";

export default defineComponent({
  components: {
    UiField,
  },
  props: {
    formControl: {
      type: [Object, String] as PropType<FormControl | string>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const formGroup = inject<FormGroup>("formGroup");
    const formControl = computed(() => {
      if (props.formControl instanceof FormControl) {
        return props.formControl;
      }
      if (!formGroup) {
        throw new Error("No form group provided");
      }
      const result = formGroup.getChild(props.formControl);
      if (!(result instanceof FormControl)) {
        throw new Error(`${props.formControl} is not a form control`);
      }
      return result;
    });

    const errors = computed(() => formControl.value.getErrors());

    const error = computed(() => {
      return errors.value[0] || "";
    });

    const newProps = computed(() => mergeProps({ error: error.value }, attrs));

    return () => h(UiField, newProps.value, slots);
  },
});
</script>
