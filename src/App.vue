<script setup lang="ts">
import AppModalsContainer from "@/containers/AppModalsContainer.vue";
import { computed, onMounted, ref, watch } from "vue";
import "vue3-emoji-picker/css";
import AppBackgroundContainer from "@/containers/AppBackgroundContainer.vue";
import AppHeaderContainer from "@/containers/AppHeaderContainer.vue";
import AppGridContainer from "@/containers/AppGridContainer.vue";
import AppScreenLabelListContainer from "@/containers/AppScreenLabelListContainer.vue";
import AppContextMenuContainer from "@/containers/AppContextMenuContainer.vue";
import { getAppService, getStorageService } from "@/composition/injectors";
import AppSettingsContainer from "@/containers/AppSettingsContainer.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import { useModal } from "@/composition/useModal";

const isLoaded = ref(false);

const storageService = getStorageService();
const storageIsLoaded = computed(() => storageService.getIsLoaded());
const isFirstOpening = computed(() => storageService.isDefaultDataLoaded());

const appService = getAppService();
const isSidebarOpen = computed(() => appService.isSettingsOpen());
const closeSidebar = () => appService.setSettingsOpen(false);

const { openModal: openWelcomeModal } = useModal("welcomeModal");

watch(storageIsLoaded, () => {
  if (isFirstOpening.value) {
    openWelcomeModal({}, {});
  }
});

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 0);
});
</script>

<template>
  <div class="app-root" v-if="storageIsLoaded">
    <app-background-container
      class="app-root__background"
      :class="{ '_is-loaded': isLoaded }"
    />
    <app-modals-container />
    <app-context-menu-container />

    <div class="app-root__content content">
      <app-header-container class="content__header">
        <app-screen-label-list-container />
      </app-header-container>
      <app-grid-container class="content__grid" />
    </div>
    <app-sidebar :is-open="isSidebarOpen" @close="closeSidebar">
      <app-settings-container @save="closeSidebar" />
    </app-sidebar>
  </div>
</template>

<style lang="scss">
:root {
  --app-header-height: 36px;
}

body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px;
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
    background-color: #b5b8be;

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
    min-height: 0;
  }
}
</style>
