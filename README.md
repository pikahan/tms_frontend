# 捷普工夹具全寿命智能管理系统

> 工夹具出入库以及维修的业务管理, 对Word文档的解析以实现批量修改, 工夹具寿命的智能分析数据展示以及预警。



## 技术栈简介
Vue、Vuex、Vue Router、WebSocket、Vue Apollo(GraphQL)、TypeScript、WebPack

## 技术难点及解决
对Word文档的解析以实现批量修改、新增数据的功能; 通过WebSocket连接服务器实现模型训练数据的日志展示; 使用基于Token的鉴权模式, 不同的登录人员拥有不同的业务操作权限; 使用对搜索候选项的节流, 分页查询数据等方式优化性能

## 页面展示

### 移动端页面
![移动端页面](./mobile.jpg)

### Excel模板下载与上传
![Excel模板下载与上传](./model1.jpg)

### 批量删除
![批量删除](./mul_del.jpg)

### 信息展示
![信息展示](./pic2.jpg)
![信息展示](./pic1.jpg)

### WebSocket实时显示训练数据
![WebSocket实时显示训练数据](./websocket.jpg)


## 运行方式

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```
