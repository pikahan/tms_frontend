import XLSX from 'xlsx'

///excel导入功能使用：
// 1、首先要安装SheetJs, npm install xlsx --save;
// 2、在需要的文件中引入importExcel.js文件
// 3、参数说明：file是指需要导入的excel文件（会有弹窗选择即可）；colnumData是指对应数据库表的列名与注释组成的集合
// 4、excel的列名称要与数据库表中的注释保持一致
export function importExcel(file,colnumData){
  const types = file.name.split('.').pop();
  let dataList = [];
  const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types);
  if (!fileType) {
    this.$message('格式错误！请重新选择')
    return
  }
  return new Promise(function(resolve,reject){
    file2Xce(file).then(tabJson => {
      if (tabJson && tabJson.length > 0) {
        let columnMapping = colnumData;
        const colnumName = Object.keys(columnMapping);
        let dataArr = tabJson[0].sheet;
        dataArr.forEach(item=>{
          let itemMap = new Map();
          for (let key in item) {
            if(colnumName.includes(key)){
              itemMap.set(columnMapping[key],item[key])
            }else{
              reject(key+"  列名不存在，请核对！");
              return;
            }
          }
          dataList.push(itemMap);
        });
        resolve(map2json(dataList));
      }else{
        reject("EXCEL文件没有数据！")
      }
    })
  })
}

function file2Xce(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader()
    reader.onload = function(e) {
      const data = e.target.result
      this.wb = XLSX.read(data, {
        type: 'binary'
      })
      const result = []
      this.wb.SheetNames.forEach((sheetName) => {
        result.push({
          sheetName: sheetName,
          sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
        })
      })
      resolve(result)
    }
    reader.readAsBinaryString(file.raw)
  })
}

function map2json (list) {
  let datalist = [];
  list.forEach(element => {
    let json = {};
    for(let [k,v] of element){
      json[k]=v;
    }
    datalist.push(json);
  });
  return datalist;
}

function asciiToChar(ascii) {
  return String.fromCharCode(ascii)
}

function charToAscii(char) {
  return char.charCodeAt(0)
}

async function formatExcelData(workbook) {
  const sheetNames = Object.keys( workbook.Sheets)
  const ret = []
  sheetNames.forEach(sheetName => {
    const currSheet = workbook.Sheets[sheetName]
    const cells = currSheet[`!ref`].split(':')
    const [endChar, rowLength] = cells[1]
    const Aascii = charToAscii('A')
    const endCharAscii = charToAscii(endChar)
    const columnLength = endCharAscii - Aascii + 1

    for (let i = 2; i <= rowLength; i++) {
      const data = {}

      for (let j = 0; j < columnLength; j++) {
        const columnName = currSheet[asciiToChar(Aascii+j) + '1'].v
        data[columnName] = currSheet[asciiToChar(Aascii+j) + i].v
      }
      ret.push(data)
    }
  })
  return ret
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function formatExcelDataAsync(workbook, callback) {
  const sheetNames = Object.keys( workbook.Sheets)
  const ret = []
  sheetNames.forEach(async sheetName => {
    const currSheet = workbook.Sheets[sheetName]
    const cells = currSheet[`!ref`].split(':')
    const [endChar, rowLength] = cells[1]
    const Aascii = charToAscii('A')
    const endCharAscii = charToAscii(endChar)
    const columnLength = endCharAscii - Aascii + 1

    for (let i = 2; i <= rowLength; i++) {
      const data = {}
      console.log(currSheet)
      for (let j = 0; j < columnLength; j++) {
        const columnName = currSheet[asciiToChar(Aascii+j) + '1'].v
        const itemData = currSheet[asciiToChar(Aascii+j) + i]
        data[columnName] = typeof itemData !== 'undefined' ? itemData.v : undefined
      }

      await callback(data, i)
      ret.push(data)
    }
  })
  return ret
}

function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  return blob;
}

export const readWorkbookFromLocalFile = (file, callback, ctx, finalFn) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const data = e.target.result
    const workbook = XLSX.read(data, {type: 'binary'})

    const formattedData = await formatExcelData(workbook)
    if (callback) callback.call(ctx, formattedData)
    console.log(finalFn)
    await finalFn.call(ctx)
  }
  reader.readAsBinaryString(file)
}


export const  readWorkbookFromLocalFileAsync = (file, callback, ctx, finalFn) => {
  const reader = new FileReader()
  reader.onload =  async (e) => {
    console.log(e)
    const data = e.target.result
    const workbook = XLSX.read(data, {type: 'binary'})

    await formatExcelDataAsync(workbook, callback.bind(ctx))
    await finalFn.call(ctx)
  }
  reader.readAsBinaryString(file)
}

function arrayToExcel(arr) {
  const sheet = XLSX.utils.aoa_to_sheet(arr)
  return sheet2blob(sheet)
}

function openDownloadDialog(url, saveName) {
  if(typeof url == 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if(window.MouseEvent) {
    event = new MouseEvent('click')
  } else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

export function downloadExcel(arr, fileName) {
  return openDownloadDialog(arrayToExcel(arr), fileName)
}
