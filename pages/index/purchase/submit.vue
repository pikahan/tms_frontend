<template>
  <application :formData="formData">
    <template v-slot:first>
      <a-form-model-item  label="领用人" >
        <a-input
          v-decorator="[
          'person'
        ]"
          :disabled="true"
          placeholder="账号"
          v-model="current"
        >
          <!--TODO 之后要把current改了-->
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="物品ID" >
        <a-input
          v-decorator="[
          'objectId',
          { rules: [{ required: true, message: '请输入物品ID!' }] },
        ]"
          placeholder="账号"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
    </template>
    <template v-slot:second>
      <a-form-model-item >
        <a-input
          v-decorator="[
          'userName1',
          { rules: [{ required: true, message: '请放入你的员工卡!' }] },
        ]"
          placeholder="验证"
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
    // beforeCreate() {
    //   this.form = this.$form.createForm(this, { name: 'repair' });
    // },
    components: {
      application
    },
    data() {
      return {
        current: 0,
        formData: [
          [{
            title: '基础信息'
          }],
          [{
            title: '详细详细'
          }],
          [{
            title: '成功提交申请'
          }]
        ],
      };
    },
    methods: {
      next() {
        this.current++;
      },
      prev() {
        this.current--;
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
    },

  };
</script>
<style scoped>

</style>
