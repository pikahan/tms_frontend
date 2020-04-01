<template>
  <application :formData="formData">
    <template v-slot:first>
      <a-form-model-item >
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
            title: '填写申请信息'
          }],
          [{
            title: '验证'
          }],
          [{
            title: '成功'
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
  .steps-content {
    margin-top: 16px;
    min-height: 200px;
    /*text-align: center;*/
    padding-top: 80px;
  }

  .steps-action {
    margin-top: 24px;
  }

  .steps-content {
    position: relative;
    max-width: 600px;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 40px 0;
    margin-top: 40px;
  }

</style>
