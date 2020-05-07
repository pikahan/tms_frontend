<template>
    <div>
      <searchPane :search-data="searchData" />
      <nuxt-link to="/putInOperation/submit">
        <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交入库记录</a-button>
      </nuxt-link>
      <a-table :columns="columns" :dataSource="apparatusEntityData" :scroll="{ x: 1300 }">
        <a slot="action" slot-scope="text" href="javascript:;">查看详情</a>
      </a-table>
    </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除

  //TODO mock数据,之后替换
  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'name', key: 'name' },
    { title: '库位', dataIndex: 'location', key: 'location'},
    // { title: '图片', dataIndex: 'picture', key: 'picture' },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '100px',
      scopedSlots: { customRender: 'action' },
    },
  ];


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
    middleware: 'isAuth',
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
    }
  }
</script>

<style scoped>

</style>
