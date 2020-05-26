<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="scrapRecord/fetchData" />
    <nuxt-link to="/scrapRecord/submit">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交申请</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="processedScrapRecordData" :scroll="{ x: 1300 }" @change="handleTableChange">
      <div slot="action" slot-scope="text, data" >
        <a v-if="permission.DisposalApplicationMiddleProcess && data.status === '申请中'">
          <a-popconfirm placement="topRight" ok-text="同意" cancel-text="拒绝" @confirm="processingApplication(data.id, 'firstOk')" @cancel="processingApplication(data.id, 'firstReject')">
            <template slot="title">
              <p>是否同意申请?</p>
            </template>
            审批
          </a-popconfirm>
        </a>
        <a v-else-if="permission.DisposalApplicationFinalProcess && data.status === '初审通过'">
          <a-popconfirm placement="topRight" ok-text="同意" cancel-text="拒绝" @confirm="processingApplication(data.id, 'secondOk')" @cancel="processingApplication(data.id, 'secondReject')">
            <template slot="title">
              <p>是否同意申请?</p>
            </template>
            审批
          </a-popconfirm>
        </a>
        <div v-else>
          -----
        </div>
      </div>
      <div slot="middleProcessor" slot-scope="text">
        {{ text ? text : '-----' }}
      </div>
      <div slot="middleProcessTime" slot-scope="text">
        {{ text.slice(0, 4) !== '0001' ? (new Date(Date.parse(text))).toLocaleString() : '-----' }}
      </div>
      <div slot="finalProcessTime" slot-scope="text">
        {{ text.slice(0, 4) !== '0001' ? (new Date(Date.parse(text))).toLocaleString() : '-----' }}
      </div>
      <div slot="applicationTime" slot-scope="text">
        {{ text.slice(0, 4) !== '0001' ? (new Date(Date.parse(text))).toLocaleString() : '-----' }}
      </div>
      <div slot="finalProcessor" slot-scope="text">
        {{ text ? text : '-----' }}
      </div>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters, mapState } from 'vuex'
  import permissions from '../../../util/permissions'
  import { arrayBufferToBase64 } from '@/util/helper'
  import GQLemployee from '@/apollo/queries/allScrapRecords.gql'

  const columns = [
    { title: '物品代码', dataIndex: 'code', key: 'code'},
    { title: '申请时间', dataIndex: 'applicationTime', key: 'applicationTime', scopedSlots: { customRender: 'applicationTime' }},
    { title: '申请人', dataIndex: 'proposer', key: 'proposer' },
    { title: '初审人', dataIndex: 'middleProcessor', key: 'middleProcessor', scopedSlots: { customRender: 'middleProcessor' }},
    { title: '初审时间', dataIndex: 'middleProcessTime', key: 'middleProcessTime', scopedSlots: { customRender: 'middleProcessTime' }},
    { title: '终审时间', dataIndex: 'finalProcessTime', key: 'finalProcessTime', scopedSlots: { customRender: 'finalProcessTime' }},
    { title: '终审人', dataIndex: 'finalProcessor', key: 'finalProcessor', scopedSlots: { customRender: 'finalProcessor' }},
    { title: '状态', dataIndex: 'status', key: 'status'},
    { title: '报废原因', dataIndex: 'reason', key: 'reason' },
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
      label: '申请人',
      name: 'proposer',
      type: 'selectInput',
      placeholder: '请输入申请人',
      option: {},
      handleSearch: async function (value) {
        let { data } = await this.$apolloProvider.defaultClient.query({
          query: GQLemployee,
          variables: { proposer: value}
        })
        return {result: data.scrapRecords.payload.map(item => item.proposer)}
      }
    },
    {
      label: '申请时间',
      name: 'applicationTimeFrom\tapplicationTimeTo',
      type: 'range',
      placeholder: ['起始时间', '结束时间'],
      option: {}
    },
    {
      label: '处理人',
      name: 'acceptor',
      type: 'input',
      placeholder: '请输入处理人',
      option: {}
    },
    {
      label: '处理时间',
      name: 'acceptorTimeFrom\tacceptorTimeTo',
      type: 'range',
      placeholder: ['起始时间', '结束时间'],
      option: {}
    },
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
    computed: {
      ...mapGetters('scrapRecord', ['processedScrapRecordData']),
      ...mapGetters('user', ['permissionMap']),

      ...mapState('user', ['userInfo']),
      permission() {
        // TODO 划分好权限之后更改
        const ret = {}
        this.$store.state.user.userInfo.permissions.forEach(permission => {
          ret[permission.name] = permission.value
        })
        console.log(ret)
        return ret
      },
    },
    async fetch() {
      await this.$store.dispatch(`scrapRecord/fetchData`)
    },
    methods: {
      arrayBufferToBase64,
      processingApplication(id, type) {
        let status = '初审通过'
        let time = (new Date).toISOString()
        let person = this.$store.state.user.userInfo.employeeId
        let map = {
          middleProcessTime: time,
          middleProcessor: person
        }

        switch (type) {
          case 'firstOk':
            status = '初审通过'
            if (this.permission.DisposalApplicationFinalProcess) {
              status = '终审通过'
              Object.assign(map, {
                finalProcessTime: time,
                finalProcessor: person
              })
            }
            break
          case 'firstReject':
            status = '初审拒绝'
            break
          case 'secondOk':
            status = '终审通过'
            map = {
              finalProcessTime: time,
              finalProcessor: person
            }
            break
          case 'secondReject':
            status = '终审拒绝'
            map = {
              finalProcessTime: time,
              finalProcessor: person
            }
            break
          default:
            console.log(type)
        }
        this.$store.dispatch('scrapRecord/updateData', { id, status, ...map })
          .then(() => {
            this.$store.dispatch(`scrapRecord/fetchData`)
          })
      },
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('scrapRecord/fetchData', {variables: {
            pageSize: pagination.pageSize,
            pageIndex: pagination.current,
            orderBy: sorter.field,
            orderByType: sorter.order === 'ascend' ? 'asc' : 'desc',
            ...filters,
          }})

      },
    }
  }
</script>

<style scoped>

</style>
