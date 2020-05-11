<template>
    <div class="list_panel_wrapper" :style="hasModifyBtn ? { paddingBottom: '50px' } : {}">
      <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'listPanelWrapper',
    props: {
      hasModifyBtn: {
        default: true
      }
    }
  }
</script>

<style scoped lang="scss">
.list_panel_wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}
</style>
