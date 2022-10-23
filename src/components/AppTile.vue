<script setup lang="ts">
import type { Icon } from "@/types";
import IconKebab from "@/components/icons/IconKebab.vue";
import UiIconButton from "@/components/UiIconButton.vue";

defineProps<{
  label: string;
  url: string;
  icon: Icon;
  isSelected?: boolean;
}>();

defineEmits<{
  (e: "click-more"): void;
}>();
</script>

<template>
  <a :href="url" class="app-tile" :class="{ '_is-selected': isSelected }">
    <div class="tile">
      <div class="tile__icon tile-icon">
        <slot name="icon">
          <img
            v-if="icon.src"
            class="tile-icon__img"
            :src="icon.src"
            draggable="false"
            alt=""
          />
          <div class="tile-icon__stub" :style="{ backgroundColor: icon.color }">
            {{ icon.symbol }}
          </div>
        </slot>
      </div>
      <div class="tile__label">{{ label }}</div>
    </div>
    <ui-icon-button
      class="app-tile__action"
      @click.stop.prevent="$emit('click-more')"
    >
      <icon-kebab />
    </ui-icon-button>
  </a>
</template>

<style lang="scss" scoped>
@import "@/styles/delayedShowOnHover.scss";

.app-tile {
  @include delayedShowOnHover(".app-tile__action");
  box-sizing: border-box;
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  color: #000;
  padding: 16px 32px;

  &__action {
    margin: 4px 2px;
    position: absolute;
    top: 0;
    right: 0;
  }

  &:hover {
    background-color: rgba(#fff, 0.2);
  }

  &._is-selected {
    border: 1px solid #fff;
    background-color: rgba(#000, 0.2);
  }
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;

  &__icon {
    margin-bottom: 8px;
  }

  &__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    padding: 0 8px;
    box-sizing: border-box;
    width: 100%;
    font-size: 13px;
    text-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
    color: #fff;
  }
}

.tile-icon {
  width: 48px;
  height: 48px;
  background-color: #f1f3f4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__img {
    width: 24px;
    height: 24px;
  }

  &__stub {
    width: 24px;
    height: 24px;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
