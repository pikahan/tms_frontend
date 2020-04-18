<template>
    <div class="list_panel_wrapper">
      <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'listPanelWrapper'
  }
</script>

<style scoped lang="scss">
.list_panel_wrapper {
  display: flex;
  justify-content: space-between;
}
</style>
