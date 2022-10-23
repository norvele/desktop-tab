<script setup lang="ts">
import AppModalsContainer from "@/containers/AppModalsContainer.vue";
import { onMounted, ref } from "vue";
import AppBackgroundContainer from "@/containers/AppBackgroundContainer.vue";
import { useConfigStore } from "@/stores/useConfigStore";
import AppHeaderContainer from "@/containers/AppHeaderContainer.vue";
import AppGridContainer from "@/containers/AppGridContainer.vue";

const isLoaded = ref(false);

const configStore = useConfigStore();

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 0);
});
</script>

<template>
  <div class="app-root" v-if="configStore.isLoaded">
    <app-background-container
      class="app-root__background"
      :class="{ '_is-loaded': isLoaded }"
    />
    <app-modals-container />

    <div class="app-root__content content">
      <app-header-container class="content__header" />
      <app-grid-container class="content__grid" />
    </div>
  </div>
</template>

<style lang="scss">
body {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body,
html {
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
.app-root {
  &__background {
    position: fixed !important;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: opacity 0.5s;
    background-color: #d1d4da;

    &:not(._is-loaded) {
      opacity: 0;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
  }
}

.content {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    flex-shrink: 0;
    flex-grow: 0;
  }

  &__grid {
    flex-shrink: 1;
    flex-grow: 1;
  }
}
</style>
