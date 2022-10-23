import { defineStore } from "pinia";
import type { AppStyle } from "@/types";
import { computed, ref } from "vue";
import { useConfigStore } from "@/stores/useConfigStore";

export const useStyleStore = defineStore("styleStore", () => {
  const configStore = useConfigStore();

  const editingStyle = ref<AppStyle>(configStore.getDefaultStyle());
  const style = computed(() => configStore.config.style);

  const updateStyle = async (style: Partial<AppStyle>) => {
    await configStore.updateStyle(style);
  };

  return {
    editingStyle,
    style,
    updateStyle,
  };
});
