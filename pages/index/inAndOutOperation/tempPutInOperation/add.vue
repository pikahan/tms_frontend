<template>
  <application :formData="formData" :form="form" :rules="rules" goBackUrl="/inAndOutOperation/putOutOperation" :handleSubmit="handleSubmit">
    <template v-slot:first>
      <a-form-model-item  label="经手人" prop="recordPerson" >
        <a-input
          :disable="true"
          placeholder="输入经手人"
          v-model="form.recordPerson"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="记录人" prop="handlingPerson" >
        <a-input
          disabled
          placeholder="输入入库记录人"
          v-model="form.handlingPerson"
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
  import wareHoseGql from '@/apollo/mutations/ioRecord/tempInWareHose.gql'

  export default {
    components: {
      application
    },
    data() {
      return {
        ids: [],
        form: {
          recordPerson: '',
          handlingPerson: '',
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['recordPerson', 'handlingPerson']
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
          recordPerson: [{ required: true, message: '请输入经手人!' }],
        }
      }
    },
    name: 'add',
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
            recordPerson: formData.recordPerson,
            handlingPerson: formData.handlingPerson
          }
        })


        let { data } = await this.$apolloProvider.defaultClient.mutate({
          mutation: wareHoseGql,
          variables: { input: arg }
        })

        next()
      },
    },
    computed: {
      ...mapState('user', ['userInfo'])
    },
    mounted() {
      this.form.handlingPerson = this.userInfo.employeeId
    }
  }
</script>

<style scoped>

</style>
