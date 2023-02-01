<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import UiIconButton from "@/components/UiIconButton.vue";
import IconCross from "@/components/icons/IconCross.vue";
import { useTheme } from "@/composition/useTheme";

defineProps<{
  title: string;
}>();

const emit = defineEmits({
  close: () => true,
});

const { colors, isDark } = useTheme();

const backdrop = ref<HTMLElement>();

const close = () => {
  emit("close");
};
const clickListener = (event: MouseEvent) => {
  if (backdrop.value === event.target) {
    close();
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", clickListener);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickListener);
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <div class="ui-modal">
    <div class="ui-modal__backdrop" ref="backdrop"></div>
    <div class="ui-modal__container container">
      <ui-icon-button
        class="container__close"
        @click="close"
        :color="isDark ? 'light' : 'dark'"
      >
        <icon-cross />
      </ui-icon-button>
      <div class="container__title" v-if="title">{{ title }}</div>
      <slot name="content" />
      <div class="container__footer" v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  align-items: center;
  overflow: auto;
  flex-direction: column;
  padding: 8px 0;
  box-sizing: border-box;

  &__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }

  &__container {
    margin-top: auto;
    margin-bottom: auto;
  }
}

.container {
  position: relative;
  padding: 24px;
  background-color: v-bind("colors.baseBack");
  border-radius: 8px;
  box-shadow: 0 0 16px rgb(0 0 0 / 12%), 0 16px 16px rgb(0 0 0 / 24%);

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  &__title {
    font-size: 18px;
    margin-bottom: 16px;
    padding-right: 32px;
    margin-top: -8px;
    color: v-bind("colors.onBaseBackContrast");
  }

  &__footer {
    margin-top: 24px;
  }
}
</style>
