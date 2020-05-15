<template>
  <div>
    <searchPane :search-data="searchData" />
    <nuxt-link to="/userManagement/add">
      <a-button type="primary" :style="{ margin: '0px 0px 10px' }">+ 新增</a-button>
    </nuxt-link>

    <a-upload
      name="file"
      @change="handleChange"
    >
      <a-button  :style="{ margin: '0px 0px 10px' }"> <a-icon type="upload" />批量新增 </a-button>
    </a-upload>


    <a-table :columns="columns" :dataSource="processedUserData">
      <nuxt-link slot="operation" slot-scope="operation" :to="`/usermanagement/modify/${operation.index}`"><a  href="javascript:;">编辑</a></nuxt-link>
    </a-table>
  </div>
</template>

<script>
  import searchPane from '@/components/searchPane'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { mapGetters } from 'vuex'
  import {importExcel} from '@/util/excel'
  import XLSX from 'xlsx'


  function asciiToChar(ascii) {
    return String.fromCharCode(ascii)
  }

  function charToAscii(char) {
    return char.charCodeAt(0)
  }

  function readWorkbookFromLocalFile(file, callback) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const data = e.target.result
      const workbook = XLSX.read(data, {type: 'binary'})
      if (callback) callback(workbook)
      console.log(workbook)
      console.log(workbook.Sheets.Sheet1[`!ref`])

      const sheet = workbook.Sheets.Sheet1

      const cells = workbook.Sheets.Sheet1[`!ref`].split(':')
      // const cellStart = cells[0]
      const cellEnd = cells[1]
      const endChar = cells[1][0]
      const endLine = cells[1][1]


      const Aascii = charToAscii('A')
      const endCharAscii = charToAscii(endChar)

      const columnLength = endCharAscii - Aascii + 1

      const rowLength = endLine
      console.log('column length: ' + columnLength)
      console.log('row length: ' + rowLength)


      const ret = []
      for (let i = 2; i <= rowLength; i++) {
        const data = {}

        for (let j = 0; j < columnLength; j++) {
          const columnName = sheet[asciiToChar(Aascii+j) + '1'].v
          data[columnName] = sheet[asciiToChar(Aascii+j) + i].v
        }
        ret.push(data)

      }

      console.log(ret)
    }
    reader.readAsBinaryString(file)
  }


  //TODO mock数据,之后替换
  const columns = [
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId'},
    { title: 'workcell', dataIndex: 'workcell', key: 'workcell'},
    { title: '用户级别', dataIndex: 'userType', key: 'userType' },
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
          readWorkbookFromLocalFile(info.file.originFileObj)
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
    },
    async fetch () {
      await this.$store.dispatch('user/fetchData')
    }
  }
</script>

<style scoped>

</style>
