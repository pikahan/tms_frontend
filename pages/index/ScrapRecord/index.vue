<template>
  <div>
    <searchPane :search-data="searchData" />
    <nuxt-link to="/scrapRecord/submit">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交申请</a-button>
    </nuxt-link>
    <a-table :columns="columns" :dataSource="processedScrapRecordData" :scroll="{ x: 1300 }">
      <div slot="action" slot-scope="text, data" >
        <a v-if="permission.BuyoffApplicationMiddleProcess && data.status === '申请中'">
          <a-popconfirm placement="topRight" ok-text="同意" cancel-text="拒绝" @confirm="processingApplication(data.id, 'firstOk')" @cancel="processingApplication(data.id, 'firstReject')">
            <template slot="title">
              <p>是否同意申请?</p>
            </template>
            审批
          </a-popconfirm>
        </a>
        <a v-else-if="permission.BuyoffApplicationFinalProcess && data.status === '初审通过'">
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
        {{ text.slice(0, 4) === '0001' ? text : '-----' }}
      </div>
      <div slot="finalProcessTime" slot-scope="text">
        {{ text.slice(0, 4) === '0001' ? text : '-----' }}
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
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { arrayBufferToBase64 } from '@/util/helper'

  const columns = [
    { title: '物品代码', dataIndex: 'code', key: 'code'},
    { title: '申请时间', dataIndex: 'applicationTime', key: 'applicationTime' },
    { title: '申请人', dataIndex: 'proposer', key: 'proposer' },
    { title: '初审人', dataIndex: 'middleProcessor', key: 'middleProcessor', scopedSlots: { customRender: 'middleProcessor' }},
    { title: '初审时间', dataIndex: 'middleProcessTime', key: 'middleProcessTime', scopedSlots: { customRender: 'middleProcessTime' }},
    { title: '终审时间', dataIndex: 'finalProcessTime', key: 'finalProcessTime', scopedSlots: { customRender: 'finalProcessTime' }},
    { title: '终审人', dataIndex: 'finalProcessor', key: 'finalProcessor', scopedSlots: { customRender: 'finalProcessor' }},
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '报废原因', dataIndex: 'reason', key: 'reason' },
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
    computed: {
      ...mapGetters('scrapRecord', ['processedScrapRecordData']),
      ...mapState('user', ['userInfo']),
      permission() {
        // TODO 划分好权限之后更改
        const ret = {}
        this.userInfo.permissions.forEach(permission => {
          ret[permission.name] = permission.value
        })
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
        let timeKey = 'middleProcessTime'
        let proposerKey = 'middleProcessor'

        switch (type) {
          case 'firstOk':
            status = '初审通过'
            break
          case 'firstReject':
            status = '初审拒绝'
            break
          case 'secondOk':
            status = '终审通过'
            timeKey = 'finalProcessTime'
            proposerKey = 'finalProcessor'
            break
          case 'secondReject':
            status = '终审拒绝'
            timeKey = 'finalProcessTime'
            proposerKey = 'finalProcessor'
            break
          default:
            console.log(type)
        }
        this.$store.dispatch('scrapRecord/updateData', { id, status, [timeKey]: (new Date).toISOString(), [proposerKey]: this.$store.state.user.userInfo.employeeId })
      },
    }
  }
</script>

<style scoped>

</style>
