<template>
  <div>
    <searchPane :search-data="searchData" />
    <nuxt-link to="/userManagement/add">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 新增</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="processedUserData">
      <nuxt-link slot="operation" slot-scope="operation" :to="`/usermanagement/modify/${operation.index}`"><a  href="javascript:;">编辑</a></nuxt-link>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { mapGetters } from 'vuex'
  //TODO mock数据,之后替换
  const columns = [
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId'},
    { title: 'workcell', dataIndex: 'workcell', key: 'workcell'},
    { title: '用户级别', dataIndex: 'userType', key: 'userType' },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '100px',
      scopedSlots: { customRender: 'operation' },
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
    computed: mapGetters('user', ['processedUserData']),
    methods: {
    },
    async fetch () {
      await this.$store.dispatch('user/fetchData')
    }
  }
</script>

<style scoped>

</style>
