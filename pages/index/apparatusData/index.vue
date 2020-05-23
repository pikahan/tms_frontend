<template>
  <div>
    <searchPane :search-data="searchData"  :handleData="handleSearchData"  />
    <nuxt-link to="/apparatusData/add" v-if="permissionMap.ClampingApparatusInformationMutation">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 创建</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="apparatusEntityData" :scroll="{ x: 1300 }" rowKey="id">
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
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'name', key: 'name' },
    { title: '库位', dataIndex: 'location', key: 'location'},
    { title: '状态', dataIndex: 'status', key: 'status' },
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
      }
    }
  }
</script>

<style scoped>

</style>
