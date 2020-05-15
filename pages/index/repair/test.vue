<template>
  <div>
    <searchPane :search-data="searchData" />
    <a-table :columns="columns" :dataSource="processedRepairRecordData" :scroll="{ x: 1300 }">
      <a slot="action" slot-scope="text, data" href="javascript:;">
        <div v-if="permission.approvalPermission && data.status === '申请中'">
          审批
        </div>
        <div v-else>
          查看详情
        </div>
      </a>
      <img class="thumbnail" slot="picture" slot-scope="picture"  :src="`data:image/png;base64,${picture.length ? arrayBufferToBase64(picture):''}`" alt="img">
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
    { title: '修复结果时间', dataIndex: 'finishTime', key: 'finishTime' },
    { title: '图片', dataIndex: 'picture', key: 'picture',scopedSlots: { customRender: 'picture' }},
    { title: '故障描述', dataIndex: 'description', key: 'description' },
    { title: 'status', dataIndex: 'status', key: 'status' },
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
      ...mapGetters('repairRecord', ['processedRepairRecordData']),
      permission() {
        // TODO 划分好权限之后更改
        return {
          approvalPermission: true
        }
      }
    },
    async fetch() {
      await this.$store.dispatch(`repairRecord/fetchData`)
    },
    methods: {
      arrayBufferToBase64
    },

  }
</script>

<style scoped>

</style>
