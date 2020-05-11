<template>
  <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1300 }">
    <a slot="action" slot-scope="text" href="javascript:;">action</a>
  </a-table>
</template>
<script>
  export default {
    props: {
      columns: {
        type: Array,
        default: []
      },
      data: {
        type: Array,
        default: []
      }
    }
  };
</script>
