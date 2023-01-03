import { defineStore } from "pinia";
import { reactive } from "vue";

type ControlId = string;
interface Control {
  value: unknown;
}
type Controls = Record<ControlId, Control>;

export const FormControlStoreDefinition = defineStore(
  "FormControlStore",
  () => {
    const controls = reactive<Controls>({});

    return {
      controls,
    };
  }
);
