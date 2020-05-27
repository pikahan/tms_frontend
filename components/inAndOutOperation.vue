<template>
  <application :formData="formData" :form="form" :rules="rules" goBackUrl="/inAndOutOperation/putInOperation" :handleSubmit="handleSubmit">
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
          disabled
          placeholder="输入入库记录人"
          v-model="form.inHandlingPerson"
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
  import inWareHose from '@/apollo/mutations/ioRecord/inWareHose.gql'

  export default {
    components: {
      application
    },
    data() {
      return {
        ids: [],
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
        }
      }
    },
    created() {
      console.log(this.$route.query.id)
      this.ids = JSON.parse(this.$route.query.id)
    },
    methods: {
      async handleSubmit(formData, next) {
        const date = (new Date).toISOString()
        // await this.$store.dispatch('inWareHose/updateData', { ...data, inTime: date, id: this.$route.params.id })
        console.log(formData)
        console.log(this.ids)
        let arg = this.ids.map(id => {
          return {
            entityId: id,
            recordPerson: formData.inRecordPerson,
            handlingPerson: formData.inHandlingPerson
          }
        })


        let { data } = await this.$apolloProvider.defaultClient.mutate({
          mutation: inWareHose,
          variables: { input: arg }
        })

        next()
      },
    },
    computed: {
      ...mapState('user', ['userInfo'])
    },
    mounted() {
      this.form.inHandlingPerson = this.userInfo.employeeId
    }
  }
</script>

<style scoped>

</style>
