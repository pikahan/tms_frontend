<template>
  <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="工号">
      <a-input v-model="form.employeeId" />
    </a-form-model-item>
    <a-form-model-item label="workcell">
      <a-select v-model="form.workcell" placeholder="please select your workcell">
        <a-select-option v-for="workcell in workcellData" :value="workcell.id" :key="workcell.name">
          {{ workcell.name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="用户职能">
      <a-select v-model="form.userType" placeholder="please select your userType">
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
<script>
  import { mapGetters, mapState } from 'vuex'
  import { fetchDataIn } from '@/util/helper'

  export default {
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {
          employeeId: '',
          userType: '',
          workcell: ''
        },
      };
    },
    methods: {
      onSubmit() {
        console.log('submit!', this.form);
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
          userType: data.userType.id,
          workcell: data.workcellId
        }
      }
    },
    computed: {
      ...mapState('workcell', {
        workcellData: 'data'
      }),
      ...mapState('userType', {
        userTypeData: 'data'
      }),
      // ...mapState('userManagement', ['userData'])
    },
    created() {
      // console.log(this.$store.state.userManagement.userData)
      // console.log(this.$route.params)
      // this.$store.state.user.data, "created" // TODO 之后处理直接访问URL时处理不了的问题

      // update 所以要获取数据并渲染


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
  };
</script>
