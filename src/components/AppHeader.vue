<script setup lang="ts">
import UiIconButton from "@/components/UiIconButton.vue";
import IconPencil from "@/components/icons/IconPencil.vue";
import IconPlus from "@/components/icons/IconPlus.vue";

defineEmits<{
  (e: "click-add"): void;
  (e: "click-settings"): void;
}>();
</script>

<template>
  <div class="app-header">
    <div class="app-header__start">
      <ui-icon-button is-muted @click="$emit('click-add')">
        <icon-plus />
      </ui-icon-button>
    </div>
    <div class="app-header__center">
      <slot />
    </div>
    <div class="app-header__end">
      <ui-icon-button is-muted @click="$emit('click-settings')">
        <icon-pencil />
      </ui-icon-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px;
}
</style>
