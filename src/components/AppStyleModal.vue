<script setup lang="ts">
import UiTextInput from "@/components/UiTextInput.vue";
import UiRangeInput from "@/components/UiRangeInput.vue";
import UiNumberInput from "@/components/UiNumberInput.vue";
import UiModal from "@/components/UiModal.vue";
import UiButton from "@/components/UiButton.vue";
import UiModalFooter from "@/components/UiModalFooter.vue";
import { createFormStore } from "@/stores/useFormStore";
import { ref } from "vue";
import { createUrlValidator } from "@/utils/validation";
import UiFormField from "@/components/formAdapters/UiFormField.vue";
import { adaptForField } from "@/components/formAdapters/adaptForField";

const UiFormTextInput = adaptForField(UiTextInput);
const UiFormNumberInput = adaptForField(UiNumberInput);
const UiFormRangeInput = adaptForField(UiRangeInput);

interface SavePayload {
  backgroundUrl: string;
  backgroundOverlay: number;
  backgroundBlur: number;
  gridColumns: number;
  gridRows: number;
}

const props = defineProps<{
  backgroundUrl: string;
  backgroundOverlay: number;
  backgroundBlur: number;
  gridColumns: number;
  gridRows: number;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "save", payload: SavePayload): void;
  (event: "input", payload: SavePayload): void;
}>();

const form = createFormStore("appStyleModalForm", {
  backgroundUrl: {
    ref: ref(""),
    validators: [createUrlValidator()],
  },
  backgroundOverlay: {
    ref: ref(0.5),
  },
  backgroundBlur: {
    ref: ref(0),
  },
  gridColumns: {
    ref: ref(1),
  },
  gridRows: {
    ref: ref(1),
  },
});
form.setErrorsVisible(false);
form.setValues({
  backgroundUrl: props.backgroundUrl || "",
  backgroundOverlay: props.backgroundOverlay ?? 0.5,
  backgroundBlur: props.backgroundBlur ?? 0,
  gridColumns: props.gridColumns ?? 1,
  gridRows: props.gridRows ?? 1,
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

const onInput = () => {
  emit("input", form.formData);
};
</script>

<template>
  <ui-modal title="Edit style" @close="close">
    <template #content>
      <div class="content">
        <ui-form-field
          label="URL"
          class="content__field"
          :field="form.fields.backgroundUrl"
        >
          <ui-form-text-input
            placeholder="https://url.to.image"
            :field="form.fields.backgroundUrl"
            @update:modelValue="onInput"
          />
        </ui-form-field>
        <ui-form-field
          label="Overlay"
          class="content__field"
          :field="form.fields.backgroundOverlay"
        >
          <ui-form-range-input
            :field="form.fields.backgroundOverlay"
            :min="0"
            :max="1"
            has-center
            @update:modelValue="onInput"
          />
        </ui-form-field>

        <ui-form-field
          label="Columns"
          class="content__field"
          :field="form.fields.gridColumns"
        >
          <ui-form-number-input :field="form.fields.gridColumns" />
        </ui-form-field>
        <ui-form-field
          label="Rows"
          class="content__field"
          :field="form.fields.gridRows"
        >
          <ui-form-number-input :field="form.fields.gridRows" />
        </ui-form-field>
      </div>
    </template>

    <template #footer>
      <ui-modal-footer>
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
