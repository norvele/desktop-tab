<script lang="ts" setup>
import type { Coordinates } from "@/types";
import type { Ref } from "vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import union from "lodash/union";

type SelectableId = string;
interface Point {
  x: number;
  y: number;
}
interface GroupSelection {
  anchorId: SelectableId;
  lastSelectedIds: SelectableId[];
}

const props = withDefaults(
  defineProps<{
    selectedIds: SelectableId[];
    selectableIdAttrName: string;
    selectableClassName: string;
    color?: "light" | "dark";
  }>(),
  {
    color: "light",
  }
);

const emit = defineEmits<{
  (event: "about-to-select", payload: SelectableId[]): void;
  (event: "select", payload: SelectableId[]): void;
}>();

const rootRef = ref() as Ref<HTMLElement>;
const anchorPoint = ref<Coordinates | undefined>();
const endPoint = ref<Coordinates | undefined>();
const isSelectingByArea = ref(false);
const groupSelection = ref<GroupSelection>({
  anchorId: "",
  lastSelectedIds: [],
});

const onMouseDown = (event: MouseEvent) => {
  if (event.button !== 0) {
    return;
  }
  anchorPoint.value = { x: event.clientX, y: event.clientY };
  document.addEventListener("mousemove", onMouseMove);
};

const onMouseMove = (event: MouseEvent) => {
  if (!anchorPoint.value) {
    return;
  }
  const x1 = anchorPoint.value.x;
  const y1 = anchorPoint.value.y;
  const x2 = event.clientX;
  const y2 = event.clientY;
  const length = Math.hypot(x2 - x1, y2 - y1);
  if (length < 10) {
    return;
  }
  isSelectingByArea.value = true;
  endPoint.value = { x: x2, y: y2 };
  emitAboutToSelect();
};

const onMouseUp = (event: MouseEvent) => {
  if (event.button !== 0) {
    return;
  }
  document.removeEventListener("mousemove", onMouseMove);
  if (!isSelectingByArea.value) {
    return;
  }
  const ids = getIdsInArea(anchorPoint.value, endPoint.value);
  emitSelect(ids);
  emit("about-to-select", []);
  setTimeout(() => {
    resetAreaSelectionState();
  }, 10);
};

const onDragStart = () => {
  resetAreaSelectionState();
  document.removeEventListener("mousemove", onMouseMove);
};

const resetAreaSelectionState = () => {
  anchorPoint.value = undefined;
  endPoint.value = undefined;
  isSelectingByArea.value = false;
};

const emitAboutToSelect = () => {
  const ids = getIdsInArea(anchorPoint.value, endPoint.value);
  emit("about-to-select", ids);
};

const emitSelect = (ids: SelectableId[]) => {
  if (ids.join(",") === props.selectedIds.join(",")) {
    return;
  }
  emit("select", ids);
};

const getIdsInArea = (point1?: Point, point2?: Point): SelectableId[] => {
  if (!point1 || !point2) {
    return [];
  }

  const minX = Math.min(point1.x, point2.x);
  const maxX = Math.max(point1.x, point2.x);
  const minY = Math.min(point1.y, point2.y);
  const maxY = Math.max(point1.y, point2.y);

  const elements = [
    // @ts-ignore
    ...rootRef.value.querySelectorAll(`.${props.selectableClassName}`),
  ];

  const ids: SelectableId[] = [];
  elements.forEach((element) => {
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      ids.push(element.getAttribute(props.selectableIdAttrName));
    }
  });
  return ids;
};

const leftTopPoint = computed(() => {
  if (!anchorPoint.value || !endPoint.value) {
    return;
  }
  return {
    x: Math.min(anchorPoint.value.x, endPoint.value.x),
    y: Math.min(anchorPoint.value.y, endPoint.value.y),
  };
});

const rightBottomPoint = computed(() => {
  if (!anchorPoint.value || !endPoint.value) {
    return;
  }
  return {
    x: Math.max(anchorPoint.value.x, endPoint.value.x),
    y: Math.max(anchorPoint.value.y, endPoint.value.y),
  };
});

const onClick = (event: MouseEvent) => {
  // Filter events
  const hasCtrl = event.metaKey || event.ctrlKey;
  const hasShift = event.shiftKey;
  if (!hasCtrl && !hasShift) {
    groupSelection.value = {
      anchorId: "",
      lastSelectedIds: [],
    };
    if (!isSelectingByArea.value) {
      resetAreaSelectionState();
      emitSelect([]);
    }
    return;
  }
  event.preventDefault();

  // Filter targets
  const targetElement = (event.target as HTMLElement).closest<HTMLElement>(
    `.${props.selectableClassName}`
  );
  if (!targetElement) {
    resetAreaSelectionState();
    emitSelect([]);
    return;
  }
  const targetId = targetElement.getAttribute(props.selectableIdAttrName);
  if (!targetId) {
    throw new Error("A selectable target don't have ID");
  }

  // Logic
  if (hasCtrl) {
    selectOneByClick(targetId);
    return;
  }
  if (hasShift) {
    if (!groupSelection.value.anchorId) {
      selectOneByClick(targetId);
      return;
    }
    const anchorElement = rootRef.value.querySelector<HTMLElement>(
      `[${props.selectableIdAttrName}="${groupSelection.value.anchorId}"]`
    );
    if (!anchorElement) {
      throw new Error("Anchor element not found");
    }
    const idsBetween = getIdsInArea(
      getElementCenterPoint(anchorElement),
      getElementCenterPoint(targetElement)
    );
    let selectedIds = [...props.selectedIds];
    // Deselect old selected items
    selectedIds = selectedIds.filter(
      (id) => !groupSelection.value.lastSelectedIds.includes(id)
    );
    // Select new items
    selectedIds = union(selectedIds, idsBetween);
    groupSelection.value.lastSelectedIds = idsBetween;
    emit("select", selectedIds);
  }
};

const selectOneByClick = (targetId: SelectableId) => {
  props.selectedIds.includes(targetId)
    ? emit(
        "select",
        props.selectedIds.filter((id) => id !== targetId)
      )
    : emit("select", [...props.selectedIds, targetId]);
  groupSelection.value.anchorId = targetId;
};

const getElementCenterPoint = (element: HTMLElement) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};

onMounted(() => {
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("dragstart", onDragStart);
  document.addEventListener("click", onClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onMouseDown);
  document.removeEventListener("mouseup", onMouseUp);
  document.removeEventListener("dragstart", onDragStart);
  document.removeEventListener("click", onClick);
});
</script>

<template>
  <div ref="rootRef">
    <slot />
    <div
      v-if="leftTopPoint && rightBottomPoint"
      class="selection"
      :class="`_color-${color}`"
      :style="{
        '--selection-x1': `${leftTopPoint?.x}px`,
        '--selection-y1': `${leftTopPoint?.y}px`,
        '--selection-x2': `${rightBottomPoint?.x}px`,
        '--selection-y2': `${rightBottomPoint?.y}px`,
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.selection {
  position: fixed;
  background-color: rgba(#fff, 0.2);
  border: 1px solid rgba(#fff, 0.4);
  pointer-events: none;
  z-index: 1000;
  box-sizing: border-box;
  top: var(--selection-y1);
  left: var(--selection-x1);
  width: calc(var(--selection-x2) - var(--selection-x1));
  height: calc(var(--selection-y2) - var(--selection-y1));

  &._color-dark {
    background-color: rgba(#000, 0.2);
    border-color: rgba(#000, 0.4);
  }
}
</style>
