<script setup lang="ts">
import UiTextInput from "@/components/UiTextInput.vue";
import UiModal from "@/components/UiModal.vue";
import UiButton from "@/components/UiButton.vue";
import UiModalFooter from "@/components/UiModalFooter.vue";
import { createFormStore } from "@/stores/useFormStore";
import { ref } from "vue";
import {
  createRequiredValidator,
  createUrlValidator,
} from "@/utils/validation";
import UiFormField from "@/components/formAdapters/UiFormField.vue";
import { adaptForField } from "@/components/formAdapters/adaptForField";

const UiFormTextInput = adaptForField(UiTextInput);

interface SavePayload {
  label: string;
  url: string;
}

const props = defineProps<{
  title: string;
  label: string;
  url: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "delete"): void;
  (event: "save", payload: SavePayload): void;
}>();

const form = createFormStore("appTileModalForm", {
  label: {
    ref: ref(""),
    validators: [createRequiredValidator()],
  },
  url: {
    ref: ref(""),
    validators: [createRequiredValidator(), createUrlValidator()],
  },
});
form.setErrorsVisible(false);
form.setValues({
  label: props.label || "",
  url: props.url || "",
});

const close = () => {
  emit("close");
};

const deleteTile = () => {
  emit("delete");
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
      <div class="content">
        <ui-form-field
          label="Label"
          class="content__field"
          :field="form.fields.label"
        >
          <ui-form-text-input
            placeholder="Some label"
            :field="form.fields.label"
          />
        </ui-form-field>
        <ui-form-field
          label="URL"
          class="content__field"
          :field="form.fields.url"
        >
          <ui-form-text-input
            placeholder="https://some.site"
            :field="form.fields.url"
          />
        </ui-form-field>
      </div>
    </template>

    <template #footer>
      <ui-modal-footer>
        <template #start>
          <ui-button @click="deleteTile">Delete</ui-button>
        </template>
        <template #end>
          <ui-button @click="close">Cancel</ui-button>
          <ui-button color="primary" @click="save">Save</ui-button>
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
