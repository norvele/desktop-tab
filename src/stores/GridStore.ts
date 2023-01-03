import { defineStore } from "pinia";
import { ref } from "vue";

export const GridStoreDefinition = defineStore("GridStore", () => {
  const selectedTileIds = ref<string[]>([]);

  return {
    selectedTileIds,
  };
});
