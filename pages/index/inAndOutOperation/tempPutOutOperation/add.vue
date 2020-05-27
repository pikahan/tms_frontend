<template>
  <application :formData="formData" :form="form" :rules="rules" goBackUrl="/inAndOutOperation/tempPutOutOperation" :handleSubmit="handleSubmit">
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
          placeholder="输入出库记录人"
          v-model="form.handlingPerson"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="使用地点" prop="position" >
        <a-input
          v-model="form.position"
        />

      </a-form-model-item>

      <a-form-model-item  label="备注" prop="remark" >
        <a-radio-group v-model="form.remark">
          <a-radio :value="`维修`">
            维修
          </a-radio>
          <a-radio  :value="`other`">
            其他
            <a-input v-if="form.remark === `other`" :style="{ width: 100, marginLeft: 10 }" v-model="form.more" />
          </a-radio>
        </a-radio-group>
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
  import wareHoseGql from '@/apollo/mutations/ioRecord/tempOutWareHose.gql'

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
          remark: '',
          position: '',
          more: ''
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['recordPerson', 'handlingPerson', 'position', 'remark' ]
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
          position: [{ required: true, message: '请输入使用地点!' }],
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
            handlingPerson: formData.handlingPerson,
            remark: formData.remark === '维修' ? '维修' : formData.more,
            position: formData.position
          }
        })


        let { data } = await this.$apolloProvider.defaultClient.mutate({
          mutation: wareHoseGql,
          variables: { input: arg }
        })

        console.log('page add')
        console.log(data)
        console.log('args')
        console.log(arg)

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
