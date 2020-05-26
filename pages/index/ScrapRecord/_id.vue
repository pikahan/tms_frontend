<template>
  <div>
    <h1>详细数据</h1>
    <div style="margin-bottom: 20px">
      <a-descriptions
        bordered
        :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
      >
        <a-descriptions-item label="名字">
          {{ processedData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="编号">
          {{ processedData.code }}
        </a-descriptions-item>
        <a-descriptions-item label="序列号">
          {{ processedData.seqId }}
        </a-descriptions-item>
        <a-descriptions-item label="申请人">
          {{ processedData.proposer }}
        </a-descriptions-item>
        <a-descriptions-item label="申请时间">
          {{ processedData.applicationTime }}
        </a-descriptions-item>
        <a-descriptions-item label="初审人">
          {{ processedData.middleProcessor }}
        </a-descriptions-item>
        <a-descriptions-item label="初审时间">
          {{ processedData.middleProcessTime }}
        </a-descriptions-item>
        <a-descriptions-item label="终审人">
          {{ processedData.finalProcessor }}
        </a-descriptions-item>
        <a-descriptions-item label="终审时间">
          {{ processedData.finalProcessTime }}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          {{ processedData.status }}
        </a-descriptions-item>
        <a-descriptions-item label="原因">
          {{ processedData.reason }}
        </a-descriptions-item>
      </a-descriptions>

      <div style="text-align: center;margin-top: 30px;">
        <!--<a-button type="primary" >审批</a-button>-->

          <a-popconfirm class="button" placement="topRight" ok-text="同意" cancel-text="拒绝" @confirm="processingApplication(data.id, 'firstOk')" @cancel="processingApplication(data.id, 'firstReject')"
            v-if="permission.DisposalApplicationMiddleProcess && data.status === '申请中'"
          >
            <template slot="title">
              <p>是否同意申请?</p>
            </template>
            <a-button type="primary">审批</a-button>
          </a-popconfirm>
          <a-popconfirm
            v-else-if="permission.DisposalApplicationFinalProcess && data.status === '初审通过'"
            placement="topRight"
            ok-text="同意"
            cancel-text="拒绝"
            @confirm="processingApplication(data.id, 'secondOk')"
            @cancel="processingApplication(data.id, 'secondReject')">
            <template slot="title">
              <p>是否同意申请?</p>
            </template>
            <a-button type="primary">审批</a-button>
          </a-popconfirm>
        <a-button ><nuxt-link to="/scrapRecord">返回</nuxt-link></a-button>
      </div>
    </div>
  </div>

</template>

<script>
  import queryOne from '@/apollo/queries/scrapRecord.gql'
  import { arrayBufferToBase64 } from '@/util/helper'

  // TODO 定位
  export default {
    data () {
      return {
        data: {

        }
      }
    },
    methods: {
      arrayBufferToBase64,
      async fetchData() {
        try {
          let { data } = await this.$apolloProvider.defaultClient.query({
            query: queryOne,
            variables: { id: this.$route.params.id}
          })
          this.data = data.scrapRecord
          console.log('', data)
        } catch (e) {
          console.log(e, 'fetch error')
          console.log({ input: this.$route.params.id})
        }
      },
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
            this.$message.success({ content: '操作成功' })
            if (typeof this.$route.query.target !== 'undefined' ) {
              this.$router.push(this.$route.query.target === 'home' ? '/' : '/' + this.$route.query.target)
            } else {
              this.$router.go(-1)
            }
            // this.$store.dispatch(`scrapRecord/fetchData`)
          })
      },


    },
    created() {
      this.fetchData()
    },
    computed: {
      processedData() {
        let data = this.data

        if (Object.keys(data).length === 0) {
          return {}
        }
        let { apparatusEntity, middleProcessTime, middleProcessor, applicationTime, finalProcessor, proposer, finalProcessTime, ...otherData } = data
        let { def, ...otherApparatusEntity } = apparatusEntity

        return {
          ...otherData,
          ...otherApparatusEntity,
          ...def,
          middleProcessTime: formatTime(middleProcessTime),
          applicationTime: formatTime(applicationTime),
          finalProcessTime: formatTime(finalProcessTime),
          middleProcessor: middleProcessor ? middleProcessor : '暂无',
          proposer: proposer ? proposer : '暂无',
          finalProcessor: finalProcessor ? finalProcessor : '暂无',
        }
      },
      permission() {
        // TODO 划分好权限之后更改
        const ret = {}
        this.$store.state.user.userInfo.permissions.forEach(permission => {
          ret[permission.name] = permission.value
        })
        console.log(ret)
        return ret
      },
    }
  }

  function flatten(data) {

  }

  function formatTime(time) {
    if (time.slice(0, 4) === '0001') {
      return '暂无'
    }

    const date = new Date(Date.parse(time))
    return date.toLocaleString()
  }

  function isVaildDate(dateStr) {
    return typeof dateStr !== 'undefined' && dateStr.slice(0, 4) !== '0001' &&  dateStr !== ''
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
