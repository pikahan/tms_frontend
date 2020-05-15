<template>
  <div>
    <searchPane :search-data="searchData"  :handleData="handleSearchData"  />
    <a-table :columns="columns" :dataSource="apparatusEntityData" :scroll="{ x: 1300 }" rowKey="id">
        <span slot="action" slot-scope="text, data" >
          <nuxt-link to="/apparatusData/1">
            查看详情
          </nuxt-link>
        </span>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'name', key: 'name' },
    { title: '库位', dataIndex: 'location', key: 'location'},
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
       type: 'input',
       placeholder: '请输入夹具状态',
       option: {}
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
      // const fetchDataFor = fetchDataIn(this)
      // console.log('dasfasdf2222')
      await this.$store.dispatch(`apparatusEntity/fetchData`)
      // await fetchDataFor('apparatusEntity')
    },
    computed: {
      ...mapGetters('apparatusEntity', {
        apparatusEntityData: 'processedApparatusEntityData'
      })
    },
    methods: {
      handleSearchData(data) {
        this.$store.dispatch('apparatusEntity/fetchData', {variables: data})
      }
    }
  }
</script>

<style scoped>

</style>
