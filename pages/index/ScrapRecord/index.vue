<template>
  <div>
    <searchPane :search-data="searchData" />
    <a-table :columns="columns" :dataSource="processedScrapRecordData" :scroll="{ x: 1300 }">
      <a slot="action" slot-scope="text" href="javascript:;">action</a>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { arrayBufferToBase64 } from '@/util/helper'

  const columns = [
    { title: '物品代码', dataIndex: 'code', key: 'code'},
    { title: '申请时间', dataIndex: 'applicationTime', key: 'applicationTime' },
    { title: '申请人', dataIndex: 'proposer', key: 'proposer' },
    { title: '修复结果时间', dataIndex: 'finishTime', key: 'finishTime' },
    { title: '初审人', dataIndex: 'middleProcessor', key: 'middleProcessor'},
    { title: '初审时间', dataIndex: 'middleProcessTime', key: 'middleProcessTime'},
    { title: '终审时间', dataIndex: 'finalProcessTime', key: 'finalProcessTime'},
    { title: '终审人', dataIndex: 'finalProcessor', key: 'finalProcessor'},
    { title: 'status', dataIndex: 'status', key: 'status' },
    { title: '报废原因', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: '100px',
      scopedSlots: { customRender: 'action' },
    },
  ];


  export default {
    components: {
      searchPane,
    },
    data() {
      return {
        searchData,
        columns,
      }
    },
    computed: {
      ...mapGetters('scrapRecord', ['processedScrapRecordData'])
    },
    async fetch() {
      await this.$store.dispatch(`scrapRecord/fetchData`)
    },
    methods: {
      arrayBufferToBase64
    }
  }
</script>

<style scoped>

</style>
