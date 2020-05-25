<template>
  <div>
    <h1>共计训练工夹具种类</h1>
    <p>{{ detail.TotalToTrain }}</p>
    <h1>训练起始时间</h1>
    <p>{{ (new Date(Date.parse(detail.StartTime))).toLocaleString() }} - {{ (new Date(Date.parse(detail.finishTime))).toLocaleString() }}</p>
    <h1 style="line-height: 30px">训练失败的工夹具种类及其原因</h1>
    <a-list item-layout="horizontal" :data-source="failedLogs">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta :description="item.description">
          <a slot="title">{{ item.title }}</a>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import trainLogGql from "@/apollo/queries/trainLog.gql";

export default {
  data() {
    return {
      id: this.$route.params.id,
      time: "",
      detail: null,
      failedLogs: []
    };
  },
  created() {
    const data = this.$apolloProvider.defaultClient
      .query({
        query: trainLogGql,
        variables: {
          id: this.$route.params.id
        }
      })
      .then(({ data }) => {
        console.log(data);
        this.time = data.trainLog.time;
        this.detail = JSON.parse(data.trainLog.detail);
        for (const key in this.detail.FailedLogs) {
          this.failedLogs.push({
            title: key,
            description: this.detail.FailedLogs[key]
          })
        }
      })
      .catch(e => {
        console.error(e);
      });
  }
};
</script>

<style>
</style>