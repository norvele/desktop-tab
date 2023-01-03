<script setup lang="ts">
import UiFormGroup from "@/containers/form/UiFormGroup.vue";
import {
  getFormBuilderService,
  getStyleService,
} from "@/composition/injectors";
import UiFormField from "@/containers/form/UiFormField.vue";
import UiFormSelect from "@/containers/form/controls/UiFormSelect.vue";
import UiFormTextInput from "@/containers/form/controls/UiFormTextInput.vue";
import { createUrlValidator } from "@/utils/validation";
import { FormControlType } from "@/services/form/types";
import {
  OnBackgroundTextColor,
  Theme,
  TileStyle,
} from "@/types/configRelated/v3/styleTypes";
import UiFormColorPicker from "@/containers/form/controls/UiFormColorPicker.vue";
import UiFormRangeInput from "@/containers/form/controls/UiFormRangeInput.vue";
import { computed, onMounted, watch } from "vue";
import debounce from "lodash/debounce";
import UiField from "@/components/UiField.vue";
import UiFormCheckbox from "@/containers/form/controls/UiFormCheckbox.vue";
import UiFormNumberInput from "@/containers/form/controls/UiFormNumberInput.vue";
import UiButton from "@/components/UiButton.vue";
import type { FormGroup } from "@/services/form/FormGroup";
import { getRandomString } from "@/utils/getRandomString";

const styleService = getStyleService();
const builder = getFormBuilderService();

const style = computed(() => styleService.getStyle());

const form = builder.group({
  background: builder.group({
    type: builder.control({
      type: FormControlType.Select,
      value: "url",
      options: [
        { value: "url", label: "URL" },
        { value: "randomGradient", label: "Random gradient" },
      ],
    }),
    url: builder.group({
      url: builder.control({
        type: FormControlType.Text,
        value: "",
        validators: [createUrlValidator()],
        updateOn: "change",
      }),
    }),
    randomGradient: builder.group({
      type: builder.control({
        type: FormControlType.CheckboxString,
        value: "seed",
        checkedValue: "autoChange",
        uncheckedValue: "seed",
      }),
      seed: builder.group({
        seed: builder.control({
          type: FormControlType.Text,
          value: "",
        }),
      }),
      autoChange: builder.group({
        interval: builder.control({
          type: FormControlType.Number,
          value: 1,
          // TODO: Add min/max
          // TODO: Add step
        }),
        unit: builder.control({
          type: FormControlType.Select,
          value: "hour",
          options: [
            { value: "second", label: "Second" },
            { value: "minute", label: "Minute" },
            { value: "hour", label: "Hour" },
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ],
        }),
      }),
    }),
  }),
  overlay: builder.group({
    color: builder.control({
      type: FormControlType.Text,
      value: "#000",
    }),
    opacity: builder.control({
      type: FormControlType.NumberFromRange,
      value: 0,
      min: 0,
      max: 1,
    }),
    blur: builder.control({
      type: FormControlType.NumberFromRange,
      value: 0,
      min: 0,
      max: 1,
    }),
  }),
  onBackgroundTextColor: builder.control({
    type: FormControlType.Select,
    value: OnBackgroundTextColor.light,
    options: [{ value: OnBackgroundTextColor.light, label: "Light" }],
  }),
  tile: builder.group({
    style: builder.control({
      type: FormControlType.Select,
      value: TileStyle.ios,
      options: [
        { value: TileStyle.circle, label: "Circle" },
        { value: TileStyle.ios, label: "iOS" },
        { value: TileStyle.square, label: "Square" },
      ],
    }),
  }),
  theme: builder.control({
    type: FormControlType.Select,
    value: Theme.light,
    options: [{ value: Theme.light, label: "Light" }],
  }),
});

const randomizeSeed = () => {
  form
    .getChild<FormGroup>("background")
    .getChild<FormGroup>("randomGradient")
    .getChild<FormGroup>("seed")
    .getChild("seed")
    .setValue(getRandomString(16));
};

const debouncedUpdateStyle = debounce(() => {
  styleService.updateStyle(form.getValue());
}, 500);

const formData = computed(() => form.getValue());
watch(formData, (value) => {
  if (form.getErrors().length) {
    // TODO: sanitize errors in hidden groups
    console.log("Form has errors", form.getErrors());
    return;
  }
  styleService.updateStyleWithoutSaving(value);
  debouncedUpdateStyle();
});

onMounted(() => {
  form.setValue(style.value);
});
</script>

<template>
  <div>
    <ui-form-group :form-group="form">
      <ui-form-group form-group="background" class="form-section">
        <template #default="backgroundParams">
          <ui-form-field
            form-control="type"
            label="Background"
            class="margin-bottom"
          >
            <ui-form-select form-control="type" />
          </ui-form-field>

          <ui-form-group
            v-if="backgroundParams.formGroup.getValue().type === 'url'"
            form-group="url"
          >
            <ui-form-field form-control="url" label="Image URL">
              <ui-form-text-input form-control="url" />
            </ui-form-field>
          </ui-form-group>

          <ui-form-group
            v-else-if="
              backgroundParams.formGroup.getValue().type === 'randomGradient'
            "
            form-group="randomGradient"
          >
            <template #default="randomGradientParams">
              <ui-form-field
                form-control="type"
                tag="div"
                class="margin-bottom"
              >
                <ui-form-checkbox form-control="type">
                  Auto change
                </ui-form-checkbox>
              </ui-form-field>

              <ui-form-group
                v-if="randomGradientParams.formGroup.getValue().type === 'seed'"
                form-group="seed"
              >
                <ui-form-field form-control="seed" label="Seed">
                  <div class="background-seed">
                    <div class="background-seed__input">
                      <ui-form-text-input form-control="seed" />
                    </div>
                    <div class="background-seed__button">
                      <ui-button color="secondary" @click="randomizeSeed">
                        Randomize
                      </ui-button>
                    </div>
                  </div>
                </ui-form-field>
              </ui-form-group>

              <ui-form-group
                v-else-if="
                  randomGradientParams.formGroup.getValue().type ===
                  'autoChange'
                "
                form-group="autoChange"
              >
                <ui-field label="Change every">
                  <div class="auto-change">
                    <ui-form-number-input form-control="interval" />
                    <ui-form-select form-control="unit" />
                  </div>
                </ui-field>
              </ui-form-group>
            </template>
          </ui-form-group>
        </template>
      </ui-form-group>

      <ui-form-group form-group="overlay" class="form-section">
        <ui-field label="Overlay" tag="div">
          <div class="overlay-color margin-bottom">
            <div class="overlay-color__picker">
              <ui-form-color-picker form-control="color" />
            </div>
            <div class="overlay-color__opacity">
              <ui-form-range-input form-control="opacity" />
            </div>
          </div>
        </ui-field>

        <ui-form-field form-control="blur" label="Blur">
          <ui-form-range-input form-control="blur" />
        </ui-form-field>
      </ui-form-group>

      <div class="form-section">
        <ui-form-field
          form-control="onBackgroundTextColor"
          label="On background text color"
        >
          <ui-form-select form-control="onBackgroundTextColor" />
        </ui-form-field>
      </div>

      <ui-form-group form-group="tile" class="form-section">
        <ui-form-field form-control="style" label="Link style">
          <ui-form-select form-control="style" />
        </ui-form-field>
      </ui-form-group>

      <div class="form-section">
        <ui-form-field form-control="theme" label="Theme">
          <ui-form-select form-control="theme" />
        </ui-form-field>
      </div>
    </ui-form-group>
  </div>
</template>

<style lang="scss" scoped>
.form-section {
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.margin-bottom {
  margin-bottom: 16px;
}

.overlay-color {
  display: flex;
  align-items: center;

  &__picker {
    flex-shrink: 0;
    flex-grow: 0;
    margin-right: 16px;
  }

  &__opacity {
    flex-shrink: 1;
    flex-grow: 1;
  }
}

.auto-change {
  display: flex;
  align-items: center;
  gap: 16px;

  & > * {
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 50%;
  }
}

.background-seed {
  display: flex;
  align-items: center;

  &__input {
    flex-shrink: 1;
    flex-grow: 1;
    margin-right: 16px;
  }

  &__button {
    flex-shrink: 0;
    flex-grow: 0;
  }
}
</style>
