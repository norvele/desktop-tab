import type { ModalCallbacks, ModalNames, ModalProps } from "@/common/modal";
import { useModalStore } from "@/stores/useModalStore";
import { computed } from "vue";

export function useModal<T extends ModalNames>(name: T) {
  const modalStore = useModalStore();
  const openModal = (props: ModalProps<T>, callbacks: ModalCallbacks<T>) =>
    modalStore.openModal(name, props, callbacks);
  const closeModal = () => modalStore.closeModal(name);
  const isOpen = computed(() => modalStore.modalState(name).isOpen);

  return { openModal, closeModal, isOpen };
}
