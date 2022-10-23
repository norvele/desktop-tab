<script lang="ts">
import type { PropType } from "vue";
import { computed, defineComponent, h, mergeProps, unref } from "vue";
import UiField from "@/components/UiField.vue";
import type { Field } from "@/stores/useFormStore";

export default defineComponent({
  components: {
    UiField,
  },
  props: {
    field: {
      type: Object as PropType<Field<any>>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const errors = computed(() => {
      if (props.field.isErrorsVisible) {
        return unref(props.field.errors);
      }
      return [];
    });

    const error = computed(() => {
      return errors.value[0] || "";
    });

    const newProps = computed(() => mergeProps({ error: error.value }, attrs));

    return () => h(UiField, newProps.value, slots);
  },
});
</script>
