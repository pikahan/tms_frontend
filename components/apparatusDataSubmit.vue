<template>
  <application :formData="formData" :form="form" :rules="rules" :handleSubmit="handleSubmit"  goBackUrl="/apparatusData">
    <template v-slot:first>
      <a-form-model-item  label="序列号" prop="seqId" >
        <a-input-number
          :min="1"
          :style="{width: '100%'}"
          placeholder="输入序列号"
          v-model="form.seqId"
        />
      </a-form-model-item>
      <a-form-model-item  label="夹具定义" prop="defId" >
        <a-select
          show-search
          v-model="form.defId"
          option-filter-prop="name"
          :filter-option="filterOption"
          placeholder="选择夹具定义"
        >

          <a-select-option v-for="item in data" :key="item.id" :value="item.id">
            {{item.name}}
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
    </template>
  </application>
</template>
<script>
  import application from '@/components/application'
  import ApparatusType from '@/components/apparatusType'
  import { base64ToUint8Array, arrayBufferToBase64 } from '@/util/helper'
  import gqlQuery from '@/apollo/queries/apparatusEntity'
  import { mapGetters, mapState } from 'vuex'
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
          seqId: '',
          defId: '',
          picture: '',
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['seqId', 'apparatusDefId', 'picture']
          },
          {
            title: '成功提交申请'
          }
        ],
        rules: {
          seqId: [{ required: true, message: '请输入物品ID!' }],
          apparatusDefId: [{ required: true, message: '请选择夹具定义!' }],
        },
        loading: false,
        imageUrl: ''
      };
    },
    methods: {
      async handleSubmit(data, next) {
        const date = (new Date).toISOString()
        if (this.pageType === 'add') { // create
          await this.$store.dispatch('apparatusEntity/createData', {...data, regDate: date, status: '在库'})
        } else { // update
          await this.$store.dispatch('apparatusEntity/updateData', {...data, id: this.$route.params.id*1})
        }
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
      ...mapState('apparatusDef', ['data']),
      pageType() {
        return typeof this.$route.params.id === 'undefined' ? 'add' : 'update'
      }
      // ...mapGetters('apparatusEntity', ['filterApparatusEntityData'])
    },
    async fetch() {
      await this.$store.dispatch('apparatusDef/fetchData')
    },
    mounted() {
      const id = this.$route.params.id
      if (id) { // update page
        this.$apolloProvider.defaultClient.query({
          query: gqlQuery,
          variables: { input: this.$route.params.id}
        })
          .then(({ data }) => {
            const apparatusEntity = data.apparatusEntity
            this.form = {
              seqId: apparatusEntity.seqId,
              defId: apparatusEntity.defId,
              picture: apparatusEntity.picture,
            }
            this.imageUrl = `data:image/png;base64,${apparatusEntity.picture.length ? arrayBufferToBase64(apparatusEntity.picture):''}`
          })
          .catch(e => {
            console.log(e)
          })

      }
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

