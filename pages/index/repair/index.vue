<template>
  <div>
    <searchPane :search-data="searchData" storeTarget="repairRecord/fetchData" />
    <nuxt-link to="/repair/submit">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 提交申请</a-button>
    </nuxt-link>
    <a-upload
      name="file"
      @change="handleUploadChange"
    >
      <a-button  :style="{ margin: '0px 0px 10px' }"> <a-icon type="upload" />批量新增 </a-button>
    </a-upload>
    <a-table :columns="columns" :dataSource="processedRepairRecordData" :scroll="{ x: 1300 }" @change="handleTableChange">
      <a slot="action" slot-scope="text, data" href="javascript:;">
        <div v-if="permission.RepairApplicationProcess && data.status === '申请中'">
          <a-popconfirm placement="topRight" ok-text="同意" cancel-text="拒绝" @confirm="processingApplication(data.id, 'confirm')" @cancel="processingApplication(data.id, 'cancel')">
            <template slot="title">
              <p>是否同意申请?</p>
            </template>
            审批
          </a-popconfirm>
        </div>
        <div>
          <nuxt-link :to="`repair/${data.id}`">
            查看详情
          </nuxt-link>
        </div>
      </a>
      <div slot="applicationTime" slot-scope="text">
        {{ text.slice(0, 4) !== '0001' ? (new Date(Date.parse(text))).toLocaleString() : '-----' }}
      </div>
      <div slot="finishTime" slot-scope="text">
        {{ text.slice(0, 4) !== '0001' ? (new Date(Date.parse(text))).toLocaleString() : '-----' }}
      </div>
      <img class="thumbnail" slot="picture" slot-scope="picture"  :src="`data:image/png;base64,${picture.length ? arrayBufferToBase64(picture):''}`" alt="img">
    </a-table>
  </div>
</template>



<script>
  import searchPane from '@/components/searchPane'
  import { mapGetters, mapState } from 'vuex'
  import { arrayBufferToBase64 } from '@/util/helper'
  import { readWorkbookFromLocalFile, downloadExcel } from '@/util/excel'

  const searchData = [
    {
      label: '申请人',
      name: 'proposer',
      type: 'input',
      placeholder: '请输入申请人',
      option: {}
    },
    {
      label: '申请时间',
      name: 'applicationTimeFrom\tapplicationTimeTo',
      type: 'range',
      placeholder: ['起始时间', '结束时间'],
      option: {}
    },
    {
      label: '处理人',
      name: 'acceptor',
      type: 'input',
      placeholder: '请输入处理人',
      option: {}
    },
    {
      label: '处理时间',
      name: 'acceptorTimeFrom\tacceptorTimeTo',
      type: 'range',
      placeholder: ['起始时间', '结束时间'],
      option: {}
    },
  ]


  const columns = [
    { title: '物品代码', dataIndex: 'code', key: 'code', sorter: true,},
    { title: '申请时间', dataIndex: 'applicationTime', key: 'applicationTime', sorter: true, scopedSlots: { customRender: 'applicationTime' }},
    { title: '修复结果时间', dataIndex: 'finishTime', key: 'finishTime', scopedSlots: { customRender: 'finishTime' } },
    { title: '图片', dataIndex: 'picture', key: 'picture', scopedSlots: { customRender: 'picture' }},
    { title: '故障描述', dataIndex: 'description', key: 'description' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '100px',
      scopedSlots: { customRender: 'action' },
    },
  ];


  export default {
    components: {
      searchPane,
    },
    data() {
      return {
        searchData,
        columns,
        pagination: {},
        loading: false,
      }
    },
    computed: {
      ...mapGetters('repairRecord', ['processedRepairRecordData']),
      ...mapGetters('user', ['permissionMap']),

      ...mapState('user', ['userInfo']),
      permission() {
        // TODO 划分好权限之后更改
        const ret = {}
        this.userInfo.permissions.forEach(permission => {
          ret[permission.name] = permission.value
        })
        return ret
      },

    },
    async fetch() {
      await this.$store.dispatch(`repairRecord/fetchData`)
    },
    methods: {
      arrayBufferToBase64,
      handleUploadChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          readWorkbookFromLocalFile(info.file.originFileObj, data => {
            this.$store.dispatch('repairRecord/createMultipleData', data)
          }, this)
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },

      processingApplication(id, type) {
        let status = '维修中'
        if (type === 'cancel') {
          status = '拒绝申请'
        } else if (type === 'confirm') {
          status = '维修中'
        }
        this.$store.dispatch('repairRecord/updateData', {id, status}).then(() => {
          this.$store.dispatch(`repairRecord/fetchData`)
        })
      },
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.$store.dispatch('repairRecord/fetchData', {variables: {
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
      downloadExcel

    },

  }
</script>

<style scoped>
</style>
