<script setup lang="ts">
import UiModal from "@/components/UiModal.vue";
import UiButton from "@/components/UiButton.vue";
import UiModalFooter from "@/components/UiModalFooter.vue";
import type { BrowserTab, TileSource } from "@/types";
import { computed, ref } from "vue";
import AppSelectableList from "@/components/AppSelectableList.vue";

const props = defineProps<{
  openedTabs: TileSource[];
  topSites: TileSource[];
  onSubmit: (tileSources: TileSource[]) => Promise<void>;
  freePlacesNumber?: number;
  closeButtonText?: string;
  submitButtonText?: string;
  title?: string;
}>();

defineEmits<{
  (event: "close"): void;
}>();

const isLoading = ref(false);

const selectedOpenedTabs = ref<BrowserTab[]>([]);
const onSelectOpenedTabs = (tabs: unknown[]) => {
  selectedOpenedTabs.value = tabs as BrowserTab[];
};

const selectedTopSites = ref<TileSource[]>([]);
const onSelectTopSites = (sites: unknown[]) => {
  selectedTopSites.value = sites as TileSource[];
};

const selectedItemsNumber = computed(() => {
  return selectedOpenedTabs.value.length + selectedTopSites.value.length;
});

const hasLimit = computed(() => {
  return props.freePlacesNumber !== undefined;
});

const isOverLimit = computed(() => {
  return (
    hasLimit.value && selectedItemsNumber.value > (props.freePlacesNumber || 0)
  );
});

const submit = async () => {
  if (isOverLimit.value) {
    return;
  }
  try {
    isLoading.value = true;
    await props.onSubmit([
      ...selectedOpenedTabs.value,
      ...selectedTopSites.value,
    ]);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <ui-modal :title="title || 'Add a few Links'" @close="$emit('close')">
    <template #content>
      <slot name="pre-content"></slot>
      <div class="content">
        <div class="content__column">
          <app-selectable-list
            title="Opened tabs"
            :items="openedTabs"
            @select="onSelectOpenedTabs"
          >
            <template #item="{ item }">
              <div class="item">
                <img class="item__icon" :src="item.iconUrl" alt="" />
                <div class="item__label">
                  {{ item.title }}
                </div>
              </div>
            </template>
          </app-selectable-list>
        </div>

        <div class="content__column">
          <app-selectable-list
            title="Most visited"
            :items="topSites"
            @select="onSelectTopSites"
          >
            <template #item="{ item }">
              <div class="item">
                <img class="item__icon" :src="item.iconUrl" alt="" />
                <div class="item__label">
                  {{ item.title }}
                </div>
              </div>
            </template>
          </app-selectable-list>
        </div>
      </div>
    </template>

    <template #footer>
      <ui-modal-footer>
        <template #start>
          <div
            v-if="hasLimit"
            class="counter"
            :class="{ '_is-over-limit': isOverLimit }"
          >
            Selected {{ selectedItemsNumber }} / {{ freePlacesNumber }}
            <div v-if="isOverLimit">
              There are only {{ freePlacesNumber }} free places on the screen
            </div>
          </div>
        </template>
        <template #end>
          <ui-button @click="$emit('close')">
            {{ closeButtonText || "Cancel" }}
          </ui-button>
          <ui-button
            color="primary"
            :is-disabled="isLoading || isOverLimit || !selectedItemsNumber"
            @click="submit"
          >
            {{ submitButtonText || "Add" }}
          </ui-button>
        </template>
      </ui-modal-footer>
    </template>
  </ui-modal>
</template>

<style lang="scss" scoped>
.content {
  width: 500px;
  display: flex;
  flex-wrap: nowrap;

  &__column {
    width: 50%;
    padding: 0 16px;
    border-right: 1px solid #eaeaea;
    box-sizing: border-box;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
      border-right: none;
    }
  }
}

.item {
  display: flex;
  align-items: center;
  user-select: none;

  &__icon {
    aspect-ratio: 1 / 1;
    width: 16px;
    object-fit: contain;
    margin-right: 8px;
  }

  &__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.counter {
  &._is-over-limit {
    color: #f44336;
  }
}
</style>
