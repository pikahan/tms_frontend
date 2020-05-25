<template>
  <application :formData="formData" :form="form" :rules="rules" goBackUrl="/putInOperation">
    <template v-slot:first>
      <a-form-model-item  label="经手人" prop="inRecordPerson" >
        <a-input
          :disable="true"
          placeholder="输入经手人"
          v-model="form.inRecordPerson"
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
    name: '_id',

    components: {
      application
    },
    data() {
      return {
        form: {
          inRecordPerson: '',
          inHandlingPerson: '',
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['inRecordPerson', 'inHandlingPerson']
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
          inRecordPerson: [{ required: true, message: '请输入经手人!' }],
          inHandlingPerson: [{ required: true, message: '请输入入库记录人!' }]
        }
      };
    },
    methods: {
      async handleSubmit(data, next) {
        const date = (new Date).toISOString()
        await this.$store.dispatch('ioRecord/updateData', { ...data, inTime: date, id: this.$route.params.id })
        next()
      },
    },
    computed: {
      ...mapState('user', ['userInfo'])
    },
    mounted() {
      this.inHandlingPerson = this.userInfo.employeeId
    }

  };
</script>
<style scoped>

</style>
