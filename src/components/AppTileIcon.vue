<script setup lang="ts">
import { computed } from "vue";
import { isEmoji } from "@/utils/isEmoji";
import type { TileStyleUnion } from "@/types/configRelated/v3/styleTypes";
import { useTheme } from "@/composition/useTheme";

const props = defineProps<{
  src: string;
  symbol: string;
  color: string;
  style?: TileStyleUnion;
}>();

const { colors } = useTheme();

const isEmojiSymbol = computed(() => {
  return isEmoji(props.symbol);
});
</script>

<template>
  <div
    class="app-tile-icon"
    :class="[`_style-${style || 'circle'}`, { '_is-emoji': isEmojiSymbol }]"
  >
    <img
      v-if="src && !isEmojiSymbol"
      class="app-tile-icon__img"
      :src="src"
      draggable="false"
      alt=""
    />
    <div v-else class="app-tile-icon__stub" :style="{ backgroundColor: color }">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        preserveAspectRatio="xMinYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
          :font-size="isEmojiSymbol ? 32 : 16"
          fill="white"
        >
          {{ symbol }}
        </text>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/iosRound.scss";

.app-tile-icon {
  background-color: v-bind("colors.tileBack");
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid v-bind("colors.tileBack");
  border-radius: 4px;
  overflow: hidden;

  &._style-ios {
    @include iosRound;

    .app-tile-icon__stub {
      @include iosRound;
    }
  }

  &._style-circle {
    border-radius: 999px;

    .app-tile-icon__stub {
      border-radius: 999px;
    }
  }

  &._style-only-icon {
    border-color: transparent;
    background-color: transparent;

    .app-tile-icon__img {
      max-width: 100%;
    }

    .app-tile-icon__stub {
      max-width: 100%;
      border-radius: 999px;
    }
  }

  &__img {
    aspect-ratio: 1 / 1;
    max-width: 32px;
    width: 100%;
  }

  &__stub {
    aspect-ratio: 1 / 1;
    max-width: 32px;
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  &._is-emoji {
    .app-tile-icon__stub {
      background: none !important;
      font-size: 32px;
      line-height: 0;
    }
  }
}
</style>
