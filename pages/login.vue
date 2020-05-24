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
          'employeeId',
          { rules: [{ required: true, message: '请输入你的工号!' }] },
        ]"
          placeholder="账号"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item
      >
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
      <a-form-item>
        <a-select
          v-decorator="[
          'workcellId',
          { rules: [{ required: true, message: '请选择workcell!' }] },
        ]"
          placeholder="请选择你的workcell"
        >

          <a-select-option v-for="workcell in workcellData" :value="workcell.id" :key="workcell.name">
            {{ workcell.name }}
          </a-select-option>
        </a-select>
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-form-item>
      <div class="error_message" v-if="passwordState.status === 'error'">{{ passwordState.message }}</div>
      <a-form-item>
        <a class="login-form-forgot" href="">
          忘记密码
        </a>
        <a class="login-form-visitor" @click="login('游客')">
          游客登录
        </a>
        <a-button type="primary" html-type="submit" class="login-form-button">
          登录
        </a-button>
        <a-button html-type="submit" class="login-form-button">
          <nuxt-link to="/initial">创建新的WorkCell</nuxt-link>
        </a-button>
      </a-form-item>
    </a-form>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'normal_login'});
    },
    data() {
      return {}
    },
    computed: {
      ...mapState('workcell', {
        workcellData: 'data'
      }),
      ...mapState('user', ['passwordState'])
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.login()
      },
      login(type) {
        if (type === '游客') {
          let data = {userType: '游客', workcellId: this.form.getFieldValue('workcellId')}
          this.$store.dispatch('user/login', data).then(() => {
            console.log('push')
            this.$router.push('/')
          })
        } else {
          this.form.validateFields((err, values) => {
            if (err) {
              return
            }
            const {remember, ...data} = values
            this.$store.dispatch('user/login', data)
              .then(() => {
                if (this.passwordState.status === 'success') {
                  this.$router.push('/')
                }
              })
          })
        }
      },

    },
    async fetch() {
      await this.$store.dispatch('workcell/fetchData')
    }
  }
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
  .error_message {
    color: #F5222d;
  }

  .title {
    margin-bottom: 20px;
    text-align: center;
  }

  .login-form {
    max-width: 400px;
  }

  .login-form-visitor {
    float: left;
    margin-right: 10px;
  }
  .login-form-forgot {
    float: right;
  }
  .login-form-button {
    width: 100%;
  }
</style>
