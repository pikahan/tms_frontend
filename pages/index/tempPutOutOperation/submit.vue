<template>
  <application :formData="formData" :form="form" :rules="rules" :handleSubmit="handleSubmit"  goBackUrl="/putOutOperation">
    <template v-slot:first>
      <a-form-model-item  label="出库记录人" prop="outRecordPerson" >
        <a-input
          placeholder="输入出库记录人"
          v-model="form.outRecordPerson"
        />
      </a-form-model-item>
      <a-form-model-item  label="出库记录人" prop="outHandlingPerson" >
        <a-input
          placeholder="输入出库记录人"
          v-model="form.outHandlingPerson"
        />
      </a-form-model-item>
      <a-form-model-item  label="夹具" prop="apparatusEntityId" >
        <a-select
          show-search
          v-model="form.apparatusEntityId"
          option-filter-prop="name"
          :filter-option="filterOption"
          placeholder="Select a person"
        >

          <a-select-option v-for="item in apparatusDefData" :key="item.id" :value="item.id">
            {{item.name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item  label="产线" prop="lineId" >
        <a-select
          show-search
          v-model="form.lineId"
          option-filter-prop="name"
          :filter-option="filterOption"
          placeholder="Select a person"
        >

          <a-select-option v-for="item in lineData" :key="item.id" :value="item.id">
            {{item.name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>

    </template>
  </application>
</template>
<script>
  import application from '@/components/application'
  import ApparatusType from '@/components/apparatusType'
  import { base64ToUint8Array } from '@/util/helper'
  import { mapState } from 'vuex'
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
          outRecordPerson: '',
          outHandlingPerson: '',
          lineId: '',
          apparatusEntityId: '',
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['outRecordPerson', 'outHandlingPerson', 'lineId', 'apparatusEntityId']
          },
          {
            title: '成功提交申请'
          }
        ],
        rules: {
          outRecordPerson: [{ required: true, message: '请输入物品ID!' }],
          outHandlingPerson: [{ required: true, message: '请输入物品名称!' }],
          lineId: [{ required: true, message: '请输入产线需要配备的数量!' }],
          apparatusEntityId: [{ required: true, message: '请输入产线需要配备的数量!' }],
        },
      };
    },
    methods: {
      async handleSubmit(data, next) {
        const date = (new Date).toISOString()
        await this.$store.dispatch('ioRecord/createData', {...data, outTime: date})
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
      ...mapState('apparatusDef', {
        apparatusDefData: 'data'
      }),
      ...mapState('line', {
        lineData: 'data'
      })

    },
    async fetch() {
      console.log('fetch')
      await this.$store.dispatch('apparatusDef/fetchData')
      await this.$store.dispatch('line/fetchData')

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
