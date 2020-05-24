<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="apparatusDef/fetchData" />
    <nuxt-link to="/apparatusDef/submit">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 创建</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1300 }" rowKey="id">
      <a slot="action" slot-scope="text, data" href="javascript:;">
        <div>
          查看详情
        </div>
      </a>
      <div slot="remark" slot-scope="text">
        {{ text ? text : '-----' }}
      </div>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters, mapState } from 'vuex'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { arrayBufferToBase64 } from '@/util/helper'

  const columns = [
    { title: '物品代码', dataIndex: 'code', key: 'code'},
    { title: '物品名称', dataIndex: 'name', key: 'name'},
    { title: '模具', dataIndex: 'models', key: 'models' },
    { title: '料号', dataIndex: 'partNos', key: 'partNos' },
    { title: '产线配数', dataIndex: 'uPL', key: 'uPL'},
    { title: '用途', dataIndex: 'usedFor', key: 'usedFor' },
    { title: '点检周期', dataIndex: 'pMPeriod', key: 'pMPeriod' },
    { title: '责任人', dataIndex: 'owner', key: 'owner' },
    { title: '用途', dataIndex: 'recBy', key: 'recBy' },
    { title: '备注', dataIndex: 'remark', key: 'remark', scopedSlots: { customRender: 'remark' } },
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
      ...mapState('apparatusDef', ['data']),
      ...mapGetters('user', ['permissionMap']),
      permission() {
        // TODO 划分好权限之后更改
        return {
          approvalPermission: true
        }
      }
    },
    async fetch() {
      await this.$store.dispatch(`apparatusDef/fetchData`)
    },
    methods: {
      arrayBufferToBase64
    },

  }
</script>

<style scoped>

</style>
