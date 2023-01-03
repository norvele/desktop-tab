<script setup lang="ts">
import UiTextInput from "@/components/UiTextInput.vue";
import UiModal from "@/components/UiModal.vue";
import UiButton from "@/components/UiButton.vue";
import UiModalFooter from "@/components/UiModalFooter.vue";
import { createFormStore } from "@/stores/useFormStore";
import { ref } from "vue";
import { createRequiredValidator } from "@/utils/validation";
import UiFormField from "@/components/formAdapters/UiFormField.vue";
import { adaptForField } from "@/components/formAdapters/adaptForField";

const UiFormTextInput = adaptForField(UiTextInput);

interface SavePayload {
  label: string;
}

const props = defineProps<{
  title: string;
  label: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "save", payload: SavePayload): void;
}>();

const form = createFormStore("appScreenModalForm", {
  label: {
    ref: ref(""),
    validators: [createRequiredValidator()],
  },
});
form.setErrorsVisible(false);
form.setValues({
  label: props.label || "",
});

const close = () => {
  emit("close");
};

const save = () => {
  form.setErrorsVisible(true);
  if (form.hasError) {
    return;
  }
  emit("save", form.formData);
};
</script>

<template>
  <ui-modal :title="props.title" @close="close">
    <template #content>
      <form id="app-screen-modal" class="content" @submit.prevent="save">
        <ui-form-field
          label="Label"
          class="content__field"
          :field="form.fields.label"
        >
          <ui-form-text-input
            autofocus
            placeholder="Some label"
            :field="form.fields.label"
          />
        </ui-form-field>
      </form>
    </template>

    <template #footer>
      <ui-modal-footer>
        <template #end>
          <ui-button @click="close">Cancel</ui-button>
          <ui-button color="primary" form="app-screen-modal" type="submit"
            >Save</ui-button
          >
        </template>
      </ui-modal-footer>
    </template>
  </ui-modal>
</template>

<style lang="scss" scoped>
.content {
  width: 320px;

  &__field {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
