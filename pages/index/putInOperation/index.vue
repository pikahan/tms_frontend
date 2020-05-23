<template>
    <div>
      <searchPane :search-data="searchData" />
      <a-table :columns="columns" :dataSource="processedIoRecordData" :scroll="{ x: 1300 }">
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
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '名字', dataIndex: 'apparatusDefName', key: 'apparatusDefName' },
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

    }
  }
</script>

<style scoped>

</style>
