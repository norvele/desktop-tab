<script setup lang="ts">
import {
  getFormBuilderService,
  getGridHelperService,
  getGridService,
} from "@/composition/injectors";
import { computed, onMounted, ref, watch } from "vue";
import type { GridParams } from "@/types";
import UiFormGroup from "@/containers/form/UiFormGroup.vue";
import UiFormField from "@/containers/form/UiFormField.vue";
import UiFormNumberInput from "@/containers/form/controls/UiFormNumberInput.vue";
import UiButton from "@/components/UiButton.vue";

const gridService = getGridService();
const gridHelperService = getGridHelperService();
const builder = getFormBuilderService();

const form = builder.group({
  columns: builder.control({
    type: "number",
    value: 1,
  }),
  rows: builder.control({
    type: "number",
    value: 1,
  }),
});

const hasChanges = computed(() => {
  const savedParams = gridService.getGridParams();
  const formParams = form.getValue();
  return (
    savedParams.columns !== formParams.columns ||
    savedParams.rows !== formParams.rows
  );
});

const setAutoGridParams = () => {
  const params = gridHelperService.getAutoGridParams(
    window.innerWidth,
    window.innerHeight
  );
  form.setValue(params);
};

const isGridParamsValid = ref(true);
const save = async () => {
  isGridParamsValid.value = gridService.isPossibleToChangeGridParams(
    form.getValue() as GridParams
  );
  if (!isGridParamsValid.value) {
    return;
  }
  await gridService.updateGridParams(form.getValue() as GridParams);
};

watch(
  () => form.getValue(),
  () => {
    isGridParamsValid.value = true;
  }
);

onMounted(() => {
  form.setValue(gridService.getGridParams());
});
</script>

<template>
  <form @submit.prevent="save" class="app-grid-settings-container">
    <ui-form-group :form-group="form" class="grid-params">
      <div class="grid-params__fields">
        <ui-form-field
          form-control="rows"
          label="Rows"
          class="grid-params__item"
        >
          <ui-form-number-input form-control="rows" />
        </ui-form-field>

        <ui-form-field
          form-control="columns"
          label="Columns"
          class="grid-params__item"
        >
          <ui-form-number-input form-control="columns" />
        </ui-form-field>

        <div class="grid-params__item">
          <ui-button @click="setAutoGridParams">Auto</ui-button>
        </div>
      </div>

      <div class="grid-params__validation" v-if="!isGridParamsValid">
        Links do not fit on some screens
      </div>
    </ui-form-group>

    <ui-button
      class="content__button"
      color="primary"
      type="submit"
      :is-disabled="!hasChanges"
    >
      Save
    </ui-button>
  </form>
</template>

<style lang="scss" scoped>
.app-grid-settings-container {
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.grid-params {
  margin-bottom: 16px;

  &__fields {
    display: flex;
    gap: 8px;
    align-items: end;
    flex-wrap: nowrap;
  }

  &__item {
    flex-shrink: 0;
    flex-grow: 0;
    min-width: 0;
    width: 33.33%;
  }

  &__validation {
    font-size: 12px;
    margin-top: 4px;
    color: #f44336;
  }
}
</style>
