<template>
  <application :formData="formData" :form="form" :rules="rules" goBackUrl="/putInOperation">
    <template v-slot:first>
      <a-form-model-item  label="经手人" prop="inHandlingPerson" >
        <a-input
          placeholder="输入库位"
          v-model="form.inHandlingPerson"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="记录人" prop="inHandlingPerson" >
      <a-input
        placeholder="输入入库记录人"
        v-model="form.inRecordPerson"
      >
      </a-input>
    </a-form-model-item>
        <a-form-model-item  label="夹具名" prop="lineId" >
          <a-select
            show-search
            v-model="form.lineId"
            option-filter-prop="name"
            :filter-option="filterOption"
            placeholder="Select a person"
          >

            <a-select-option v-for="line in lineData" :key="line.id" :value="line.id">
              {{line.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item  label="库位" prop="location"  >
          <a-input
            placeholder="输入库位"
            v-model="form.location"
          >
          </a-input>
        </a-form-model-item>
    </template>
    <template v-slot:second>
      <a-form-model-item  prop="validate">
        <a-input
          placeholder="验证"
          v-model="form.validate"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
    </template>
  </application>
</template>
<script>
  import application from '@/components/application'
  import { mapState } from 'vuex'

  //TODO 这个页面之后可能要重构, 先这么写了
  export default {

    components: {
      application
    },
    data() {
      return {
        form: {
          outRecordPerson: '',
          outHandlingPerson: '',
          apparatusEntityId: '',
          lineId: '',
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['user', 'code']
          },
          {
            title: '身份核对',
            modelItem: ['validate']
          },
          {
            title: '成功提交申请'
          }
        ],
        rules: {
          code: [{ required: true, message: '请输入物品ID!' }],
          validate: [{ required: true, message: '请放入你的员工卡!' }]
        }
      };
    },
    methods: {
      async handleSubmit(data, next) {
        const date = (new Date).toISOString()
        date.split('').filter(ch => (ch !== ' ')).join("")
        const { seqId } = data
        await this.$store.dispatch('apparatusEntity/createData', {...data, regDate: date, status: '在库', billNo: date.split('').filter(ch => (ch !== ' ')).join(""), seqId: seqId*1})
        next()

      },
      filterOption(input, option) {
        console.log(option)
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
    },
    computed: {
      ...mapState('line', ['data'])
    },
    async fetch() {
      console.log('fetch')
      await this.$store.dispatch('apparatusDef/fetchData')
    },

  };
</script>
<style scoped>

</style>
