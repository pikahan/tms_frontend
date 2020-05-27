<template>
    <div>
      <searchPane :search-data="searchData" storeTarget="ioRecord/fetchData" />
      <a-table :columns="columns" :dataSource="processedIoRecordData" :scroll="{ x: 1300 }" @change="handleTableChange">
        <div slot="inTime" slot-scope="text">
          {{ text.slice(0, 4) !== '0001' ? (new Date(Date.parse(text))).toLocaleString() : '-----' }}
        </div>
      </a-table>
    </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'apparatusDefName', key: 'apparatusDefName' },
    { title: '入库时间', dataIndex: 'inTime', key: 'inTime', sorter: true, scopedSlots: { customRender: 'inTime' } },
    { title: '入库经手人', dataIndex: 'inHandlingPerson', key: 'inHandlingPerson', sorter: true },
    { title: '入库记录人', dataIndex: 'inRecordPerson', key: 'inRecordPerson', sorter: true },
    { title: '出库时间', dataIndex: 'outTime', key: 'outTime', sorter: true, scopedSlots: { customRender: 'outTime' } },
    { title: '出库经手人', dataIndex: 'outHandlingPerson', key: 'outHandlingPerson', sorter: true },
    { title: '出库记录人', dataIndex: 'outRecordPerson', key: 'outRecordPerson', sorter: true },
    { title: '库位', dataIndex: 'location', key: 'location', sorter: true},
    { title: '状态', dataIndex: 'status', key: 'status' },
    // { title: '图片', dataIndex: 'picture', key: 'picture' },
  ];

  const searchData = [
    {
      label: '入库经手人',
      name: 'inHandlingPerson',
      type: 'input',
      placeholder: '请输入入库经手人',
      option: {}
    },
    {
      label: '入库时间',
      name: 'inTimeFrom\tinTimeTo',
      type: 'range',
      placeholder: ['起始时间', '结束时间'],
      option: {}
    },
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
      label: '夹具状态',
      name: 'status',
      type: 'select',
      placeholder: '请输入夹具状态',
      option: {},
      selectOption: [{content: '在库', value: '在库'}, {content: '线上', value: '线上'}, {content: '临时领出', value: '临时领出'}, {content: '报废', value: '报废'}, {content: '维修', value: '维修'}, ]
    }
  ]

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
      await this.$store.dispatch(`ioRecord/fetchData`)
    },
    computed: {
      ...mapGetters('ioRecord', ['processedIoRecordData']),
      ...mapGetters('user', ['permissionMap']),

    },
    methods: {
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('ioRecord/fetchData', {variables: {
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
