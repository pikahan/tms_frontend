<template>
  <div>
    <div>
      <h1>夹具基础数据</h1>
      <div class="data_wrapper">
        <div class="content">夹具编号: code1</div>
        <div class="content">夹具名字: name1</div>
        <div class="content">寿命计数: 1024</div>
        <div class="content">夹具大类: family1</div>
        <div class="content">夹具模组: model1</div>
        <div class="content">夹具料号: partNo 1</div>
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
        <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
        <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
        <a-timeline-item color="red">
          <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" />
          Technical testing 2015-09-01
        </a-timeline-item>
        <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      this. histogramChartSettings = {
        metrics: ['预计最大寿命', '预计最小寿命', '平均寿命'],
        dimension: ['寿命']
      }
      return {
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
        }
      }
    }
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
