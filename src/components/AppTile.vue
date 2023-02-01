<script setup lang="ts">
import type { Icon } from "@/types";
import AppTileIcon from "@/components/AppTileIcon.vue";
import type { TileStyleUnion } from "@/types/configRelated/v3/styleTypes";

withDefaults(
  defineProps<{
    label: string;
    url: string;
    icon: Icon;
    isSelected?: boolean;
    isAboutToSelect?: boolean;
    style?: TileStyleUnion;
    textColor?: "light" | "dark";
  }>(),
  {
    isSelected: false,
    isAboutToSelect: false,
    style: "circle",
    textColor: "light",
  }
);
</script>

<template>
  <a
    :href="url"
    class="app-tile"
    :class="[
      {
        '_is-selected': isSelected,
        '_is-about-to-select': isAboutToSelect,
      },
      `_text-color-${textColor}`,
    ]"
  >
    <app-tile-icon
      class="app-tile__icon"
      :src="icon.src"
      :symbol="icon.symbol"
      :color="icon.color"
      :style="style"
    />
    <div class="app-tile__label" :title="label">{{ label }}</div>
  </a>
</template>

<style lang="scss" scoped>
@import "@/styles/delayedShowOnHover.scss";
@import "@/styles/iosRound.scss";

.app-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  color: #000;
  padding: 8px;
  user-select: none;
  border: 2px solid transparent;

  &__icon {
    flex-shrink: 1;
    flex-grow: 1;
    margin-bottom: 8px;
    aspect-ratio: 1 / 1;
    min-height: 0;
  }

  &__label {
    flex-shrink: 0;
    flex-grow: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    box-sizing: border-box;
    width: 100%;
    font-size: 13px;
  }

  &._text-color-light {
    .app-tile__label {
      color: #fff;
      text-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
    }

    &:hover {
      background-color: rgba(#fff, 0.2);
    }

    &._is-selected,
    &._is-about-to-select {
      border-color: rgba(#fff, 0.6);
      background-color: rgba(#000, 0.2);
    }
  }
  &._text-color-dark {
    .app-tile__label {
      color: #000;
      text-shadow: 0 0 16px rgba(255, 255, 255, 0.3);
    }

    &:hover {
      background-color: rgba(#000, 0.1);
    }

    &._is-selected,
    &._is-about-to-select {
      border-color: rgba(#000, 0.6);
      background-color: rgba(#fff, 0.2);
    }
  }
}
</style>
