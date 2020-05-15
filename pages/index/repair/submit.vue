<template>
  <application :formData="formData" :form="form" :rules="rules" :handleSubmit="handleSubmit"  goBackUrl="/purchase">
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

          <a-select-option v-for="item in filterApparatusEntityData" :key="item.id" :value="item.def.id">
            {{item.def.name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item  label="照片" prop="picture">
        <a-upload
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item  label="描述" prop="description"  >
        <a-input
          placeholder="输入描述"
          v-model="form.description"
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
          description: '',
          proposer: '',
          picture: '',
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['seqId', 'defId', 'location', 'picture']
          },
          {
            title: '成功提交申请'
          }
        ],
        rules: {
          seqId: [{ required: true, message: '请输入物品ID!' }],
          defId: [{ required: true, message: '请输入物品名称!' }],
          location: [{ required: true, message: '请输入产线需要配备的数量!' }],
        },
        loading: false,
        imageUrl: ''
      };
    },
    methods: {
      async handleSubmit(data, next) {
        const date = (new Date).toISOString()
        await this.$store.dispatch('repairRecord/createData', {...data, applicationTime: date, status: '申请中'})
        next()

      },
      filterOption(input, option) {
        console.log(option)
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      },
      handleChange(info) {
        console.log(info)
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => {
            console.log(imageUrl)
            this.imageUrl = imageUrl
            this.form.picture = base64ToUint8Array(imageUrl.split(',')[1])
            this.loading = false
          });
        }
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
