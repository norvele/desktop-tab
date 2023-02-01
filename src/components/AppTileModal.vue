<script setup lang="ts">
import UiTextInput from "@/components/UiTextInput.vue";
import UiModal from "@/components/UiModal.vue";
import UiButton from "@/components/UiButton.vue";
import UiModalFooter from "@/components/UiModalFooter.vue";
import { createFormStore } from "@/stores/useFormStore";
import { computed, ref } from "vue";
import {
  createRequiredValidator,
  createUrlValidator,
} from "@/utils/validation";
import UiFormField from "@/components/formAdapters/UiFormField.vue";
import { adaptForField } from "@/components/formAdapters/adaptForField";
import type { Coordinates, Icon } from "@/types";
import AppEmojiPicker from "@/components/AppEmojiPicker.vue";
import AppTileIcon from "@/components/AppTileIcon.vue";
import UiLink from "@/components/UiLink.vue";
import { getFaviconService } from "@/composition/injectors";
import { isEmoji } from "@/utils/isEmoji";
import type { TileStyleUnion } from "@/types/configRelated/v3/styleTypes";
import { useTheme } from "@/composition/useTheme";

const UiFormTextInput = adaptForField(UiTextInput);
const faviconService = getFaviconService();

interface SavePayload {
  label: string;
  url: string;
  icon: Icon;
  coordinates?: Coordinates;
}

const props = defineProps<{
  title: string;
  label: string;
  url: string;
  tileStyle: TileStyleUnion;
  icon?: Icon;
  coordinates?: Coordinates;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "save", payload: SavePayload, coordinates?: Coordinates): void;
}>();

const { colors } = useTheme();

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

const iconSrc = ref(props.icon?.src || "");
const iconFromLabel = ref<Icon>({
  src: "",
  symbol: props.icon?.symbol || "",
  color: props.icon?.color || "",
});
const emojiSymbol = ref(
  isEmoji(props.icon?.symbol || "") ? (props.icon?.symbol as string) : ""
);

const fetchIconSrc = async () => {
  iconSrc.value = await faviconService.scrapIconSrc(form.fields.url.ref);
};
const fetchIconFromLabel = () => {
  iconFromLabel.value = faviconService.getIconFromLabel(form.fields.label.ref);
};
const onSelectEmoji = (emoji: string) => {
  emojiSymbol.value = emoji;
};
const onResetEmoji = () => {
  emojiSymbol.value = "";
};

const previewIcon = computed<Icon>(() => {
  return {
    src: iconSrc.value,
    symbol: emojiSymbol.value || iconFromLabel.value?.symbol || "",
    color: iconFromLabel.value?.color || "",
  };
});

const close = () => {
  emit("close");
};

const save = () => {
  form.setErrorsVisible(true);
  if (form.hasError) {
    return;
  }
  emit(
    "save",
    {
      ...form.formData,
      icon: previewIcon.value,
    },
    props.coordinates
  );
};
</script>

<template>
  <ui-modal :title="props.title" @close="close">
    <template #content>
      <form id="app-tile-modal" class="content" @submit.prevent="save">
        <div class="content__field">
          <div class="preview">
            <app-tile-icon
              class="preview__icon"
              :src="previewIcon.src"
              :color="previewIcon.color"
              :symbol="previewIcon.symbol"
              :style="tileStyle"
            />
            <div class="preview__links">
              <app-emoji-picker @pick="onSelectEmoji">
                <ui-link class="preview__link">
                  <template v-if="emojiSymbol">Edit emoji</template>
                  <template v-else>Add emoji</template>
                </ui-link>
              </app-emoji-picker>
              <ui-link
                v-if="emojiSymbol"
                class="preview__link"
                @click.prevent="onResetEmoji"
              >
                Remove emoji
              </ui-link>
            </div>
          </div>
        </div>
        <ui-form-field
          label="URL"
          class="content__field"
          :field="form.fields.url"
        >
          <ui-form-text-input
            autofocus
            placeholder="https://some.site"
            :field="form.fields.url"
            @change="fetchIconSrc()"
          />
        </ui-form-field>
        <ui-form-field
          label="Label"
          class="content__field"
          :field="form.fields.label"
        >
          <ui-form-text-input
            placeholder="Some label"
            :field="form.fields.label"
            @input="fetchIconFromLabel()"
          />
        </ui-form-field>
      </form>
    </template>

    <template #footer>
      <ui-modal-footer>
        <template #end>
          <ui-button @click="close">Cancel</ui-button>
          <ui-button color="primary" form="app-tile-modal" type="submit">
            Save
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
}

.preview {
  display: flex;
  align-items: center;
  gap: 16px;

  &__icon {
    width: 50px;
    height: 50px;
    border: 1px solid v-bind("colors.onBaseBackBorder");
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
