<template>
  <div>
    <div>
      <h1>夹具基础数据</h1>
      <div style="margin-bottom: 20px">
        <a-descriptions
          bordered
          :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        >
          <a-descriptions-item label="名字">
            {{ apparatusEntityData.name }}
          </a-descriptions-item>
          <a-descriptions-item label="采购单号">
            {{ apparatusEntityData.billNo }}
          </a-descriptions-item>
          <a-descriptions-item label="序列号">
            {{ apparatusEntityData.seqId }}
          </a-descriptions-item>
          <a-descriptions-item label="类">
            {{ apparatusEntityData.familyName }}
          </a-descriptions-item>
          <a-descriptions-item label="模组">
            {{ apparatusEntityData.model }}
          </a-descriptions-item>
          <a-descriptions-item label="料号">
            {{ apparatusEntityData.partNo }}
          </a-descriptions-item>
          <a-descriptions-item label="库位">
            {{ apparatusEntityData.location }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            {{ apparatusEntityData.status }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
    <div>
      <h1>夹具数据统计</h1>
      <div class="chart_list">
        <div class="chart_item">
          <h2 class="chart_title">寿命预测</h2>
          <ve-histogram :data="histogramChartData" :settings="histogramChartSettings"></ve-histogram>
        </div>
        <div class="chart_item">
          <h2 class="chart_title">维修原因统计</h2>

          <ve-funnel :data="funnelChartData"></ve-funnel>
        </div>
      </div>
      <div class="chart_list">
        <div class="chart_item">
          <h2 class="chart_title">工作状况</h2>

          <ve-ring :data="ringChartData"></ve-ring>

        </div>
        <div class="chart_item">
          <h2 class="chart_title">健康度</h2>
          <ve-pie :data="pieChartData"></ve-pie>
        </div>
      </div>
    </div>
    <div>
      <h1>时间线</h1>
      <a-timeline style="margin: 30px 30px 0">
        <a-timeline-item :color="getColor(timelineItem.type)" v-for="timelineItem in timeline">
          <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" v-if="hasClockCircle(timelineItem.type)" />
          {{ `${formatTime(timelineItem.time)} ${ timelineItem.type } ${typeof timelineItem.proposer !== 'undefined' ? '操作人: ' + timelineItem.proposer : ''}` }}
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script>
  import gqlQuery from '@/apollo/queries/timeline.gql'
  import queryOne from '@/apollo/queries/apparatusEntity.gql'
  import objectDiff from '@/util/objectDiff'


  // TODO 定位
  export default {
    data () {
      this.histogramChartSettings = {
        metrics: ['预计最大寿命', '预计最小寿命', '平均寿命'],
        dimension: ['寿命']
      }
      return {
        timeline: [],
        histogramChartData: {
          columns: ['寿命', '预计最大寿命', '预计最小寿命', '平均寿命'],
          rows: [
            { '寿命': '夹具寿命', '预计最大寿命': 900, '预计最小寿命': 560, '平均寿命': 640},

          ]
        },
        funnelChartData: {
          columns: ['状态', '数值'],
          rows: [
            { '状态': '螺丝磨损', '数值': 42 },
            { '状态': '生锈', '数值': 30 },
            { '状态': '破裂', '数值': 18 },
            { '状态': '其他', '数值': 12 }
          ]
        },
        pieChartData: {
          columns: ['状态', '数值'],
          rows: [
            { '状态': '剩余健康度', '数值': 42 },
            { '状态': '消耗健康度', '数值': 30 },
          ]
        },
        ringChartData: {
          columns: ['工作时间', '时间(小时)'],
          rows: [
            { '工作时间': '正常工作时间', '时间(小时)': 3530 },
            { '工作时间': '异常时间', '时间(小时)': 90 },

          ]
        },
        apparatusEntityData: {
          billNo: '',
          seqId: '',
          familyName: '',
          partNo: '',
          model: '',
          location: '',
          status: '',
          name: ''
        }
      }
    },
    methods: {
      async fetchData() {
        // let client = this.apolloProvider.defaultClient
        try {

          this.$apolloProvider.defaultClient.query({
            query: queryOne,
            variables: { input: this.$route.params.id}
          })
            .then(({ data }) => {
              const apparatusEntity = data.apparatusEntity
              console.log(apparatusEntity)
              const { seqId, billNo, location, status } = apparatusEntity
              this.apparatusEntityData = {
                billNo,
                seqId,
                location,
                status,
                name: apparatusEntity.def.name,
                familyName: apparatusEntity.def.family.name,
                partNo: apparatusEntity.def.partNos,
                model: apparatusEntity.def.models
              }
            })
            .catch(e => {
              console.log(e)
            })



          let { data } = await this.$apolloProvider.defaultClient.query({
            query: gqlQuery,
            variables: { input: this.$route.params.id*1}
          })

          let { apparatusEntity, ...timeLIneData } = data
          this.processTimeline(timeLIneData)
          this.processApparatusEntity(apparatusEntity)

          // TODO 错误处理
          console.log('', data)
        } catch (e) {
          console.log(e, 'fetch error')
          console.log({ input: this.$route.params.id})
        }
      },
      processApparatusEntity(data) {

      },
      processTimeline(data) {
        let obj = JSON.parse(data.trainLogs.payload[0].detail)
        let trainLogsData = data.trainLogs.payload.map(data => {
          console.log(data)
          let detail = JSON.parse(data.detail)

          return {
            operator: detail.Operator,
            change: objectDiff.diff(detail.Before, detail.After).value,
            time: detail.Time
          }
        })
        console.log(obj)
        console.log(objectDiff.diff(obj.Before, obj.After))
        this.timeline = [
          ...processIoRecords(data.ioRecords.payload),
          ...processRepairRecords(data.repairRecords.payload),
          ...processScrapRecords(data.scrapRecords.payload),
          ...processTrainLogsRecords(trainLogsData)
        ].sort((a, b) => {
          const aTime = Date.parse(a.time)
          const bTime = Date.parse(b.time)
          if (aTime < bTime) {
            return 1
          } else if (aTime > bTime) {
            return -1
          } else {
            const timePriority = ['维修申请', '维修申请审核', '维修结束', '报废申请', '报废申请审核', '报废初审审核', '报废终审审核']
            const aType = a.type
            const bType = b.type
            const priorityValue = timePriority.indexOf(aType) - timePriority.indexOf(bType)
            if (priorityValue > 0) {
              return -1
            } else if (priorityValue < 0) {
              return 1
            }
            return 0
          }
        })
      },
      getColor(str) {
        console.log(str)
        const last2Char = str.slice(-2, str.length)

        let ret = 'blue'
        switch (last2Char) {
          case '入库':
          case '申请':
            ret = 'green'
            break
          case '出库':
          case '结束':
            ret = 'red'
            break
          default:
            ret = 'blue'
        }
        return ret
      },
      hasClockCircle(str) {
        const last2Char = str.slice(-2, str.length)
        return last2Char === '申请' || last2Char === '审核'
      },
      formatTime(time) {
        const date = new Date(Date.parse(time))
        return date.toLocaleString()
      }
    },
    created() {
      this.fetchData()
    }
  }



  function isVaildDate(dateStr) {
    return typeof dateStr !== 'undefined' && dateStr.slice(0, 4) !== '0001' &&  dateStr !== ''
  }

  function processIoRecords(data) {
    return processHelper(data, [
      {
        dateAttrName: 'outTime',
        proposerAttrName: 'outRecordPerson',
        type: '出库'
      },
      {
        dateAttrName: 'inTime',
        proposerAttrName: 'inRecordPerson',
        type: '入库'
      }
    ])
  }

  function processRepairRecords(data) {
    return processHelper(data, [
      {
        dateAttrName: 'finishTime',
        type: '维修结束'
      },
      {
        dateAttrName: 'acceptorTime',
        proposerAttrName: 'acceptor',
        type: '维修申请审核'
      },
      {
        dateAttrName: 'applicationTime',
        proposerAttrName: 'proposer',
        type: '维修申请'
      },
    ])
  }

  function processScrapRecords(data) {
    return processHelper(data, [
      {
        dateAttrName: 'finalProcessTime',
        proposerAttrName: 'finalProcessor',
        type: '报废终审审核'
      },
      {
        dateAttrName: 'middleProcessTime',
        proposerAttrName: 'middleProcessor',
        type: '报废初审审核'
      },
      {
        dateAttrName: 'acceptorTime',
        proposerAttrName: 'acceptor',
        type: '报废申请审核'
      },
      {
        dateAttrName: 'applicationTime',
        proposerAttrName: 'proposer',
        type: '报废申请'
      },
    ])
  }

  function processTrainLogsRecords(data) {
    console.log(data)
    return processHelper(data, [
      {
        dateAttrName: 'time',
        proposerAttrName: 'operator',
        type: data => {
          let ret = '工夹具实体修改: '
          console.log('process')
          console.log(data)


          let changeKeys = Object.keys(data.change)
          changeKeys.forEach(key => {
            const nameMap = {
              BillNo: '料号',
              DefId: '夹具定义',
              Location: '库位',
              Picture: '夹具图片',
              RegDate: '入库日期',
              SeqId: '序列号',
              Status: '夹具状态'
            }

            let changeValue = data.change[key]
            if (changeValue.changed !== 'equal' && changeValue.added) {
              console.log(changeValue)
              if (key === 'Picture') {

              } else if (typeof changeValue.added === 'string' && changeValue.added.slice(0, 4) === '0001') {
                // console.log('hello')
              }
              else {
                ret += `${nameMap[key]} ${changeValue.removed} -> ${changeValue.added}, `
              }
            }
          })

          console.log('process end')
          return ret
        }
      }
    ])
  }
  function timelineRecord(obj, option, callback) {
    let { dateAttrName, type } = option

    if (isVaildDate(obj[dateAttrName])) {

      if (typeof type === 'function') {
        type = type(obj)
      }

      const callbackArgs = {
        time: obj[dateAttrName],
        type
      }
      if (typeof option.proposerAttrName !== 'undefined') {
        Object.assign(callbackArgs, {
          proposer: obj[option.proposerAttrName],
        })
      }
      callback(callbackArgs)
    }
  }

  function processHelper(data, optionList) {
    const ret = []
    const cb = data => ret.push(data)

    data.forEach(datum => {
      optionList.forEach(option => {
        timelineRecord(datum, option, cb)
      })
    })
    return ret
  }

</script>

<style lang="scss">
  .chart_list {
    display: flex;
    justify-content: space-around;
    position: relative;
    > .chart_item {
      width: 30%;
    }
  }

  .chart_title {
    text-align: center;
  }

  .data_wrapper {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding-left: 10px;

    .content {
      margin: 20px 0;
      width: 25%;
    }
  }




</style>
