<script setup lang="ts">
import { useModalStore } from "@/stores/useModalStore";
import { modalComponents, modalNames } from "@/common/modal";
import type { ModalNames } from "@/common/modal";

const modalStore = useModalStore();
const getModal = (name: ModalNames) => modalStore.modalState(name);
const closeModal = (name: ModalNames) => modalStore.closeModal(name);
</script>

<template>
  <div v-for="name in modalNames" :key="name">
    <component
      :is="modalComponents[name]"
      v-if="getModal(name).isOpen"
      @close="closeModal(name)"
      v-bind="getModal(name).props"
      v-on="getModal(name).callbacks"
    />
  </div>
</template>

<style lang="scss" scoped></style>
