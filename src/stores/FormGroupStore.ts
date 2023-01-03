import { defineStore } from "pinia";
import { reactive } from "vue";

type GroupId = string;
interface Child {
  type: "group" | "control";
  id: string;
}
interface Group {
  [childName: string]: Child;
}
type Groups = Record<GroupId, Group>;

export const FormGroupStoreDefinition = defineStore("FormGroupStore", () => {
  const groups = reactive<Groups>({});

  return {
    groups,
  };
});
