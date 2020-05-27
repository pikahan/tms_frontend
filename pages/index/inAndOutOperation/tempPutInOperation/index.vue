<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="apparatusEntity/fetchData" />
    <nuxt-link :to="`putInOperation/add?id=[${selectedRowKeys}]`" v-if="permissionMap.ClampingApparatusInformationMutation" >
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }" :disabled="selectedRowKeys.length === 0">+ 入库</a-button>
    </nuxt-link>
    <a-table
      :columns="columns"
      :dataSource="apparatusEntityData"
      rowKey="id"
      @change="handleTableChange"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
        <span slot="action" slot-scope="text, data" >
          <nuxt-link :to="`/apparatusData/${data.id}`">
            查看详情
          </nuxt-link>
          <nuxt-link :to="`/apparatusData/update/${data.id}`"  v-if="permissionMap.ClampingApparatusInformationMutation">
            修改
          </nuxt-link>
        </span>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code', sorter: true},
    { title: '名字', dataIndex: 'name', key: 'name'},
    { title: '库位', dataIndex: 'location', key: 'location', sorter: true},
    { title: '状态', dataIndex: 'status', key: 'status', sorter: true },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '130px',
      scopedSlots: { customRender: 'action' },
    },
  ];

  const searchData = [
    {
      label: '物品编号',
      name: 'code',
      type: 'input',
      placeholder: '请输入夹具编号',
      option: {}
    },
    {
      label: '采购单号',
      name: 'billNo',
      type: 'input',
      placeholder: '请输入夹具采购单号',
      option: {}
    },
    {
      label: '物品状态',
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
        selectedRowKeys: [],
        selectedRowRows: [],
      }
    },
    async fetch() {
      await this.$store.dispatch(`apparatusEntity/fetchData`, { variables: { status: '线上' } })
    },
    computed: {
      ...mapGetters('apparatusEntity', {
        apparatusEntityData: 'processedApparatusEntityData'
      }),
      ...mapGetters('user', ['permissionMap'])
    },
    methods: {
      handleSearchData(data) {
        this.$store.dispatch('apparatusEntity/fetchData', { variables: data })
      },
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('apparatusEntity/fetchData', { variables: {
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
      onSelectChange(selectedRowKeys, selectedRowRows) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRowRows = selectedRowRows
      },
    }
  }
</script>

<style scoped>

</style>
