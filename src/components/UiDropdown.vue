<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const triggerRef = ref<HTMLElement>();
const bodyRef = ref<HTMLElement>();
const isOpened = ref(false);

const close = () => {
  isOpened.value = false;
};
const toggle = () => {
  isOpened.value = !isOpened.value;
};
const clickListener = (event: Event) => {
  if (
    !triggerRef.value?.contains(event.target as HTMLElement) &&
    !bodyRef.value?.contains(event.target as HTMLElement)
  ) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", clickListener);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickListener);
});
</script>

<template>
  <div class="ui-dropdown">
    <div class="ui-dropdown__trigger" ref="triggerRef" @click="toggle">
      <slot name="trigger" />
    </div>
    <div v-if="isOpened" ref="bodyRef" class="ui-dropdown__body">
      <slot name="body" :close="close" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ui-dropdown {
  position: relative;

  &__trigger {
    display: inline-block;
  }

  &__body {
    z-index: 100;
    position: absolute;
  }
}
</style>
