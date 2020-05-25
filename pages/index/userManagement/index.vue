<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="user/fetchData" />
    <nuxt-link to="/userManagement/add">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 新增</a-button>
    </nuxt-link>
    <a-button type="primary" :style="{ margin: '0px 0px 10px' }" @click="handleDelete" :disabled="selectedRowKeys.length === 0">- 删除</a-button>

    <multiplyDownload
      storeName="user"
      :analysisUploadCallback="mulAddCb"
      :finalFn="finalCb"
      :tipList="[
      { name: '工号', value: 'employeeId', type: '文本', explanation: '用户工号', required: true  },
      { name: '密码', value: 'password', type: '文本', explanation: '用户密码', required: true  },
      { name: 'workcell Id', value: 'workcellId', type: '数字', explanation: 'workcell的id号', required: true },
      { name: '用户类别Id', value: 'userTypeId', type: '数字', explanation: '用户类别的id号', required: true },
      { name: '邮箱', value: 'mail', type: '邮箱格式', explanation: '用户邮箱', required: true }]"
    />
    <multiplyDownload
      :finalFn="finalCb"
      storeName="user"
      type="update"
      :updateData="dataMapper"
      :analysisUploadCallback="mulUpDateCb"
      :tipList="updateTipList"
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
  import mutation from '@/apollo/mutations/user/createOne.gql'
  import mulUpDateGql from '@/apollo/mutations/user/updateOne.gql'
  import GQLemployee from '@/apollo/queries/GQLemployee.gql'


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
      type: 'selectInput',
      placeholder: '请输入工号',
      option: {},
      handleSearch: async function (value) {
        let { data } = await this.$apolloProvider.defaultClient.query({
          query: GQLemployee,
          variables: { employeeId: value}
        })
        return {result: data.users.payload.map(item => item.employeeId)}
      }
    },
    {
      label: '用户级别',
      name: 'userTypeId',
      type: 'select',
      placeholder: '请选择用户级别',
      option: {},
      selectOption: [{content: 'Operator I', value: 1}, {content: 'Operator II', value: 2}, {content: 'Admin', value: 3}, {content: 'Supervisor', value: 4}, {content: 'Manager', value: 5}]
    },

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
        selectedRowRows: [],
        updateTipList: [
          { name: 'ID', value: 'id', type: '数字', explanation: '用户ID', required: true },
          { name: '工号', value: 'employeeId', type: '文本', explanation: '用户工号' },
          { name: '密码', value: 'password', type: '文本', explanation: '用户密码' },
          { name: 'workcell Id', value: 'workcellId', type: '数字', explanation: 'workcell的id号' },
          { name: '用户类别Id', value: 'userTypeId', type: '数字', explanation: '用户类别的id号'},
          { name: '邮箱', value: 'mail', type: '邮箱格式', explanation: '用户邮箱' }]
      }
    },
    computed: {
      ...mapGetters('user', ['processedUserData', 'permissionMap']),
      dataMapper() {

        return this.selectedRowRows.map(rows => {
          let ret = []
          this.updateTipList.forEach(data => {
            const key = data.value
            ret.push(rows[key])
          })
          return ret
        })
      }
    },
    methods: {
      handleChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          readWorkbookFromLocalFile(info.file.originFileObj, data => {
            this.$store.dispatch('user/createMultipleData', data)
          }, this)
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      onSelectChange(selectedRowKeys, selectedRowRows) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRowRows = selectedRowRows
      },
      handleUploadCallback(info) {
        this.$store.dispatch('user/createMultipleData', info)
      },
      async handleDelete() {
        await this.$store.dispatch('user/deleteAllData', this.selectedRowKeys)
        await this.$store.dispatch('user/fetchData')
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
      },
      async mulAddCb(uploadedData, index) {
        try {
          console.log(uploadedData)
          let { data } = await this.$apolloProvider.defaultClient.mutate({
            mutation,
            variables: { input: uploadedData}
          })
        } catch (e) {
          this.$message.error({ content: `第${index-1}条数据创建失败, 所在位置为第${index}行`  })
        }
      },
      async mulUpDateCb(uploadedData, index) {
        try {
          console.log(uploadedData)
          let { data } = await this.$apolloProvider.defaultClient.mutate({
            mutation: mulUpDateGql,
            variables: { input: uploadedData}
          })
          if(data.updateUser.success === false) {
            this.$message.error({ content: `第${index-1}条数据更新失败, 所在位置为第${index}行`  })
          } else {
            this.$message.success({ content: `第${index-1}条数据更新成功, 所在位置为第${index}行`  })
          }
        } catch (e) {
          this.$message.error({ content: `第${index-1}条数据更新失败, 所在位置为第${index}行`  })
        }
      },

      async finalCb() {
        await this.$message.success({content: '成功!'})
        await this.fetch()
      },

      async fetch() {
        await this.$store.dispatch('user/fetchData')
      }
    },
    async fetch () {
      await this.$store.dispatch('user/fetchData')
    }
  }



</script>

<style scoped>

</style>
