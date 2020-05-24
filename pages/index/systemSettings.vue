<template>
  <a-form :layout="formLayout" @submit="handleSubmit" :form="form">
    <a-form-item
      label="任务类型"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-radio-group
        @change="handleRadioChange"
        v-decorator="[
          'taskName',
          {
            initialValue: 'predict',
            rules: [
              {
                required: true,
                message: '请输入任务类别',
              }
            ],
          },
        ]">
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
      label="入库时间消耗"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"

    >
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
          :min="0" />
        <a-input-number
          v-decorator="[
            'ioInMinutes',
            {
              initialValue: 0,
            },
          ]"
          style="width: 33%"
          :formatter="value => `${value}分`"
          :min="0" />
        <a-input-number
          v-decorator="[
            'ioInSeconds',
            {
              initialValue: 0,
            },
          ]"
          style="width: 33%"
          :formatter="value => `${value}秒`"
          :min="0" />
      </a-input-group>
    </a-form-item>
    <a-form-item
      label="出库时间消耗"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"

    >
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
          :min="0" />
        <a-input-number
          v-decorator="[
            'ioOutMinutes',
            {
              initialValue: 0,
            },
          ]"
          style="width: 33%"
          :formatter="value => `${value}分`"
          :min="0" />
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
          :min="0" />
      </a-input-group>



    </a-form-item>
    <a-form-item
      label="维修时间消耗"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"

    >
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
          :min="0" />
        <a-input-number
          v-decorator="[
            'repairMinutes',
            {
              initialValue: 0,
            },
          ]"
          style="width: 33%"
          :formatter="value => `${value}分`"
          :min="0" />
        <a-input-number
          v-decorator="[
            'repairSeconds',
            {
              initialValue: 0,
            },
          ]"
          style="width: 33%"
          :formatter="value => `${value}秒`"
          :min="0" />
      </a-input-group>
    </a-form-item>
    <a-form-item
      label="计划任务"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validate-status="cronStatus"
      :help="help"
    >
      <a-input-group compact class="bottom-btn">
        <a-input
          addon-after="周"
          :disabled="week"
          v-decorator="[
            'week',
            {
              initialValue: '每',
              rules: [
                {
                validator: cronType,
                },
              ]
            },
          ]"
          style="width: 30%">

          <a-select
            style="width: 70px"
            slot="addonBefore"
            @change="handleSelectChange($event, 'week')"
            v-decorator="[
            'selectWeek',
            {
              initialValue: '*',
            },
          ]"
          >
            <a-select-option value="*">
              每
            </a-select-option>
            <a-select-option value="/">
              间隔
            </a-select-option>
            <a-select-option value="?">
              ?
            </a-select-option>
            <a-select-option value="-">
              -
            </a-select-option>
          </a-select>
        </a-input>

      </a-input-group >
      <a-input-group compact class="bottom-btn">

        <a-input
          :disabled="day"

          addon-after="天"
          v-decorator="[
            'day',
            {
              initialValue: '每',
              rules: [
                {
                validator: cronType,
                },
              ]
            },
          ]"
          style="width: 30%">

          <a-select
            style="width: 70px"
            slot="addonBefore"
            @change="(e) => {handleSelectChange(e, 'day')}"

            v-decorator="[
            'selectDay',
            {
              initialValue: '*',
            },
          ]"
          >
            <a-select-option value="*">
              每
            </a-select-option>
            <a-select-option value="/">
              间隔
            </a-select-option>
            <a-select-option value="?">
              ?
            </a-select-option>
          </a-select>
        </a-input>
      </a-input-group>
      <a-input-group compact class="bottom-btn">

        <a-input
          :disabled="hour"

          addon-after="时"
          v-decorator="[
            'hour',
            {
              initialValue: '每',
              rules: [
                {
                validator: cronType,
                },
              ]
            },
          ]"
          style="width: 30%">

          <a-select
            @change="(e) => {handleSelectChange(e, 'hour')}"
            style="width: 70px"
            slot="addonBefore"
            v-decorator="[
            'selectHour',
            {
              initialValue: '*',
            },
          ]"
          >
            <a-select-option value="*">
              每
            </a-select-option>
            <a-select-option value="/">
              间隔
            </a-select-option>
            <a-select-option value="?">
              ?
            </a-select-option>
          </a-select>
        </a-input>
        </a-input-group>
      <a-input-group compact class="bottom-btn">


        <a-input
          :disabled="minute"

          addon-after="分"
          v-decorator="[
            'minute',
            {
              initialValue: '0',
              rules: [
                {
                validator: cronType,
                },
              ]
            },
          ]"
          style="width: 30%">
          <a-select
            @change="(e) => {handleSelectChange(e, 'minute')}"
            style="width: 70px"
            slot="addonBefore"
            v-decorator="[
            'selectMinute',
            {
              initialValue: '*',
            },
          ]"
          >
            <a-select-option value="*">
              每
            </a-select-option>
            <a-select-option value="/">
              间隔
            </a-select-option>
            <a-select-option value="?">
              ?
            </a-select-option>
          </a-select>
        </a-input>
      </a-input-group>

        <div class="bottom-btn-msg">{{msg}}</div>
    </a-form-item>
    <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
      <a-button type="primary"  html-type="submit">
        保存设置
      </a-button>
      <a-button style="margin-left: 12px" @click="handleStartTask">
        开始任务
      </a-button>
    </a-form-item>

  </a-form>
</template>

<script>
  import { mapState } from 'vuex'
  import query from '@/apollo/queries/systemOption.gql'
  import saveSettingGql from  '@/apollo/mutations/systemSettings/updateSaveSetting.gql'
  import startTaskGql from  '@/apollo/mutations/systemSettings/startTaskGql.gql'

  let WEEK_INDEX = 5
  let MINUTE_INDEX = 1
  let HOUR_INDEX = 2
  let DAY_INDEX = 3


  export default {
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
        minute: false
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
      handleFormLayoutChange(e) {
        this.formLayout = e.target.value;
      },
      handleFocus(e) {
        this.cronStatus = 'validating'
        this.help = ''
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
            let cron = this.formatCronArr([week, day, hour, minute], {
              selectDay, selectHour, selectMinute, selectWeek
            })
            const ioInWaste = getHours(ioInHours, ioInMinutes, ioInSeconds)
            const ioOutWaste = getHours(ioOutHours, ioOutMinutes, ioOutSeconds)
            const repairWaste = getHours(repairHours, repairMinutes, repairSeconds)


            let { check: checkRemindSchedule, predict: predictSchedule, train: trainSchedule } = this
            checkRemindSchedule = taskName !== 'check' ? checkRemindSchedule : cron
            predictSchedule = taskName !== 'predict' ? predictSchedule : cron
            trainSchedule = taskName !== 'train' ? trainSchedule : cron
            const workcellId = this.userInfo.workcellId
            this.submitSettingData(saveSettingGql, { input: {ioInWaste, ioOutWaste, repairWaste, checkRemindSchedule, predictSchedule, trainSchedule, workcellId}})
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
          this.$apolloProvider.defaultClient.mutate({
            mutation,
            variables: { ...input }
          }).then(({ data }) => {

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

          this.week = disableWeek
          this.day = disableDay
          this.hour = disableHour
          this.minute = disableMinute

          this.form.setFieldsValue({
            week: temp[0],
            day: temp[1],
            hour: temp[2],
            minute: temp[3],
          });

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
            selectWeek,
            selectDay,
            selectHour,
            selectMinute,
            week,
            day,
            hour,
            minute,
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



  function cronValidate(cronExpression ){
    //返回错误信息用
    var message = '';
    //先将cron表达式进行分割
    var cronParams = cronExpression.split(" ");
    //判断cron表达式是否具有该具有的属性长度，没有年份的长度为6，带年份的长度为7，其他情况都是错误的
    if (cronParams.length < 6 || cronParams.length > 7) {
      return "cron表达式需要输入6-7位参数，请重新输入";
    }else{
      //日和周必须有一个为?，或者全为*
      if((cronParams[3] == "?" && cronParams[5] != "?") || (cronParams[5] == "?" && cronParams[3] != "?") || (cronParams[3] == "*" && cronParams[5] == "*")){
        //检查第一位的秒是否正确
        message = checkSecondsField(cronParams[0]);
        if (message != true) {
          return message;
        }

        //检查第二位的分是否正确
        message = checkMinutesField(cronParams[1]);
        if (message != true) {
          return message;
        }

        //检查第三位的时是否正确
        message = checkHoursField(cronParams[2]);
        if (message != true) {
          return message;
        }

        //检查第四位的日是否正确
        message = checkDayOfMonthField(cronParams[3]);
        if (message != true) {
          return message;
        }

        //检查第五位的月是否正确
        message = checkMonthsField(cronParams[4]);
        if (message != true) {
          return message;
        }

        //检查第6位的周是否正确
        message = checkDayOfWeekField(cronParams[5]);
        if (message != true) {
          return message;
        }

        //检查第七位的年是否正确
        if(cronParams.length>6){
          message = checkYearField(cronParams[6]);
          if (message != true) {
            return message;
          }
        }


        return true;
      }else{
        return "指定日时周必须设为不指定(?),指定周时日必须设为不指定(?)"
      }
    }
  }

  //检查秒的函数方法
  function checkSecondsField(secondsField) {
    return checkField(secondsField, 0, 59, "秒");
  }

  //检查分的函数方法
  function checkMinutesField(minutesField) {
    return checkField(minutesField, 0, 59, "分");
  }

  //检查小时的函数方法
  function checkHoursField(hoursField) {
    return checkField(hoursField, 0, 23, "时");
  }

  //检查日期的函数方法
  function checkDayOfMonthField(dayOfMonthField) {
    if (dayOfMonthField == "?") {
      return true;
    }
    if (dayOfMonthField.indexOf("L") >= 0) {
      return checkFieldWithLetter(dayOfMonthField, "L", 1, 7, "日");
    } else if ( dayOfMonthField.indexOf("W") >= 0) {
      return checkFieldWithLetter(dayOfMonthField, "W", 1, 31, "日");
    } else if (dayOfMonthField.indexOf("C") >= 0) {
      return checkFieldWithLetter(dayOfMonthField, "C", 1, 31, "日");
    }
    return checkField( dayOfMonthField, 1, 31, "日");
  }

  //检查月份的函数方法
  function checkMonthsField(monthsField) {
    //月份简写处理
    if(monthsField != "*"){
      monthsField=monthsField.replace("JAN", "1");
      monthsField=monthsField.replace("FEB", "2");
      monthsField=monthsField.replace("MAR", "3");
      monthsField=monthsField.replace("APR", "4");
      monthsField=monthsField.replace("MAY", "5");
      monthsField=monthsField.replace("JUN", "6");
      monthsField=monthsField.replace("JUL", "7");
      monthsField=monthsField.replace("AUG", "8");
      monthsField=monthsField.replace("SEP", "9");
      monthsField=monthsField.replace("OCT", "10");
      monthsField=monthsField.replace("NOV", "11");
      monthsField=monthsField.replace("DEC", "12");
      return checkField(monthsField, 1, 12, "月份");
    }else{
      return true;
    }
  }

  //星期验证
  function checkDayOfWeekField(dayOfWeekField) {
    dayOfWeekField=dayOfWeekField.replace("SUN", "1" );
    dayOfWeekField=dayOfWeekField.replace("MON", "2" );
    dayOfWeekField=dayOfWeekField.replace("TUE", "3" );
    dayOfWeekField=dayOfWeekField.replace("WED", "4" );
    dayOfWeekField=dayOfWeekField.replace("THU", "5" );
    dayOfWeekField=dayOfWeekField.replace("FRI", "6" );
    dayOfWeekField=dayOfWeekField.replace("SAT", "7" );
    if (dayOfWeekField == "?") {
      return true;
    }
    if (dayOfWeekField.indexOf("L") >= 0) {
      return checkFieldWithLetterWeek(dayOfWeekField, "L", 1, 7, "星期");
    } else if (dayOfWeekField.indexOf("C") >= 0) {
      return checkFieldWithLetterWeek(dayOfWeekField, "C", 1, 7, "星期");
    } else if (dayOfWeekField.indexOf("#") >= 0) {
      return checkFieldWithLetterWeek(dayOfWeekField, "#", 1, 7, "星期");
    } else {
      return checkField(dayOfWeekField, 1, 7, "星期");
    }
  }

  //检查年份的函数方法
  function checkYearField(yearField) {
    return checkField(yearField, 1970, 2099, "年的");
  }

  //通用的检查值的大小范围的方法( - , / *)
  function checkField(value, minimal, maximal, attribute) {
    //校验值中是否有“-”，如果有“-”的话，下标会>0
    if (value.indexOf("-") > -1 ) {
      return checkRangeAndCycle(value, minimal, maximal,attribute);
    }
    //校验值中是否有“，”，如果有“,”的话，下标会>0
    else if (value.indexOf(",") > -1) {
      return checkListField(value, minimal, maximal,attribute);
    }
    //校验值中是否有“/”，如果有“/”的话，下标会>0
    else if (value.indexOf( "/" ) > -1) {
      return checkIncrementField( value, minimal, maximal ,attribute);
    }
    //校验值是否为“*”
    else if (value=="*") {
      return true;
    }
    //校验单独的数字，英文字母，以及各种神奇的符号等...
    else {
      return checkIntValue(value, minimal, maximal,true, attribute);
    }
  }

  //检测是否是整数以及是否在范围内,参数：检测的值，下限，上限，是否检查端点，检查的属性
  function checkIntValue(value, minimal, maximal, checkExtremity,attribute) {
    try {
      //用10进制犯法来进行整数转换
      var val = parseInt(value, 10);
      if (value == val) {
        if (checkExtremity) {
          if (val < minimal || val > maximal) {
            return (attribute+"的参数取值范围必须在"+ minimal + "-" + maximal +"之间");
          }
          return true;
        }
        return true;
      }
      return (attribute+"的参数存在非法字符，必须为整数或允许的大写英文");
    } catch (e) {
      return (attribute+"的参数有非法字符，必须是整数~")
    }
  }

  //检验枚举类型的参数是否正确
  function checkListField(value, minimal, maximal,attribute) {
    var st = value.split(",");
    var values = new Array(st.length);
    //计算枚举的数字在数组中中出现的次数，出现一次为没有重复的。
    var count=0;
    for(var j = 0; j < st.length; j++) {
      values[j] = st[j];
    }
    //判断枚举类型的值是否重复
    for(var i=0;i<values.length;i++){
      //判断枚举的值是否在范围内
      message = checkIntValue(values[i], minimal, maximal, true, attribute);
      if (message!=true) {
        return message;
      }
      count=0;
      for(var j=0;j<values.length;j++){
        if(values[i]==values[j])
        {
          count++;
        }
        if(count>1){
          return (attribute+"中的参数重复");
        }
      }
    }
    var previousValue = -1;
    //判断枚举的值是否排序正确
    for (var i= 0; i < values.length; i++) {
      var currentValue = values[i];
      try {
        var val = parseInt(currentValue, 10);
        if (val < previousValue) {
          return (attribute+"的参数应该从小到大");
        } else {
          previousValue = val;
        }
      } catch (e) {
        //前面验证过了，这边的代码不可能跑到
        return ("这段提示用不到")
      }
    }
    return true;
  }

  //检验循环
  function checkIncrementField(value, minimal, maximal, attribute) {
    if(value.split("/").length>2){
      return (attribute + "中的参数只能有一个'/'");
    }
    var start = value.substring(0, value.indexOf("/"));
    var increment = value.substring(value.indexOf("/") + 1);
    if (start != "*") {
      //检验前值是否正确
      message = checkIntValue(start, minimal, maximal, true, attribute);
      if(message != true){
        return message;
      }
      //检验后值是否正确
      message = checkIntValue(increment, minimal, maximal, true, attribute);
      if(message != true){
        return message;
      }
      return true;
    } else {
      //检验后值是否正确
      return checkIntValue(increment, minimal, maximal, false, attribute);
    }
  }

  //检验范围
  function checkRangeAndCycle(params, minimal, maximal, attribute){
    //校验“-”符号是否只有一个
    if(params.split("-").length>2){
      return (attribute + "中的参数只能有一个'-'");
    }
    var value = null;
    var cycle = null;
    //检验范围内是否有嵌套周期
    if(params.indexOf("/") > -1){
      //校验“/”符号是否只有一个
      if(params.split("/").length>2){
        return (attribute + "中的参数只能有一个'/'");
      }
      value = params.split("/")[0];
      cycle = params.split("/")[1];
      //判断循环的参数是否正确
      message =checkIntValue(cycle, minimal, maximal, true, attribute);
      if (message!=true) {
        return message;
      }
    }else{
      value = params;
    }
    var startValue = value.substring(0, value.indexOf( "-" ));
    var endValue = value.substring(value.indexOf( "-" ) + 1);
    //判断参数范围的第一个值是否正确
    message =checkIntValue(startValue, minimal, maximal, true, attribute);
    if (message!=true) {
      return message;
    }
    //判断参数范围的第二个值是否正确
    message =checkIntValue(endValue, minimal, maximal, true, attribute);
    if(message!=true){
      return message;
    }
    //判断参数的范围前值是否小于后值
    try {
      var startVal = parseInt(startValue, 10);
      var endVal = parseInt(endValue, 10);
      if(endVal < startVal){
        return (attribute+"的取值范围错误，前值必须小于后值");
      }
      if((endVal-startVal)<parseInt(cycle,10)){
        return (attribute+"的取值范围内的循环无意义");
      }
      return true;
    } catch (e) {
      //用不到这行代码的
      return (attribute+"的参数有非法字符，必须是整数");
    }
  }

  //检查日中的特殊字符
  function checkFieldWithLetter(value, letter, minimalBefore, maximalBefore,attribute) {
    //判断是否只有一个字母
    for(var i=0;i<value.length;i++){
      var count = 0;
      if(value.charAt(i)==letter){
        count++;
      }
      if(count>1){
        return (attribute+"的值的"+letter+"字母只能有一个")
      }
    }
    //校验L
    if(letter == "L"){
      if(value == "LW"){
        return true;
      }
      if(value=="L"){
        return true;
      }
      if(value.endsWith("LW")&&value.length>2)
      {
        return (attribute + "中的参数，最后的LW前面不能有任何字母参数")
      }
      if(!value.endsWith("L"))
      {
        return (attribute + "中的参数，L字母后面不能有W以外的字符、数字等")
      }else{
        var num = value.substring(0,value.indexOf(letter));
        return checkIntValue(num, minimalBefore, maximalBefore, true, attribute);
      }
    }

    //校验W
    if(letter == "W"){
      if(!value.endsWith("W")){
        return (attribute + "中的参数的W必须作为结尾")
      }else{
        if(value=="W"){
          return (attribute + "中的参数的W前面必须有数字")
        }
        var num = value.substring(0,value.indexOf(letter));
        return checkIntValue(num, minimalBefore, maximalBefore, true, attribute);
      }
    }

    if(letter == "C"){
      if(!value.endsWith("C")){
        return (attribute + "中的参数的C必须作为结尾")
      }else{
        if(value=="C"){
          return (attribute + "中的参数的C前面必须有数字")
        }
        var num = value.substring(0,value.indexOf(letter));
        return checkIntValue(num, minimalBefore, maximalBefore, true, attribute);
      }
    }
  }

  //检查星期中的特殊字符
  function checkFieldWithLetterWeek(value, letter, minimalBefore, maximalBefore,attribute) {
    //判断是否只有一个字母
    for(var i=0;i<value.length;i++){
      var count = 0;
      if(value.charAt(i)==letter){
        count++;
      }
      if(count>1){
        return (attribute+"的值的"+letter+"字母只能有一个")
      }
    }
    //校验L
    if(letter == "L"){
      if(value=="L"){
        return true;
      }
      if(!value.endsWith("L"))
      {
        return (attribute + "中的参数，L字母必须是最后一位")
      }else{
        var num = value.substring(0,value.indexOf(letter));
        return checkIntValue(num, minimalBefore, maximalBefore, true, attribute);
      }
    }

    if(letter == "C"){
      if(!value.endsWith("C")){
        return (attribute + "中的参数的C必须作为结尾")
      }else{
        if(value=="C"){
          return (attribute + "中的参数的C前面必须有数字")
        }
        var num = value.substring(0,value.indexOf(letter));
        return checkIntValue(num, minimalBefore, maximalBefore, true, attribute);
      }
    }

    if(letter == "#"){
      if(value=="#"){
        return (attribute + "中的#前后必须有整数");
      }
      if(value.charAt(0)==letter){
        return (attribute + "中的#前面必须有整数")
      }
      if(value.endsWith("#")){
        return (attribute + "中的#后面必须有整数")
      }
      var num1 = value.substring(0,value.indexOf(letter));
      var num2 = value.substring(value.indexOf(letter)+1,value.length)
      message = checkIntValue(num1, 1, 4, true, (attribute+"的#前面"));
      if(message!=true){
        return message;
      }
      message = checkIntValue(num2, minimalBefore, maximalBefore, true, (attribute+"的#后面"));
      if(message!=true){
        return message;
      }
      return true;
    }
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
