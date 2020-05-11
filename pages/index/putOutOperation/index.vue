<template>
    <div>
      <searchPane :search-data="searchData" />
      <nuxt-link to="/putOutOperation/submit">
        <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交出库记录</a-button>
      </nuxt-link>
      <a-table :columns="columns" :dataSource="apparatusEntityData" :scroll="{ x: 1300 }">
        <a slot="action" slot-scope="text" href="javascript:;">action</a>
      </a-table>    </div>
</template>

<script>
  import searchPane from '../../../components/searchPane'
  import { searchData } from '../../../util/testData' //TODO 接口完成之后删除
  import { mapGetters } from 'vuex'

  //TODO mock数据,之后替换
  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'name', key: 'name' },
    { title: '库位', dataIndex: 'location', key: 'location'},
    {
      title: '操作',
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
    async fetch() {
      await this.$store.dispatch(`apparatusEntity/fetchData`)
    },
    computed: {
      ...mapGetters('apparatusEntity', {
        apparatusEntityData: 'processedApparatusEntityData'
      })
    }
  }
</script>

<style scoped>

</style>
