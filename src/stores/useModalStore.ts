import { defineStore } from "pinia";
import type { ModalCallbacks, ModalNames, ModalProps } from "@/common/modal";
import { modalComponents } from "@/common/modal";

type ModalState = {
  isOpen: boolean;
  props: Record<string, any>;
  callbacks: Record<string, (payload: any) => void>;
};
type StoreModalStates = Record<ModalNames, ModalState>;

export const useModalStore = defineStore("modalStore", {
  state: () => {
    const modals = Object.keys(modalComponents).reduce((acc, modalName) => {
      acc[modalName as ModalNames] = getInitialModalState();
      return acc;
    }, {} as StoreModalStates);
    return {
      modals,
    };
  },
  getters: {
    modalState:
      (state) =>
      <T extends ModalNames>(name: T) =>
        state.modals[name],
    isModalOpen:
      (state) =>
      <T extends ModalNames>(name: T) =>
        state.modals[name].isOpen,
  },
  actions: {
    openModal<T extends ModalNames>(
      modalName: T,
      props: ModalProps<T>,
      callbacks: ModalCallbacks<T>
    ) {
      this.modals[modalName] = {
        isOpen: true,
        props,
        callbacks,
      };
    },
    closeModal(modalName: ModalNames) {
      this.modals[modalName] = getInitialModalState();
    },
  },
});

function getInitialModalState(): ModalState {
  return {
    isOpen: false,
    props: {},
    callbacks: {},
  };
}
