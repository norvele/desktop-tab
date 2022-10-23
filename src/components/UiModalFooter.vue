<template>
  <div class="ui-modal-footer">
    <div class="ui-modal-footer__start container" v-if="$slots.start">
      <slot name="start" />
    </div>
    <div class="ui-modal-footer__end container" v-if="$slots.end">
      <slot name="end" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-modal-footer {
  display: flex;
  align-items: center;
  gap: 8px;

  &__start {
    flex-shrink: 0;
    flex-grow: 0;
  }

  &__end {
    margin-left: auto;
    flex-shrink: 0;
    flex-grow: 0;
  }
}

.container {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
