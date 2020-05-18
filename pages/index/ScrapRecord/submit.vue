<template>
  <application :formData="formData" :form="form" :rules="rules" :handleSubmit="handleSubmit"  goBackUrl="/scrapRecord">
    <template v-slot:first>
      <a-form-model-item  label="申请人" prop="proposer"  >
        <a-input
          v-model="form.proposer"
          :disabled="true"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="夹具" prop="apparatusEntityId" >
        <a-select
          show-search
          v-model="form.apparatusEntityId"
          option-filter-prop="name"
          :filter-option="filterOption"
          placeholder="Select a person"
        >

          <a-select-option v-for="item in filterApparatusEntityData" :key="item.id" :value="item.id">
            {{item.def.name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item  label="原因" prop="reason"  >
        <a-input
          placeholder="输入原因"
          v-model="form.reason"
          type="textarea"
        >
        </a-input>
      </a-form-model-item>
    </template>
  </application>
</template>
<script>
  import application from '@/components/application'
  import ApparatusType from '@/components/apparatusType'
  import { base64ToUint8Array } from '@/util/helper'
  import { mapGetters } from 'vuex'
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  export default {
    components: {
      ApparatusType,
      application
    },
    data() {
      return {
        form: {
          apparatusEntityId: '',
          reason: '',
          proposer: '',
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['proposer', 'apparatusEntityId', 'reason']
          },
          {
            title: '成功提交申请'
          }
        ],
        rules: {
          apparatusEntityId: [{ required: true, message: '请输入物品名称!' }],
        },
        loading: false,
      };
    },
    methods: {
      async handleSubmit(data, next) {
        const date = (new Date).toISOString()
        await this.$store.dispatch('scrapRecord/createData', {...data, applicationTime: date, status: '申请中'})
        next()

      },
      filterOption(input, option) {
        console.log(option)
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },

    },
    computed: {
      // ...mapState('apparatusDef', ['data']),
      ...mapGetters('apparatusEntity', ['filterApparatusEntityData'])
    },
    async fetch() {
      await this.$store.dispatch('apparatusEntity/fetchData')
    },
    created() {
      console.log(this.$store.state.user.userInfo)
      const { employeeId } = this.$store.state.user.userInfo
      this.form = {...this.form, proposer: employeeId}
    },
  };
</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
