<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="apparatusEntity/fetchData" />
    <nuxt-link to="/apparatusData/add" v-if="permissionMap.ClampingApparatusInformationMutation">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 添加工夹具</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="apparatusEntityData"  rowKey="id" @change="handleTableChange">
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
      }
    },
    async fetch() {
      await this.$store.dispatch(`apparatusEntity/fetchData`)
    },
    computed: {
      ...mapGetters('apparatusEntity', {
        apparatusEntityData: 'processedApparatusEntityData'
      }),
      ...mapGetters('user', ['permissionMap'])
    },
    methods: {
      handleSearchData(data) {
        this.$store.dispatch('apparatusEntity/fetchData', {variables: data})
      },
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('apparatusEntity/fetchData', {variables: {
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
