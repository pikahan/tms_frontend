<template>
  <div :style="{display: 'inline-block'}">
    <a-button @click="showModal">
      <a-icon type="upload" />{{ type === 'update' ? '批量修改' : '批量新增' }}
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

          <a-button style="margin-top: 12px" type="primary" @click="download">下载模板</a-button>
        </div>
      </div>
      <h3>2.上传文件</h3>
      <p>文件格式支持.xlsx .xls .csv ; 每个工作表的数据都会被读取, 注意保持文件格式正确</p>
      <a-upload
        class="inline-btn"
        name="file"
        @change="handleUploadChange"
        :showUploadList="false"
      >
        <a-button  :style="{ margin: '0px 0px 10px' }"> <a-icon type="upload" />{{ type === 'update' ? '批量修改' : '批量新增' }}</a-button>
      </a-upload>
      <a-upload
        name="file"
        class="inline-btn"
        @change="handleUploadChangeWithAnalysis"
        :showUploadList="false"
      >
        <a-button  :style="{ margin: '0px 10px 10px' }"> <a-icon type="upload" />分析上传模式 </a-button>
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
  import {readWorkbookFromLocalFile, downloadExcel, readWorkbookFromLocalFileAsync} from '@/util/excel'

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
        if (this.type === 'update' && this.updateData.length === 0) {
          this.$message.error({ content: '请在点击需要修改的项前面的多选框' })
          return
        }
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
            this.uploadCallback(data, this.storeName, this, this.type)
          }, this, async () => { await this.finalFn(); this.visible = false})
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      async handleUploadChangeWithAnalysis(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          await readWorkbookFromLocalFileAsync(info.file.originFileObj, async (uploadedData, index) => {
            this.analysisUploadCallback(uploadedData, index, this, this.type)
          }, this, async () => { await this.finalFn(); this.visible = false})
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      download() {
        console.log(this.type)
        if (this.type === 'update') {
          console.log([...this.excelTitle, ...this.updateData], '模板.xlsx')
          downloadExcel([...this.excelTitle, ...this.updateData], '模板.xlsx')
        } else {
          downloadExcel(this.excelTitle, '模板.xlsx')
        }
      }
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
        default: (info, storeName, ctx, type='create') => {console.log(`${storeName}${type === 'create' ? '/createMultipleData' : '/updateMultipleData'}`);console.log(info);ctx.$store.dispatch(`${storeName}${type === 'create' ? '/createMultipleData' : '/updateMultipleData'}`, info)}
      },
      analysisUploadCallback: {
        type: Function,
        default: (info, index, ctx, type='create') => ctx.$store.dispatch(`${storeName}${type === 'create' ? '/createData' : '/updateData'}`, info)
      },
      storeName: {
        type: String,
        default: 'user'
      },
      type: {
        type: String,
        default: 'create'
      },
      updateData: {
        type: Array,
        default: () => []
      },
      finalFn: {
        type: Function,
        default: () => {
          this.$message.success(`成功`);
        }
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

  .inline-btn {
    display: inline-block;
  }

</style>
