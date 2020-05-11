<template>
  <application :formData="formData" :form="form" :rules="rules">
    <template v-slot:first>
      <a-form-model-item  label="领用人" prop="current" >
        <a-input
          :disabled="true"
          v-model="form.user"
        >
          <!--TODO 之后要把current改了-->
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="物品ID" prop="code" >
        <a-input
          placeholder="账号"
          v-model="form.code"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
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
  //TODO 这个页面之后可能要重构, 先这么写了
  export default {

    components: {
      application
    },
    data() {
      return {
        form: {
          user: 'hello',
          code: '',
          validate: ''
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

  };
</script>
<style scoped>

</style>
