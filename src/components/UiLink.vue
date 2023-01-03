<template>
  <a class="ui-link" href="#"><slot /></a>
</template>

<style lang="scss" scoped>
.ui-link {
  color: #3a8ef9;
  text-decoration: none;

  &:hover {
    color: #000;
  }
}
</style>
