<template>
  <div>
    <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
      <a-radio-button value="training">正在训练</a-radio-button>
      <a-radio-button value="history">历史训练记录</a-radio-button>
    </a-radio-group>
    <div v-show="mode === 'training'">
      <h1>当前进度</h1>
      <a-tooltip :title="title">
        <a-progress :percent="trainPercent" :success-percent="trainSuccessPercent" status="active" />
      </a-tooltip>
      <h1 style="line-height: 30px; margin-top: 20px">失败的工夹具定义及其原因</h1>
      <a-list item-layout="horizontal" :data-source="failedLogs">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta
            :description="item.description"
          >
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
    <div v-show="mode === 'history'">
      <!--TODO 之后该storeTarget-->
      <searchPane :search-data="searchData" storeTarget="ioRecord/fetchData" />
      <a-table :columns="columns" :dataSource="tableData" rowKey="id"  >
        <div slot="StartTime" slot-scope="text">
          {{ (new Date(Date.parse(text))).toLocaleString() }}
        </div>
        <div slot="FinshTime" slot-scope="text">
          {{ (new Date(Date.parse(text))).toLocaleString() }}
        </div>
        <nuxt-link to="/trainProcessTrace/2"  slot="action">
          查看详情
        </nuxt-link>
      </a-table>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TrainProcessManager from "@/util/trainProcessManager.ts";
import { mapState } from "vuex";
import query from '@/apollo/queries/allLogs.gql'
import searchPane from '@/components/searchPane'

const columns = [
  { title: '开始时间', dataIndex: 'StartTime', key: 'StartTime', sorter: true, scopedSlots: { customRender: 'StartTime' }  },
  { title: '结束时间', dataIndex: 'FinshTime', key: 'FinshTime', sorter: true , scopedSlots: { customRender: 'FinshTime' }  },
  { title: '共计训练工夹具种类', dataIndex: 'TotalToTrain', key: 'TotalToTrain', sorter: true },
  { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }

];


const searchData = [

  {
    label: '运行时间范围',
    name: 'applicationTimeFrom\tapplicationTimeTo',
    type: 'range',
    placeholder: ['起始时间', '结束时间'],
    option: {}
  }

]

export default Vue.extend({
  components: {
    searchPane
  },
  data() {
    return {
      ws: null,
      mode: "training",
      trainPercent: 0,
      trainSuccessPercent: 0,
      title: "0 success / 0 failed / 0 to train",
      failedLogs: [],
      data: [],
      columns,
      searchData
    };
  },
  created() {
    this.fetchData()
    let ws = new TrainProcessManager();
    ws.addListener(this.userInfo.workcellId, data => {
      console.log(data);
      this.trainPercent = Number.parseFloat(
        ((data.CurrentTrained / data.TotalToTrain) * 100).toFixed(2)
      );
      this.trainSuccessPercent =
        ((data.CurrentTrained - data.FailedIds.length) / data.TotalToTrain) *
        100;
      this.title = `${data.CurrentTrained - data.FailedIds.length} success / ${
        data.FailedIds.length
      } failed / ${data.TotalToTrain - data.CurrentTrained} to train`;
      let currentLogs = []
      for (const key in data.FailedLogs) {
        currentLogs.push({
          title: key,
          description: data.FailedLogs[key]
        });
      }
      this.failedLogs = currentLogs;
      if(data.TotalToTrain == data.CurrentTrained) {
        this.trainPercent = 0;
        this.trainSuccessPercent = 0;
        this.failedLogs = [],
        this.title = "0 success / 0 failed / 0 to train"
      }
    });
    this.ws = ws;
  },
  methods: {
    fetchData() {
      this.$apolloProvider.defaultClient.query({
        query: query,
        variables: { type: "train"}
      }).then(({data}) => {
        console.log(data.trainLogs.payload)
        this.data = data.trainLogs.payload
      })
    }
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    tableData() {
      return this.data.map(datum => {
        let detail = JSON.parse(datum.detail)
        return {
          id: datum.id,
          ...detail
        }
      })
    }
  }
});
</script>

<style>
</style>
