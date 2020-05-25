<template>
    <div>
      <searchPane :search-data="searchData" storeTarget="ioRecord/fetchData" />
      <a-table :columns="columns" :dataSource="processedIoRecordData" :scroll="{ x: 1300 }" @change="handleTableChange">
        <span slot="action" slot-scope="text, data" >
          <nuxt-link :to="`/putInOperation/update/${data.id}`" v-if="data.status === '线上'">
            入库
          </nuxt-link>
          <!--TODO 之后更改to的地址-->
          <nuxt-link to="/putInOperation/submit" v-else>
            查看详情
          </nuxt-link>
        </span>
        <!--<nuxt-link :to="">-->
        <!--</nuxt-link>-->
      </a-table>
    </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'apparatusDefName', key: 'apparatusDefName' },
    { title: '入库时间', dataIndex: 'inTime', key: 'inTime', sorter: true },
    { title: '入库经手人', dataIndex: 'inHandlingPerson', key: 'inHandlingPerson', sorter: true },
    { title: '入库记录人', dataIndex: 'inRecordPerson', key: 'inRecordPerson', sorter: true },
    { title: '库位', dataIndex: 'location', key: 'location', sorter: true},
    { title: '状态', dataIndex: 'status', key: 'status' },
    // { title: '图片', dataIndex: 'picture', key: 'picture' },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '100px',
      scopedSlots: { customRender: 'action' },
    },
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
    }
  ]

  export default {
    name: 'putInOper',
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
      // const fetchDataFor = fetchDataIn(this)
      // console.log('dasfasdf2222')
      await this.$store.dispatch(`ioRecord/fetchData`)
      // await fetchDataFor('apparatusEntity')
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
