<template>
    <div>
      <searchPane :search-data="searchData" storeTarget="ioRecord/fetchData" />
      <nuxt-link to="submit">
        <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交出库记录</a-button>
      </nuxt-link>
      <a-table :columns="columns" :dataSource="processedIoRecordData" :scroll="{ x: 1300 }" rowKey='id' @change="handleTableChange">
      </a-table>
    </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'




  //TODO mock数据,之后替换
  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'apparatusDefName', key: 'apparatusDefName' },
    { title: '出库经手人', dataIndex: 'outHandlingPerson', key: 'outHandlingPerson', sorter: true },
    { title: '出库记录人', dataIndex: 'outRecordPerson', key: 'outRecordPerson', sorter: true },
    { title: '领用地点', dataIndex: 'position', key: 'position', sorter: true},
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ];

  const searchData = [
    {
      label: '出库经手人',
      name: 'outHandlingPerson',
      type: 'input',
      placeholder: '请输入出库经手人',
      option: {}
    },
    {
      label: '出库时间',
      name: 'outTimeFrom\toutTimeTo',
      type: 'range',
      placeholder: ['起始时间', '结束时间'],
      option: {}
    },
    {
      label: '处理人',
      name: 'acceptor',
      type: 'input',
      placeholder: '请输入处理人',
      option: {}
    },
    {
      label: '处理时间',
      name: 'acceptorTimeFrom\tacceptorTimeTo',
      type: 'range',
      placeholder: ['起始时间', '结束时间'],
      option: {}
    },
  ]

  // selectOption value content

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
    async fetch() {
      await this.$store.dispatch(`tempIoRecord/fetchData`)
    },
    computed: {
      ...mapGetters('tempIoRecord', ['processedIoRecordData']),
      ...mapGetters('user', ['permissionMap']),

    },
    methods: {
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('tempIoRecord/fetchData', {variables: {
            pageSize: pagination.pageSize,
            pageIndex: pagination.current,
            orderBy: sorter.field,
            orderByType: sorter.order === 'ascend' ? 'asc' : 'desc',
            ...filters,
          }})

        console.log({
          pageSize: pagination.pageSize,
          pageIndex: pagination.current,
          orderBy: sorter.field,
          orderByType: sorter.order === 'ascend' ? 'asc' : 'desc',
          ...filters,
        });

      },
    }
  }
</script>

<style scoped>

</style>
