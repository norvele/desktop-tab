import { defineStore } from "pinia";
import { ref } from "vue";
import type { BrowserTab, BrowserTopSite } from "@/types";

export const AppStoreDefinition = defineStore("AppStore", () => {
  const isSettingsOpen = ref(false);
  const openedTabs = ref<BrowserTab[]>([]);
  const topSites = ref<BrowserTopSite[]>([]);

  return {
    isSettingsOpen,
    openedTabs,
    topSites,
  };
});
