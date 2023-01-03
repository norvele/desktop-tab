import { defineStore } from "pinia";
import { ref } from "vue";

export const ScreenStoreDefinition = defineStore("ScreenStore", () => {
  const currentScreenId = ref("");

  return {
    currentScreenId,
  };
});
