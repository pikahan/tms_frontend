<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="apparatusEntity/fetchData" />
    <nuxt-link :to="`tempPutInOperation/add?id=[${selectedRowKeys}]`" v-if="permissionMap.ClampingApparatusInformationMutation" >
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }" :disabled="selectedRowKeys.length === 0">+ 入库</a-button>
    </nuxt-link>
    <multiplyDownload
      storeName="user"
      :tipList="[
      { name: '工号', value: 'employeeId', type: '文本', explanation: '用户工号', required: true  },
      { name: '密码', value: 'password', type: '文本', explanation: '用户密码', required: true  },
      { name: 'workcell Id', value: 'workcellId', type: '数字', explanation: 'workcell的id号', required: true },
      { name: '用户类别Id', value: 'userTypeId', type: '数字', explanation: '用户类别的id号', required: true },
      { name: '邮箱', value: 'mail', type: '邮箱格式', explanation: '用户邮箱', required: true }]"
    />
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
        </span>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'
  import multiplyDownload from '@/components/multiplyDownload'
  import   modelGql from '@/apollo/queries/allModels.gql'
  import   familyGql from '@/apollo/queries/allFamilies.gql'
  import   partNoGql from '@/apollo/queries/allPartNos.gql'

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code', sorter: true},
    { title: '名字', dataIndex: 'name', key: 'name'},
    { title: '库位', dataIndex: 'location', key: 'location', sorter: true},
    { title: '大类', dataIndex: 'familyName', key: 'familyName'},
    { title: '模组', dataIndex: 'models', key: 'models' },
    { title: '料号', dataIndex: 'partNos', key: 'partNos' },
    { title: '状态', dataIndex: 'status', key: 'status', sorter: true },
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
      multiplyDownload
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
