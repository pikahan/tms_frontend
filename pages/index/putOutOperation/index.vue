<template>
    <div>
      <searchPane :search-data="searchData" />
      <nuxt-link to="/putOutOperation/submit">
        <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交出库记录</a-button>
      </nuxt-link>
      <a-table :columns="columns" :dataSource="processedIoRecordData" :scroll="{ x: 1300 }" rowKey='id'>
      </a-table>
    </div>
</template>

<script>
  import searchPane from '../../../components/searchPane'
  import { searchData } from '../../../util/testData' //TODO 接口完成之后删除
  import { mapGetters } from 'vuex'

  //TODO mock数据,之后替换
  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'apparatusDefName', key: 'apparatusDefName' },
    { title: '库位', dataIndex: 'location', key: 'location'},
    { title: '状态', dataIndex: 'status', key: 'status' },
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
      await this.$store.dispatch(`ioRecord/fetchData`)
    },
    computed: {
      ...mapGetters('ioRecord', ['processedIoRecordData'])
    }
  }
</script>

<style scoped>

</style>
