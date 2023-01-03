<template>
  <slot :value="value"></slot>
</template>

<script lang="ts" setup>
defineProps<{
  value: any;
}>();
</script>
