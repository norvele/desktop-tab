<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, reactive, ref, watch } from "vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import type { DropdownMenuItem, DropdownMenuItems } from "@/types";
import type { AsyncDropdownMenuItems } from "@/types";
import { isFunction } from "lodash";

const props = defineProps<{
  items: DropdownMenuItems | AsyncDropdownMenuItems;
  itemKey?: string;
  autoPosition?: boolean;
}>();

const emit = defineEmits<{
  (event: "item-click", item: DropdownMenuItem): void;
}>();

const normalizedItems = ref<DropdownMenuItem[][]>([]);
const normalizeItems = (items: DropdownMenuItems) => {
  if (Array.isArray(items[0])) {
    return items as DropdownMenuItem[][];
  }
  return [items as DropdownMenuItem[]];
};
watch(
  () => props.items,
  async (value) => {
    if (isFunction(value)) {
      const items = await value();
      normalizedItems.value = normalizeItems(items);
      setTimeout(() => {
        calculatePosition();
      }, 10);
    } else {
      normalizedItems.value = normalizeItems(value);
    }
  },
  {
    immediate: true,
  }
);

const selectedItem = ref<DropdownMenuItem>();

const rootRef = ref() as Ref<HTMLElement>;
const isVisible = ref(!props.autoPosition);
const offsets = reactive({ y: 0, x: 0 });
const selectionTimeout = ref();

const calculatePosition = () => {
  const bounding = rootRef.value.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;
  const intersectionY = innerHeight - bounding.bottom;
  if (intersectionY < 0) {
    offsets.y = intersectionY;
  }
  const intersectionX = innerWidth - bounding.right;
  if (intersectionX < 0) {
    offsets.x = intersectionX;
  }
};

const toggleSelectedItem = (item: DropdownMenuItem) => {
  if (selectedItem.value === item) {
    selectedItem.value = undefined;
  } else {
    selectedItem.value = item;
  }
};

const onItemClick = (item: DropdownMenuItem) => {
  if (item.items) {
    toggleSelectedItem(item);
  } else {
    emit("item-click", item);
  }
};

const onMouseEnter = (item: DropdownMenuItem) => {
  if (item.items) {
    selectionTimeout.value = setTimeout(() => {
      selectedItem.value = item;
    }, 300);
  } else {
    selectedItem.value = undefined;
  }
};

const onMouseLeave = () => {
  clearTimeout(selectionTimeout.value);
};

const getItemKey = (item: DropdownMenuItem) => {
  const keyName = props.itemKey as keyof DropdownMenuItem;
  return props.itemKey ? (item[keyName] as string) : item.label;
};

onMounted(() => {
  if (props.autoPosition) {
    calculatePosition();
    isVisible.value = true;
  }
});
</script>

<template>
  <div
    class="ui-dropdown-menu"
    ref="rootRef"
    :class="{ '_is-visible': isVisible }"
    :style="{
      '--offset-y': offsets.y + 'px',
      '--offset-x': offsets.x + 'px',
    }"
  >
    <div
      class="ui-dropdown-menu__group"
      v-for="(group, i) in normalizedItems"
      :key="i"
    >
      <div
        class="ui-dropdown-menu__item menu-item"
        :class="{
          '_has-submenu': item.items,
          '_is-selected': item === selectedItem,
          '_is-disabled': item.isDisabled,
        }"
        v-for="item in group"
        :key="getItemKey(item)"
        @click="onItemClick(item)"
        @mouseenter="onMouseEnter(item)"
        @mouseleave="onMouseLeave"
      >
        <img
          v-if="item.icon"
          class="menu-item__icon"
          :src="item.icon"
          draggable="false"
          alt=""
        />
        <div class="menu-item__content">
          <div class="menu-item__label">{{ item.label }}</div>
          <div v-if="item.description" class="menu-item__desc">
            {{ item.description }}
          </div>
        </div>
        <icon-chevron-right v-if="item.items" class="menu-item__chevron" />
        <ui-dropdown-menu
          v-if="item.items && selectedItem === item"
          class="menu-item__submenu"
          :items="item.items"
          :item-key="itemKey"
          :auto-position="true"
          @item-click="$emit('item-click', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-dropdown-menu {
  position: relative;
  padding: 4px;
  white-space: nowrap;
  transform: translate(var(--offset-x), var(--offset-y));
  user-select: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#fff, 0.8);
    border-radius: 4px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(#000, 0.12);
    box-sizing: border-box;
    box-shadow: 0 0 2px rgba(#000, 0.12), 0 2px 2px rgba(#000, 0.24);
  }

  &__group {
    position: relative;

    &:not(:last-child) {
      padding-bottom: 4px;
      margin-bottom: 4px;
      border-bottom: 1px solid rgba(#000, 0.12);
    }
  }

  &:not(._is-visible) {
    opacity: 0;
    pointer-events: none;
  }
}

.menu-item {
  position: relative;
  padding: 8px 16px;
  border-radius: 4px;
  color: #000;
  font-size: 13px;
  cursor: pointer;
  display: flex;

  &__icon {
    aspect-ratio: 1 / 1;
    width: 16px;
    object-fit: contain;
    margin-right: 8px;
  }

  &__content {
    max-width: 150px;
  }

  &__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__chevron {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__submenu {
    position: absolute;
    top: -4px;
    left: calc(100% + 4px);
  }

  &__desc {
    font-size: 12px;
    opacity: 0.5;
  }

  &:hover,
  &._is-selected {
    background-color: #3a8ef9;
    color: #fff;
  }

  &._has-submenu {
    padding-right: 32px;
  }

  &._is-disabled {
    color: rgba(#000, 0.3);
    pointer-events: none;

    .menu-item__desc {
      opacity: 1;
    }
  }
}
</style>
