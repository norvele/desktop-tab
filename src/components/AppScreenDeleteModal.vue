<script setup lang="ts">
import UiSelect from "@/components/UiSelect.vue";
import UiModal from "@/components/UiModal.vue";
import UiButton from "@/components/UiButton.vue";
import UiModalFooter from "@/components/UiModalFooter.vue";
import { createFormStore } from "@/stores/useFormStore";
import { computed, ref } from "vue";
import UiFormField from "@/components/formAdapters/UiFormField.vue";
import { adaptForField } from "@/components/formAdapters/adaptForField";
import type { TileScreen, SelectOption } from "@/types";

const UiFormSelect = adaptForField(UiSelect);

interface SubmitPayload {
  newScreenId: string;
}

const props = defineProps<{
  title: string;
  tilesNumber: number;
  screenList: TileScreen[];
  screenIdToDelete: string;
  getFreeScreenPlacesNumber: (screenId: string) => number;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "submit", payload: SubmitPayload): void;
}>();

const newScreenOptions = computed(() => {
  const options: SelectOption[] = props.screenList
    .filter((screen) => screen.id !== props.screenIdToDelete)
    .map((screen) => {
      const isAvailable =
        props.getFreeScreenPlacesNumber(screen.id) >= props.tilesNumber;
      const labelSuffix = isAvailable ? "" : " (Not enough space)";
      return {
        value: screen.id,
        label: `${screen.label}${labelSuffix}`,
        isDisabled: !isAvailable,
      };
    });
  options.unshift({
    value: "",
    label: "Delete all Links",
  });
  return options;
});

const form = createFormStore("appScreenDeleteModalForm", {
  newScreenId: {
    ref: ref(""),
  },
});
form.setErrorsVisible(false);
form.setValues({
  newScreenId: "",
});

const submitButtonText = computed(() => {
  return form.fields.newScreenId.ref ? "Move Links" : "Delete all";
});

const close = () => {
  emit("close");
};

const submit = () => {
  form.setErrorsVisible(true);
  if (form.hasError) {
    return;
  }
  emit("submit", form.formData);
};
</script>

<template>
  <ui-modal :title="props.title" @close="close">
    <template #content>
      <form
        id="app-screen-delete-modal"
        class="content"
        @submit.prevent="submit"
      >
        <div class="content__description">
          The screen contains {{ tilesNumber }} Links. You can move them to
          another screen or delete them
        </div>

        <ui-form-field
          label="Move tiles to"
          class="content__field"
          :field="form.fields.newScreenId"
        >
          <ui-form-select
            autofocus
            :field="form.fields.newScreenId"
            :options="newScreenOptions"
          />
        </ui-form-field>
      </form>
    </template>

    <template #footer>
      <ui-modal-footer>
        <template #end>
          <ui-button @click="close">Cancel</ui-button>
          <ui-button
            color="primary"
            form="app-screen-delete-modal"
            type="submit"
          >
            {{ submitButtonText }}
          </ui-button>
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

  &__description {
    font-size: 13px;
    margin-bottom: 16px;
  }
}
</style>
