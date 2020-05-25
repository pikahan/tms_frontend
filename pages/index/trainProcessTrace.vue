<template>
  <div>
    <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
      <a-radio-button value="training">正在训练</a-radio-button>
      <a-radio-button value="history">历史训练记录</a-radio-button>
    </a-radio-group>
    <div v-show="mode == 'training'">
      <h1>当前进度</h1>
      <a-tooltip :title="title">
        <a-progress :percent="trainPercent" :success-percent="trainSuccessPercent" status="active" />
      </a-tooltip>
      <h1 style="line-height: 30px">失败的工夹具定义及其原因</h1>
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
    <div v-show="mode == 'history'"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import WsManager from "@/util/wsManager.ts";
import { mapState } from "vuex";
export default Vue.extend({
  data() {
    return {
      ws: null,
      mode: "training",
      trainPercent: 0,
      trainSuccessPercent: 0,
      title: "0 success / 0 failed / 0 to train",
      failedLogs: []
    };
  },
  created() {
    let ws = new WsManager();
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
          title: "工夹具定义Id-"+key,
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
  computed: {
    ...mapState("user", ["userInfo"])
  }
});
</script>

<style>
</style>