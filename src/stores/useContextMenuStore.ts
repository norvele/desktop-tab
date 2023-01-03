import { defineStore } from "pinia";
import { ref } from "vue";
import type { DropdownMenuItems } from "@/types";

interface ContextMenuCoordinates {
  x: number;
  y: number;
}
interface ContextMenuData {
  isOpen: boolean;
  items: DropdownMenuItems;
  coordinates: ContextMenuCoordinates;
}

export const useContextMenuStore = defineStore("contextMenuStore", () => {
  const data = ref<ContextMenuData>(getDefaultData());

  const open = (
    items: DropdownMenuItems,
    coordinates: ContextMenuCoordinates
  ) => {
    data.value = {
      isOpen: true,
      items,
      coordinates,
    };
  };

  const close = () => {
    data.value = getDefaultData();
  };

  return {
    data,
    open,
    close,
  };
});

function getDefaultData(): ContextMenuData {
  return {
    isOpen: false,
    items: [],
    coordinates: { x: 0, y: 0 },
  };
}
