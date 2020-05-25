<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="apparatusEntity/fetchData" />
    <nuxt-link to="/purchase/submit">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交申请</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="processedApparatusEntityData" :scroll="{ x: 1300 }" rowKey="id" @change="handleTableChange">
      <!--<a slot="action" slot-scope="text, data" href="javascript:;">{{ data.status === '' }}</a>-->
      <div slot="recOn" slot-scope="text">
        {{ text.slice(0, 4) !== '0001' ? (new Date(Date.parse(text))).toLocaleString() : '-----' }}
      </div>
        <img class="thumbnail" slot="picture" slot-scope="picture"  :src="`data:image/png;base64,${picture.length ? arrayBufferToBase64(picture):''}`" alt="img">
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters, mapState } from 'vuex'
  import permissions from '../../../util/permissions'
  import { arrayBufferToBase64 } from '@/util/helper'


  const searchData = [
    {
      label: '采购单据号',
      name: 'billNo',
      type: 'input',
      placeholder: '请输入采购单据号',
      option: {}
    },
    {
      label: '位置',
      name: 'location',
      type: 'input',
      placeholder: '请输入位置',
      option: {}
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      placeholder: '请选择状态',
      option: {},
      selectOption: [{content: '在库', value: '在库'}, {content: '线上', value: '线上'}, {content: '临时领出', value: '临时领出'}, {content: '维修', value: '维修'}, {content: '报废', value: '报废'}]
    }
  ]

  const columns = [
    { title: '采购单据号', dataIndex: 'billNo', key: 'billNo', sorter: true},
    { title: '编号', dataIndex: 'code', key: 'code'},
    { title: '责任人', dataIndex: 'owner', key: 'owner' },
    { title: '大类', dataIndex: 'familyName', key: 'familyName' },
    { title: '模组', dataIndex: 'models', key: 'models' },
    { title: '料号', dataIndex: 'partNos', key: 'partNos' },
    { title: '录入日期', dataIndex: 'recOn', key: 'recOn' , sorter: true, scopedSlots: { customRender: 'recOn' }},
    { title: '图片', key: 'picture', dataIndex: 'picture', scopedSlots: { customRender: 'picture' } },
    { title: '状态', dataIndex: 'status', key: 'status' , sorter: true},
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
      arrayBufferToBase64,
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
    },
    computed: {
      ...mapGetters('apparatusEntity', ['processedApparatusEntityData']),
      ...mapState('user', ['userInfo']),
      permission() {
        // TODO 划分好权限之后更改
        return {
          approvalPermission: true
        }
      }
    },
    async fetch() {
      await this.$store.dispatch(`apparatusEntity/fetchData`)
    },

  }
</script>

<style scoped>

</style>
