<template>
  <a-form :layout="formLayout" @submit="handleSubmit" :form="form">
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"

    >
      <span slot="label">
        入库时间消耗
        <a-tooltip title="工夹具入库记录时间与实际下线时间的差值">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
      <a-input-group compact>
        <a-input-number
          v-decorator="[
            'ioInHours',
              {
                initialValue: 0
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}时`"
          :min="0"/>
        <a-input-number
          v-decorator="[
            'ioInMinutes',
              {
                initialValue: 0,
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}分`"
          :min="0"/>
        <a-input-number
          v-decorator="[
            'ioInSeconds',
              {
                initialValue: 0,
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}秒`"
          :min="0"/>
      </a-input-group>
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"

    >
       <span slot="label">
        出库时间消耗
        <a-tooltip title="工夹具出库记录时间与实际上线时间的差值">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
      <a-input-group compact>
        <a-input-number
          v-decorator="[
            'ioOutHours',
              {
                initialValue: 0
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}时`"
          :min="0"/>
        <a-input-number
          v-decorator="[
            'ioOutMinutes',
              {
                initialValue: 0,
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}分`"
          :min="0"/>
        <a-input-number
          v-decorator="[
            'ioOutSeconds',
              {
                initialValue: 0,
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}秒`"
          :max="59"
          :min="0"/>
      </a-input-group>


    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"

    >
       <span slot="label">
        维修时间消耗
        <a-tooltip title="工夹具在线上实际发生故障时间与送修申请发起时间的差值">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
      <a-input-group compact>
        <a-input-number
          v-decorator="[
            'repairHours',
              {
                initialValue: 0
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}时`"
          :min="0"/>
        <a-input-number
          v-decorator="[
            'repairMinutes',
              {
                initialValue: 0,
              },
            ]"
          style="width: 33%"
          :formatter="value => `${value}分`"
          :min="0"/>
        <a-input-number
          v-decorator="[
            'repairSeconds',
              {
                initialValue: 0,
              },
            ]"
                      style="width: 33%"
          :formatter="value => `${value}秒`"
          :min="0"/>
      </a-input-group>
    </a-form-item>
    <a-form-item
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      label="任务类别">
      <a-radio-group
        @change="changeValue"
        default-value="predict"
      >
        <a-radio-button value="predict">
        预测
      </a-radio-button>
      <a-radio-button value="train">
        训练
      </a-radio-button>
      <a-radio-button value="check">
      检查
    </a-radio-button>
    </a-radio-group>
    </a-form-item>
    <a-form-item
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      label="任务计划">
      <a-cron ref="innerVueCron" v-decorator="['cronExpression', {'initialValue':'0 0 0 2 * ?',rules:
  [t ]}]" @change="setCorn"></a-cron>
    </a-form-item>
    <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
      <a-button type="primary" html-type="submit">
        保存设置
      </a-button>
      <a-button style="margin-left: 12px" @click="handleStartTask">
        立即执行
      </a-button>
    </a-form-item>

  </a-form>
</template>

<script>
  import { mapState } from 'vuex'
  import query from '@/apollo/queries/systemOption.gql'
  import saveSettingGql from  '@/apollo/mutations/systemSettings/updateSaveSetting.gql'
  import startTaskGql from  '@/apollo/mutations/systemSettings/startTaskGql.gql'
  import ACron from "@/components/Acron";

  let WEEK_INDEX = 5
  let MINUTE_INDEX = 1
  let HOUR_INDEX = 2
  let DAY_INDEX = 3


  export default {
    components: {
      ACron
    },
    data() {
      return {
        formLayout: 'horizontal',
        cronStatus: 'validating',
        predict: '',
        train: '',
        check: '',
        help: '',
        msg: '',
        key: 'predict',
        week: false,
        day: false,
        hour: false,
        minute: false,
        visible: false,
        testValueIndex: 1
      };
    },
    computed: {
      formItemLayout() {
        const { formLayout } = this;
        return formLayout === 'horizontal'
          ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
          : {};
      },
      buttonItemLayout() {
        const { formLayout } = this;
        return formLayout === 'horizontal'
          ? {
            wrapperCol: { span: 14, offset: 4 },
          }
          : {};
      },
      ...mapState('user', ['userInfo'])
    },
    methods: {
      changeValue() {
        let value = ['0 1 0 2 * ?', '1 0 0 2 * ?', '0 4 0 2 * ?']
        let index = this.testValueIndex
        if (index === 3) {
          index = 0
        }
        this.form.setFieldsValue({cronExpression: value[index]})
        this.testValueIndex = index + 1

      },
      handleFormLayoutChange(e) {
        this.formLayout = e.target.value;
      },
      handleFocus(e) {
        this.cronStatus = 'validating'
        this.help = ''
      },
      setCorn(data){
        console.log(data)
        if(data !== undefined){
          this.$nextTick(() => {
            this.form.setFieldsValue({cronExpression: data})
          })
        }

      },
      handleSelectChange(e, type) {
        let value = e
        switch (value) {
          case '?':
            this[type] = true
            break
          case '*':
            this[type] = true
            break
          case '':
            this[type] = false
            break
          case '-':
            this[type] = false
        }
      },
      handleRadioChange(e) {
        let week = this.form.getFieldValue('week')
        let currSelectWeek = this.form.getFieldValue('selectWeek')

        let day = this.form.getFieldValue('day')
        let currSelectDay = this.form.getFieldValue('selectDay')

        let hour = this.form.getFieldValue('hour')
        let currSelectHour = this.form.getFieldValue('selectHour')

        let minute = this.form.getFieldValue('minute')
        let currSelectMinute = this.form.getFieldValue('selectMinute')

        let temp = this[e.target.value].split(' ')

        let [selectWeek, weekValue, disableWeek] = this.formatSelect(temp[WEEK_INDEX])
        let [selectDay, dayValue, disableDay] = this.formatSelect(temp[DAY_INDEX])
        let [selectHour, hourValue, disableHour] = this.formatSelect(temp[HOUR_INDEX])
        let [selectMinute, minuteValue, disableMinute] = this.formatSelect(temp[MINUTE_INDEX])

        this.form.setFieldsValue({
          week: weekValue,
          day: dayValue,
          hour: hourValue,
          minute: minuteValue,
          selectWeek,
          selectDay,
          selectHour,
          selectMinute
        });

        let miniteCronItem = this.getCronItemValue(currSelectMinute, minute)
        let dayCronItem = this.getCronItemValue(currSelectDay, day)
        let hourCronItem = this.getCronItemValue(currSelectHour, hour)
        let weekCronItem = this.getCronItemValue(currSelectWeek, week)

        this[this.key] = [0, miniteCronItem, hourCronItem, dayCronItem, '*', weekCronItem, '?']
        this.key = e.target.value
      },
      getCronItemValue(ch, value) {
        if (ch === '-') {
          return value
        }
        return ch + value
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            let getHours = (hours, minutes, seconds) => {
              return hours + (seconds / 60 + minutes) / 60
            }
            console.log('Received values of form: ', values);
            const { ioInHours, ioInMinutes, ioInSeconds, ioOutHours, ioOutMinutes, ioOutSeconds, repairHours, repairMinutes, repairSeconds, minute, hour, week, day, taskName, selectWeek, selectHour, selectDay, selectMinute } = values
            this[taskName] = [week, day, hour, minute]
            // let cron = this.formatCronArr([week, day, hour, minute], {
            //   selectDay, selectHour, selectMinute, selectWeek
            // })
            const ioInWaste = getHours(ioInHours, ioInMinutes, ioInSeconds)
            const ioOutWaste = getHours(ioOutHours, ioOutMinutes, ioOutSeconds)
            const repairWaste = getHours(repairHours, repairMinutes, repairSeconds)


            // let { check: checkRemindSchedule, predict: predictSchedule, train: trainSchedule } = this
            // checkRemindSchedule = taskName !== 'check' ? checkRemindSchedule : cron
            // predictSchedule = taskName !== 'predict' ? predictSchedule : cron
            // trainSchedule = taskName !== 'train' ? trainSchedule : cron
            const workcellId = this.userInfo.workcellId
            this.submitSettingData(saveSettingGql, { input: {ioInWaste, ioOutWaste, repairWaste, workcellId}})
          }
        });
      },

      formatCronArr(arr, type) {
        // let weekCronItem = c
        let chFirst = type[0].toUpperCase()
        let leftCh = type.slice(1, type.length)
        let name = 'select' + chFirst + leftCh
        let value = this.form.getFieldValue(name)

        return [0, arr[3] === '每' ? '*' : arr[3], arr[2] === '每' ? '*' : arr[2], arr[1] === '每' ? '*' : arr[1], '*', arr[0] === '每' ? '*' : arr[0], '?'].join(' ')
      },
      handleStartTask() {
        const workcellId = this.userInfo.workcellId
        let taskName = this.form.getFieldValue('taskName')
        this.submitSettingData(startTaskGql, { taskName, workcellId })
      },

      submitSettingData(mutation, input) {
        try {
          console.log(input)
          this.$message.loading({ content: '保存中', key: 'key' })
          this.$apolloProvider.defaultClient.mutate({
            mutation,
            variables: { ...input }
          }).then(({ data }) => {
            this.$message.success({ content: '保存成功', key: 'key' })
          }).catch(e => {
            this.$message.success({ content: '保存成功', key: 'key' })
          })
        } catch (e) {
          console.error(e)
        }
      },
      cronType(rule, value, callback) {

        if (Number.isNaN(value * 1) && value !== '') {
          console.log(value)
          // this.form.validateFields([rule.field], { force: true });
          callback()
          this.msg = "请输入数字"
        }
        else {
          callback()
          this.msg = ""

        }
      },
      formatSelect(value) {
        if (Number.isNaN(value * 1)) {
          return [value[0], value.slice(1, value.length), true]
        }
        return ['-', value, false]
      }

    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'systemSettings' })
    },
    mounted() {
      try {
        const data = this.$apolloProvider.defaultClient.query({
          query,
          variables: { workcellId: this.userInfo.workcellId }
        }).then(({ data }) => {
          console.log(data)

          let ioInWaste = formatHours(data.systemSetting.ioInWaste)
          let ioOutWaste = formatHours(data.systemSetting.ioOutWaste)
          let repairWaste = formatHours(data.systemSetting.repairWaste)
          let { checkRemindSchedule, predictSchedule, trainSchedule, id } = data.systemSetting
          console.log(data)
          this.id = id
          let temp = predictSchedule.split(' ')
          this.check = checkRemindSchedule
          this.predict = predictSchedule
          this.train = trainSchedule

          let [selectWeek, week, disableWeek] = this.formatSelect(temp[WEEK_INDEX])
          let [selectDay, day, disableDay] = this.formatSelect(temp[DAY_INDEX])
          let [selectHour, hour, disableHour] = this.formatSelect(temp[HOUR_INDEX])
          let [selectMinute, minute, disableMinute] = this.formatSelect(temp[MINUTE_INDEX])

          // this.week = disableWeek
          // this.day = disableDay
          // this.hour = disableHour
          // this.minute = disableMinute

          // this.form.setFieldsValue({
          //   week: temp[0],
          //   day: temp[1],
          //   hour: temp[2],
          //   minute: temp[3],
          // });

          this.form.setFieldsValue({
            ioInHours: ioInWaste[0],
            ioInMinutes: ioInWaste[1],
            ioInSeconds: ioInWaste[2],
            ioOutHours: ioOutWaste[0],
            ioOutMinutes: ioOutWaste[1],
            ioOutSeconds: ioOutWaste[2],
            repairHours: repairWaste[0],
            repairMinutes: repairWaste[1],
            repairSeconds: repairWaste[2],
            // selectWeek,
            // selectDay,
            // selectHour,
            // selectMinute,
            // week,
            // day,
            // hour,
            // minute,
          });
        })
      } catch (e) {
        console.error(e)
      }
    }
  };

  function formatCron(cronStr) {
    let [second, minute, hour, day, month, week] = cronStr.split(' ')
    let ret = []
    // ret.push(week === '*' ? '每' : week)
    // ret.push(day === '*' ? '每' : day)
    // ret.push(hour === '*' ? '每' : hour)
    // ret.push(minute === '*' ? '每' : minute)
    return [week, day, hour, minute]
  }

  function formatHours(doubleTypeHours) {
    let ret = [0, 0, 0]
    let hours = parseInt(doubleTypeHours)
    ret[0] = hours

    let diff = doubleTypeHours - hours

    if (diff > 0) {
      let doubleTypeMinutes = diff * 60
      let minutes = parseInt(doubleTypeMinutes)
      ret[1] = minutes

      diff = doubleTypeMinutes - minutes
      if (diff > 0) {
        ret[2] = parseInt(diff * 60)
      }
    }
    return ret
  }





</script>


<style>
  .bottom-btn {
    position: relative;
  }

  .bottom-btn-msg {
    position: absolute;
    left: 0;
    bottom: -24px;
    color: red;
  }



</style>
