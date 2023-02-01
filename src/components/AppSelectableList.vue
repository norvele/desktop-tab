<script lang="ts" setup>
import UiCheckbox from "@/components/UiCheckbox.vue";
import { computed, ref, watch } from "vue";
import { useTheme } from "@/composition/useTheme";

type Item = { id: string } & any;
type SelectedItems = { [id: string]: true };

const props = defineProps<{
  items: Item[];
  title?: string;
}>();

const emit = defineEmits<{
  (event: "select", items: Item[]): void;
}>();

const { colors } = useTheme();

const selectedIds = ref<SelectedItems>({});

watch(
  selectedIds,
  (value) => {
    emit(
      "select",
      props.items.filter((item) => value[item.id])
    );
  },
  { deep: true }
);

const isSelected = (id: string) => {
  return selectedIds.value[id] || false;
};

const allSelectionValue = computed(() => {
  const selectedItemsNumber = Object.keys(selectedIds.value).length;
  if (selectedItemsNumber === props.items.length) {
    return true;
  }
  if (selectedItemsNumber === 0) {
    return false;
  }
  return null;
});

const toggleSelection = (id: string) => {
  if (isSelected(id)) {
    delete selectedIds.value[id];
  } else {
    selectedIds.value[id] = true;
  }
};

const selectAll = () => {
  selectedIds.value = props.items.reduce((acc, tab) => {
    acc[tab.id] = true;
    return acc;
  }, {} as SelectedItems);
};

const deselectAll = () => {
  selectedIds.value = {};
};

const toggleAll = () => {
  if (allSelectionValue.value === true) {
    deselectAll();
  } else {
    selectAll();
  }
};
</script>

<template>
  <div>
    <div class="list">
      <div class="list__item item _header">
        <div class="item__checkbox">
          <ui-checkbox
            is-block
            :model-value="allSelectionValue"
            @update:model-value="toggleAll"
          >
            <div v-if="title" class="item__title">{{ title }}</div>
          </ui-checkbox>
        </div>
      </div>
      <div
        class="list__item item"
        v-for="item in items"
        :key="item.id"
        :class="{ '_is-selected': isSelected(item.id) }"
      >
        <ui-checkbox
          class="item__checkbox"
          is-block
          :model-value="isSelected(item.id)"
          @update:model-value="toggleSelection(item.id)"
        >
          <slot name="item" :item="item"></slot>
        </ui-checkbox>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list {
  &__item {
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }
}

.item {
  display: flex;
  align-items: center;
  position: relative;

  &__checkbox {
    position: relative;
    padding: 4px 0;
    width: 100%;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
  }

  &._header {
    border-bottom: 2px solid v-bind("colors.onBaseBackBorder");
    padding-bottom: 4px;
    color: v-bind("colors.onBaseBack");
  }

  &._is-selected {
    &::before {
      $offsetH: 4px;
      $offsetV: 0px;
      content: "";
      position: absolute;
      top: -$offsetV;
      left: -$offsetH;
      right: -$offsetH;
      bottom: -$offsetV;
      background-color: v-bind("colors.baseButtonBack");
      border-radius: 4px;
    }
  }
}
</style>
