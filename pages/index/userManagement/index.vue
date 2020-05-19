<template>
  <div>
    <searchPane :search-data="searchData" />
    <nuxt-link to="/userManagement/add">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 新增</a-button>
    </nuxt-link>
    <multiplyDownload
      :uploadCallback="handleUploadCallback"
      :tipList="[
      { name: '工号', value: 'employeeId', type: '文字', explanation: '用户工号', required: true  },
      { name: 'workcell Id', value: 'workcellId', type: '数字', explanation: 'workcell的id号', required: true },
      { name: '用户类别Id', value: 'typeId', type: '数字', explanation: '用户类别的id号', required: true }]"
    />

    <!--<a-col :span="6">{{ data.name }}</a-col>-->
    <!--<a-col :span="6">{{ data.type }}</a-col>-->
    <!--<a-col :span="12">{{ data.explanation }}</a-col>-->

    <a-table :columns="columns" :dataSource="processedUserData">
      <nuxt-link slot="operation" slot-scope="operation" :to="`/usermanagement/modify/${operation.index}`"><a  href="javascript:;">编辑</a></nuxt-link>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { mapGetters } from 'vuex'
  import { readWorkbookFromLocalFile } from '@/util/excel'
  import multiplyDownload from '@/components/multiplyDownload'

  const columns = [
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId'},
    { title: 'workcell', dataIndex: 'workcell', key: 'workcell'},
    { title: '用户级别', dataIndex: 'userType', key: 'userType' },
    { title: '邮箱', dataIndex: 'mail', key: 'mail' },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '100px',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  export default {
    components: {
      searchPane,
      multiplyDownload
    },
    data() {
      return {
        searchData,
        columns,
      }
    },
    computed: mapGetters('user', ['processedUserData']),
    methods: {
      handleChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          readWorkbookFromLocalFile(info.file.originFileObj, data => {
            this.$store.dispatch('user/createMultipleData', data)
          }, this)
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      handleUploadCallback(info) {
        this.$store.dispatch('user/createMultipleData', info)

      }
    },
    async fetch () {
      await this.$store.dispatch('user/fetchData')
    }
  }
</script>

<style scoped>

</style>
