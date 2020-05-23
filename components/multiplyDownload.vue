<template>
  <div :style="{display: 'inline-block'}">
    <a-button @click="showModal">
      <a-icon type="download" />批量新增
    </a-button>
    <a-modal
      title="批量上传"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <h3>1.下载模板</h3>
      <p>下载模板后, 根据页面中的填写说明填写相关数据项。</p>
      <div>
        <h4>模板填写说明</h4>
        <div class="model-wrapper">
          <a-row class="model-row" style="background-color: #f7f8fb">
            <a-col :span="5">属性名</a-col>
            <a-col :span="5">属性值</a-col>
            <a-col :span="4">类型</a-col>
            <a-col :span="10">填写说明</a-col>
          </a-row>
          <a-row class="model-row"  v-for="data in tipList" :key="data.name">
            <a-col :span="5">{{ data.name }}</a-col>
            <a-col :span="5">{{ data.value }}</a-col>
            <a-col :span="4">{{ data.type }}</a-col>
            <a-col :span="10">
              <span v-if="typeof data.required !== 'undefined' && data.required" style="color: rgba(255,67,63,0.65)">必填项 </span>
              {{ data.explanation }}
            </a-col>
          </a-row>

          <a-button style="margin-top: 12px" type="primary" @click="downloadExcel(excelTitle, '模板.xlsx')">下载模板</a-button>
        </div>
      </div>
      <h3>2.上传文件</h3>
      <p>文件格式支持.xlsx .xls .csv ; 每个工作表的数据都会被读取, 注意保持文件格式正确</p>
      <a-upload
        name="file"
        @change="handleUploadChange"
      >
        <a-button  :style="{ margin: '0px 0px 10px' }"> <a-icon type="upload" />批量新增 </a-button>
      </a-upload>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          返回
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import ACol from 'ant-design-vue/es/grid/Col'
  import {readWorkbookFromLocalFile, downloadExcel} from '@/util/excel'

  export default {
    name: 'multiplyDownload',
    components: {ACol},
    data() {
      return {
        ModalText: '批量上传',
        visible: false,
        confirmLoading: false,
      }
    },
    methods: {
      showModal() {
        console.log('visible')
        this.visible = true;
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false;
      },
      handleUploadChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          readWorkbookFromLocalFile(info.file.originFileObj, data => {
            this.$store.uploadCallback(data, this.storeName, this)
          }, this)
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      downloadExcel
    },
    computed: {
      excelTitle() {
        return [this.tipList.map(item => item.value)]
      }
    },
    props: {
      tipList: {
        type: Array,
        default: []
      },
      uploadCallback: {
        type: Function,
        default: (info, storeName, ctx) => ctx.$store.dispatch(storeName + '/createMultipleData', info)
      },
      storeName: {
        type: String,
        default: 'user'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .model-wrapper {
    margin-bottom: 20px;
  }

  .model-row {
    border-top: 1px solid rgba(0, 0, 0, .1);
    border-left: 1px solid rgba(0, 0, 0, .1);
    border-right: 1px solid rgba(0, 0, 0, .1);
  }

  .model-row > div  {
    line-height: 30px;
    padding-left: 8px;

    border-right: 1px solid rgba(0, 0, 0, .1);
    border-bottom: 1px solid rgba(0, 0, 0, .1);

    &:last-child {
      border-right: none;
    }
  }

</style>
