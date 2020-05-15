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
