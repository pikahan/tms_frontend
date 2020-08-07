<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="apparatusDef/fetchData" />
    <nuxt-link to="/apparatusDef/submit">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 创建</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1300 }" rowKey="id" @change="handleTableChange">
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
  import { arrayBufferToBase64 } from '@/util/helper'

  const columns = [
    { title: '物品代码', dataIndex: 'code', key: 'code', sorter: true},
    { title: '物品名称', dataIndex: 'name', key: 'name'},
    { title: '模具', dataIndex: 'models', key: 'models' },
    { title: '料号', dataIndex: 'partNos', key: 'partNos' },
    { title: '产线配数', dataIndex: 'uPL', key: 'uPL', sorter: true},
    { title: '用途', dataIndex: 'usedFor', key: 'usedFor' },
    { title: '点检周期', dataIndex: 'pMPeriod', key: 'pMPeriod' , sorter: true},
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


  const searchData = [
    {
      label: '物品编号',
      name: 'code',
      type: 'input',
      placeholder: '请输入夹具编号',
      option: {},
    },
    {
      label: '物品名称',
      name: 'name',
      type: 'input',
      placeholder: '请输入物品名称',
      option: {}
    },
    {
      label: '大类',
      name: 'familyId',
      type: 'selectInput',
      placeholder: '请输入大类',
      option: {},
      handleSearch: async function (value) {
        let { data } = await this.$apolloProvider.defaultClient.query({
          query: familyGql,
          variables: { name: value }
        })
        console.log(data)

        return {
          result: data.families.payload.map(item => {
              return { value: item.id, text: item.name }
            }
          )}
      }
    },
    {
      label: '模组',
      name: 'modelNames',
      type: 'selectLabelInput',
      placeholder: '请选择模组',
      option: {},
      handleSearch: async function (value) {
        let { data } = await this.$apolloProvider.defaultClient.query({
          query: modelGql,
          variables: { name: value }
        })
        console.log(data)

        return {result: data.models.payload.map(item => item.name)}
      }
    },

    {
      label: '料号',
      name: 'partNoNames',
      type: 'selectLabelInput',
      placeholder: '请选择料号',
      option: {},
      handleSearch: async function (value) {
        let { data } = await this.$apolloProvider.defaultClient.query({
          query: partNoGql,
          variables: { name: value }
        })
        console.log(data)
        return {result: data.partNos.payload.map(item => item.name)}
      }
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
      arrayBufferToBase64,
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('apparatusDef/fetchData', {variables: {
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
    },

  }
</script>

<style scoped>

</style>
