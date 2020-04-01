<template>
  <div class="login-form-wrapper">
    <h1 class="title">工夹具全寿命智能管理系统</h1>
    <a-form
      :form="form"
      class="login-form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
          'userName',
          { rules: [{ required: true, message: '请输入你的账号!' }] },
        ]"
          placeholder="账号"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入你的密码!' }] },
        ]"
          type="password"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item has-feedback>
        <a-select
          v-decorator="[
          'select',
          { rules: [{ required: true, message: '请选择workcell!' }] },
        ]"
          placeholder="请选择你的workcell"
        >
          <a-select-option value="china">
            China
          </a-select-option>
          <a-select-option value="usa">
            U.S.A
          </a-select-option>
        </a-select>
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          },
        ]"
        >
          记住密码
        </a-checkbox>
        <a class="login-form-forgot" href="">
          忘记密码
        </a>
        <a-button type="primary" html-type="submit" class="login-form-button">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>

</template>

<script>
  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    methods: {
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
<style>
  body {
    background: #eef0f4;
  }
</style>
<style lang="scss" scoped>
  .login-form-wrapper {
    display: inline-block;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 40px 0;
    margin-top: 40px;
    border-radius: 10px;
    background: white;
  }

  .title {
    margin-bottom: 20px;
    text-align: center;
  }

  .login-form {
    max-width: 400px;
  }
  .login-form-forgot {
    float: right;
  }
  .login-form-button {
    width: 100%;
  }
</style>
