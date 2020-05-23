<template>
  <a-form-model
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :rules="rules"
    ref="selfInfoEditForm"
  >
    <a-form-model-item label="邮箱" prop="mail">
      <a-input v-model="form.mail" placeholder="请输入邮箱(可选)" />
    </a-form-model-item>
    <a-form-model-item label="密码" prop="password1" >
      <a-input-password v-model="form.password" placeholder="输入新的密码(可选)" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        修改
      </a-button>
      <nuxt-link to="/">
        <a-button style="margin-left: 10px;">
          取消
        </a-button>
      </nuxt-link>
    </a-form-model-item>
  </a-form-model>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapState } from 'vuex'

  export default Vue.extend({
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {
          password: '',
          mail: '',
        },
        rules: {
          password: [
            { required: false, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度需在6-16之间', trigger: 'blur' } // TODO 密码长度
          ],
          mail: [
            { required: false, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱格式' }
          ]
        }
      };
    },
    methods: {
      onSubmit() {
        this.$refs.selfInfoEditForm.validate(valid => {
          if (!valid) {
            return false
          }
          let userInfo = {};
          Object.assign(userInfo, this.userInfo);
          let toUpdate = {};
          if(this.form.password !== ''){
            toUpdate['password'] = this.form.password,
            userInfo['password'] = this.form.password
          }
          if(this.form.mail !== '') {
            toUpdate['mail'] = this.form.mail
            userInfo['mail'] = this.form.mail
          }
          
          this.$store.dispatch('user/updateData', {
            ...toUpdate,
            id: userInfo.id
          });
          this.$message.success('修改成功');
          this.$store.commit('user/setUserInfo', userInfo);
          this.$router.push('/');
        });
      }
    },
    computed: {
      ...mapState('user', ['userInfo'])
    }
  })
</script>
