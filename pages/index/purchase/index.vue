<template>
  <div>
    <searchPane :search-data="searchData" />
    <nuxt-link to="/purchase/submit">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交申请</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="processedApparatusEntityData" :scroll="{ x: 1300 }">
      <a slot="action" slot-scope="text" href="javascript:;">详细</a>
        <img class="thumbnail" slot="picture" slot-scope="picture"  :src="`data:image/png;base64,${picture.length ? arrayBufferToBase64(picture):''}`" alt="img">
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { arrayBufferToBase64 } from '@/util/helper'

  const columns = [
    { title: '采购单据号', dataIndex: 'billNo', key: 'billNo'},
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '责任人', dataIndex: 'owner', key: 'owner' },
    { title: '大类', dataIndex: 'familyName', key: 'familyName' },
    { title: '模组', dataIndex: 'models', key: 'models' },
    { title: '料号', dataIndex: 'partNos', key: 'partNos' },
    { title: '录入日期', dataIndex: 'recOn', key: 'recOn' },
    { title: '图片', key: 'picture', dataIndex: 'picture', scopedSlots: { customRender: 'picture' } },
    { title: '状态', dataIndex: 'status', key: 'status' },
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
    methods: {
       arrayBufferToBase64
    },
    computed: {
      ...mapGetters('apparatusEntity', ['processedApparatusEntityData'])
    },
    async fetch() {
      await this.$store.dispatch(`apparatusEntity/fetchData`)
    },
    middleware:
      'isAuth'
  }
</script>

<style scoped>

</style>
