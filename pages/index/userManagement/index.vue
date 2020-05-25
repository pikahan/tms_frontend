<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="user/fetchData" />
    <nuxt-link to="/userManagement/add">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 新增</a-button>
    </nuxt-link>
    <a-button type="primary" :style="{ margin: '0px 0px 10px' }" @click="handleDelete">- 删除</a-button>

    <multiplyDownload
      :storeName="user"
      :tipList="[
      { name: '工号', value: 'employeeId', type: '文本', explanation: '用户工号', required: true  },
      { name: '密码', value: 'password', type: '文本', explanation: '用户密码', required: true  },
      { name: 'workcell Id', value: 'workcellId', type: '数字', explanation: 'workcell的id号', required: true },
      { name: '用户类别Id', value: 'uesrTypeId', type: '数字', explanation: '用户类别的id号', required: true },
      { name: '邮箱', value: 'mail', type: '邮箱格式', explanation: '用户邮箱', required: true }]"
    />
    <a-table :columns="columns"
             :dataSource="processedUserData"
             rowKey="id"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
             @change="handleTableChange"
    >
      <nuxt-link slot="operation" slot-scope="operation" :to="`/usermanagement/modify/${operation.index}`"><a  href="javascript:;">编辑</a></nuxt-link>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters } from 'vuex'
  import { readWorkbookFromLocalFile, readWorkbookFromLocalFileAsync } from '@/util/excel'
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

  const searchData = [
    {
      label: '工号',
      name: 'employeeId',
      type: 'input',
      placeholder: '请输入工号',
      option: {}
    },

    {
      label: '用户级别',
      name: 'userTypeId',
      type: 'select',
      placeholder: '请选择用户级别',
      option: {},
      selectOption: [{content: 'Operator I', value: 1}, {content: 'Operator II', value: 2}, {content: 'Admin', value: 3}, {content: 'Supervisor', value: 4}, {content: 'Manager', value: 5}]
    }
  ]



  export default {
    components: {
      searchPane,
      multiplyDownload
    },
    data() {
      return {
        searchData,
        columns,
        selectedRowKeys: [],
      }
    },
    computed: mapGetters('user', ['processedUserData', 'permissionMap']),
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
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
      },
      handleUploadCallback(info) {
        this.$store.dispatch('user/createMultipleData', info)
      },
      async handleDelete() {
        await this.$store.dispatch('user/deleteAllData', this.selectedRowKeys)

      },
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('user/fetchData', {variables: {
            pageSize: pagination.pageSize,
            pageIndex: pagination.current,
            orderBy: sorter.field,
            orderByType: sorter.order === 'ascend' ? 'asc' : 'desc',
            ...filters,
          }})

        console.log({
          pageSize: pagination.pageSize,
          pageIndex: pagination.current,
          orderBy: sorter.field,
          orderByType: sorter.order === 'ascend' ? 'asc' : 'desc',
          ...filters,
        });

      },
    },
    async fetch () {
      await this.$store.dispatch('user/fetchData')
    }
  }
</script>

<style scoped>

</style>
