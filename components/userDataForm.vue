<template>
  <a-form-model
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :rules="rules"
    ref="userForm"
  >
    <a-form-model-item label="工号" prop="employeeId">
      <a-input v-model="form.employeeId" />
    </a-form-model-item>
    <a-form-model-item label="密码" prop="password" v-if="isCreatePage()" >
      <a-input v-model="form.password" />
    </a-form-model-item>
    <a-form-model-item label="workcell" prop="workcellId">
      <a-select v-model="form.workcellId" placeholder="please select your workcell">
        <a-select-option v-for="workcell in workcellData" :value="workcell.id" :key="workcell.name">
          {{ workcell.name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="用户职能" prop="userTypeId">
      <a-select v-model="form.userTypeId" placeholder="please select your userType">
        <a-select-option v-for="userType in userTypeData" :value="userType.id" :key="userType.name">
          {{ userType.name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        {{ typeof this.$route.params.id === 'undefined' ? '创建' : '修改' }}
      </a-button>
      <a-button style="margin-left: 10px;">
        取消
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import { fetchDataIn } from '@/util/helper'

  export default Vue.extend({
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {
          employeeId: '',
          userTypeId: '',
          workcellId: '',
          password: ''
        },
        rules: {
          employeeId: [
            { required: true, message: '请输入工号', trigger: 'blur' } // TODO 非法字符输入
          ],
          workcellId: [
            { required: true, message: '请选择workcell', trigger: 'change' }
          ],
          userTypeId: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度需在6-16之间', trigger: 'blur' } // TODO 密码长度
          ]
        }
      };
    },
    methods: {
      onSubmit() {
        this.$refs.userForm.validate(valid => {
          if (!valid) {
            return false
          }

          if (this.isCreatePage()) {
            this.createData()
          } else { // 修改页面
            this.updateData()
          }

        });
      },
      async setUserData() {
        if (typeof this.$route.params.id === 'undefined') {
          return
        }

        let index = this.$route.params.id*1
        if (typeof this.$store.state.user.data[index] === 'undefined') {
          return
        }

        let data = this.$store.state.user.data[index]
        this.form = {
          employeeId: data.employeeId,
          userTypeId: data.userType.id,
          workcellId: data.workcellId
        }
      },
      isCreatePage() {
        console.log(typeof this.$route.params.id === 'undefined') // TODO 之后更改逻辑
        return typeof this.$route.params.id === 'undefined'
      },
      async createData() {
        console.log('create')
        await this.$store.dispatch('user/createData', this.form)
      },
      async updateData() {
        await this.$store.dispatch('user/updateData', {
          data: this.form,
          index: this.$route.params.id
        })
      }
    },
    computed: {
      ...mapState('workcell', {
        workcellData: 'data'
      }),
      ...mapState('userType', {
        userTypeData: 'data'
      }),
    },
    created() {
    },
    mounted() {
      if (typeof this.$route.params.id !== 'undefined') {
        let index = this.$route.params.id
      }
    },
    async fetch() {
      const fetchDataFor = fetchDataIn(this)
      await fetchDataFor('userType')
      await fetchDataFor('workcell')
      await fetchDataFor('user')
      this.setUserData()
    }
  })
</script>
