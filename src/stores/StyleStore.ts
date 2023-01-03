import { defineStore } from "pinia";
import { ref } from "vue";
import type { AppStyle } from "@/types/configRelated/v3/styleTypes";

export const StyleStoreDefinition = defineStore("StyleStore", () => {
  const editingStyle = ref<AppStyle>();

  return {
    editingStyle,
  };
});
