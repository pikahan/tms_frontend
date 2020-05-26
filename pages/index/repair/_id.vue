<template>
    <div>
      <h1>详细数据</h1>
      <div style="margin-bottom: 20px">
        <a-descriptions
          bordered
          :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        >
          <a-descriptions-item label="名字">
            {{ processRepairRecordData.name }}
          </a-descriptions-item>
          <a-descriptions-item label="编号">
            {{ processRepairRecordData.code }}
          </a-descriptions-item>
          <a-descriptions-item label="序列号">
            {{ processRepairRecordData.seqId }}
          </a-descriptions-item>
          <a-descriptions-item label="处理人">
            {{ processRepairRecordData.acceptor }}
          </a-descriptions-item>
          <a-descriptions-item label="处理时间">
            {{ processRepairRecordData.acceptorTime }}
          </a-descriptions-item>
          <a-descriptions-item label="申请时间">
            {{ processRepairRecordData.applicationTime }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人">
            {{ processRepairRecordData.proposer }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            {{ processRepairRecordData.status }}
          </a-descriptions-item>
          <a-descriptions-item label="描述">
            {{ processRepairRecordData.description }}
          </a-descriptions-item>
          <a-descriptions-item label="图片">
            <img class="thumbnail" :src="processRepairRecordData.imgSrc" >
          </a-descriptions-item>
        </a-descriptions>

        <div style="text-align: center;margin-top: 30px;">
          <!--<a-button type="primary" >审批</a-button>-->

            <a-popconfirm v-if="permission.RepairApplicationProcess && data.status === '申请中'" placement="topRight" ok-text="同意" cancel-text="拒绝" @confirm="processingApplication(data.id, 'confirm')" @cancel="processingApplication(data.id, 'cancel')">
              <template slot="title">
                <p>是否同意申请?</p>
              </template>
              <a-button type="primary">审批</a-button>
            </a-popconfirm>

          <a-button @click="$router.go(-1)">返回</a-button>
        </div>

      </div>
    </div>

</template>

<script>
  import queryOne from '@/apollo/queries/repairRecord.gql'
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
          this.data = data.repairRecord
          console.log('', data)
        } catch (e) {
          console.log(e, 'fetch error')
          console.log({ input: this.$route.params.id})
        }
      },
      processingApplication(id, type) {
        let status = '维修中'
        if (type === 'cancel') {
          status = '拒绝申请'
        } else if (type === 'confirm') {
          status = '维修中'
        }
        this.$store.dispatch('repairRecord/updateData', {id, status}).then(() => {
          this.$message.success({ content: '操作成功' })
          if (typeof this.$route.query.target !== 'undefined' ) {
            this.$router.push(this.$route.query.target === 'home' ? '/' : '/' + this.$route.query.target)
          } else {
            this.$router.go(-1)
          }
        })
      },


    },
    created() {
      this.fetchData()
    },
    computed: {
      processRepairRecordData() {
        let data = this.data

        if (Object.keys(data).length === 0) {
          return {}
        }
        let { apparatusEntity, acceptorTime, acceptor, applicationTime, finishTime, proposer, picture, ...otherData } = data
        let { def, ...otherApparatusEntity } = apparatusEntity
        let imgSrc = `data:image/png;base64,${picture.length ? arrayBufferToBase64(picture):''}`

        return {
          ...otherData,
          ...otherApparatusEntity,
          ...def,
          imgSrc,
          acceptorTime: formatTime(acceptorTime),
          applicationTime: formatTime(applicationTime),
          finishTime: formatTime(finishTime),
          acceptor: acceptor ? formatTime(acceptorTime) : '暂无',
          proposer: proposer ? formatTime(acceptorTime) : '暂无',
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
