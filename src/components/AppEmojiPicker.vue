<script lang="ts" setup>
import EmojiPicker from "vue3-emoji-picker";
import UiDropdown from "@/components/UiDropdown.vue";

const emit = defineEmits<{
  (event: "pick", emoji: string): void;
}>();

const onSelect = (emoji: any, close: () => void) => {
  emit("pick", emoji.i);
  close();
};
</script>

<template>
  <div class="app-emoji-picker">
    <ui-dropdown>
      <template #trigger>
        <slot />
      </template>
      <template #body="{ close }">
        <emoji-picker :native="true" @select="onSelect($event, close)" />
      </template>
    </ui-dropdown>
  </div>
</template>
