<template>
  <application :formData="formData" :form="form" :rules="rules">
    <template v-slot:first>
      <a-form-model-item  label="物品ID" prop="code" >
        <a-input
          v-model="form.code"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="名称" prop="name"  >
        <a-input
          placeholder="输入名称"
          v-model="form.name"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="点检周期" prop="pMPeriod"  >
        <a-input-number
          :min="1"
          :style="{width: '100%'}"
          placeholder="输入点检周期"
          v-model="form.pMPeriod"
        >
          <!--<a-icon slot="prefix" type="责任人" style="color: rgba(0,0,0,.25)" />-->
        </a-input-number>
      </a-form-model-item>
      <a-form-model-item  label="workcell ID" prop="workcellId"  >
        <a-input
          :disabled="true"
          v-model="form.workcellId"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
      <!--<a-form-model-item  label="录入日期" prop="code"  >-->
        <!--<a-date-picker-->
          <!--v-model="form.recOn"-->
          <!--:disabled="true"-->
          <!--show-time-->
          <!--type="date"-->
          <!--style="width: 100%;"-->
        <!--/>-->
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
      <!--</a-form-model-item>-->
      <a-form-model-item  label="录入人" prop="recBy"  >
        <a-input
          :disabled="true"
          v-model="form.recBy"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="备注" prop="remark"  >
        <a-input
          placeholder="输入备注"
          v-model="form.remark"
          type="textarea"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
    </template>
    <template v-slot:second>
      <apparatus-type :partNoCallback="processType" />
    </template>
  </application>
</template>
<script>
  import application from '@/components/application'
  import ApparatusType from '../../../components/apparatusType'
  // TODO 这个页面之后可能要重构, 先这么写了


  // code
  // name
  // uPL
  // userFor
  // pMPeriod
  // owner
  // workcellId
  // recOn
  // recBy
  // remark
  // familyId
  // models
  // partNos
  // family


  export default {

    components: {
      ApparatusType,
      application
    },
    data() {
      return {
        form: {
          code: '',
          name: '',
          uPL: '',
          userFor: '',
          pMPeriod: '',
          owner: '',
          // recOn: '',
          recBy: '',
          remark: '',
          workcellId: ''
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['code', 'name', 'uPL', 'userFor', 'pMPeriod', 'owner', 'recBy', 'remark']
          },
          {
            title: '夹具类别',
            modelItem: []
          },
          {
            title: '成功提交申请'
          }
        ],
        rules: {
          code: [{ required: true, message: '请输入物品ID!' }],
          name: [{ required: true, message: '请输入物品名称!' }],
          uPL: [{ required: true, message: '请输入产线需要配备的数量!' }],
          userFor: [{ required: true, message: '请输入物品用途!' }],
          pMPeriod: [{ required: true, message: '请输入点检周期!' }],
        }
      };
    },
    created() {
      const { workcellId, employeeId } = this.$store.state.user.userInfo
      this.form = {...this.form, workcellId, recBy: employeeId}
    },
    methods: {
      processType(familyData, modelData, partNoData) {
        console.log(arguments)
      }
    }

  };
</script>
<style scoped>

</style>
