<template>
  <a-layout id="components-layout-demo-custom-trigger" class="height100">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed" style="height: 100%" class="height100 menu-inline" >
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :selectedKeys="selectedKey" @click="handleMenuClick" >
        <a-menu-item v-for="(menuItem, i) in menuItemList" :key="menuItem.router">
          <nuxt-link :to="menuItem.router">
            <a-icon :type="menuItem.icon" />
            <span>{{ menuItem.name }}</span>
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout
      class="height100"
    >
      <a-layout-header  style="background: #fff; padding: 0;">
        <a-menu theme="dark" mode="horizontal" :selectedKeys="selectedKey" @click="handleMenuClick" class="menu-horizontal" >
          <a-menu-item v-for="(menuItem, i) in menuItemList" :key="menuItem.router">
            <nuxt-link :to="menuItem.router">
              <a-icon :type="menuItem.icon" />
              <span>{{ menuItem.name }}</span>
            </nuxt-link>
          </a-menu-item>
        </a-menu>
        <div class="header_bar"  style="display: flex;justify-content: space-between">
          <div>
            <a-icon
              class="trigger trigger-icon"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="()=> collapsed = !collapsed"
            />
            <a-breadcrumb class="breadcrumb">
              <a-breadcrumb-item ><nuxt-link to="/">Home</nuxt-link></a-breadcrumb-item>
              <a-breadcrumb-item v-for="(name, idx) of breadcrumb" :key="name">
                <nuxt-link :to="'/'+name" v-if="idx != breadcrumb.length - 1">
                  {{ name }}
                </nuxt-link>
                <span v-if="idx == breadcrumb.length - 1">{{name}}</span>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="bar-right">
            <a-dropdown>
              <a style="position: relative">
                <a-avatar :size="22" icon="user" />
              {{ this.$store.state.user.userInfo.employeeId }}
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleLogout">注销</a>
                </a-menu-item>
                <a-menu-item>
                  <nuxt-link to="/selfInfoEdit">修改个人信息</nuxt-link>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px', overflowY: 'scroll', flex: '1' }"
      >
        <div v-if="this.$route.fullPath === '/'">
          <welcome :name="this.$store.state.user.userInfo.employeeId" :info="permissionMap.WarehouseIn ?  `还有${listInfo.length}件未处理的消息, 请及时处理。` : '当前没有新的消息。'" />
          <h3>待处理消息</h3>
          <a-list item-layout="horizontal" :data-source="listInfo" v-if="permissionMap.WarehouseIn">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-list-item-meta
                :description="item.description"
              >
                <nuxt-link :to="item.router" slot="title">
                  {{ item.title }}
                </nuxt-link>
                <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </a-list-item-meta>
            </a-list-item>
          </a-list>
          <div v-else>
            您没有查看处理信息的权限, 请先登录
          </div>
        </div>
        <router-view v-else />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import { mapGetters } from 'vuex'
  import MyStorage from '@/util/storage'
  import permissionsIndex from '../util/permissions'
  import welcome from '@/components/welcome'

  const visitorRouter = {
    home: '主页\thome',
    apparatusData: '工夹具信息\tfile-search'
  }

  const op1Router = {
    putInOperation: '入库操作\tfile-done',
    putOutOperation: '出库操作\tfile-sync',
    repair: '报修\ttool',
  }

  const op2Router = {
    purchase: '采购入库\tshop',
    scrapRecord: '报废管理\tinbox',
    apparatusDef: '夹具定义\ttable',
  }

  const supervisorRouter = {
    apparatusTypeManagement: '类别管理\tfork',
    systemSettings: '系统设置\tsetting'
  }

  const adminRouter = {
    userManagement: '用户管理\tuser',
  }

  export default {
    components: {
      welcome
    },
    data() {
      return {
        collapsed: false,
        menuItemList: [],
        processedCheckRemindData: [],
      };
    },
    computed: {
      ...mapGetters('homeData', ['processedRepairRecords', 'processedScrapRecords']),
      ...mapGetters('user', ['permissionMap']),
      listInfo() {
        let ret = []
        if (1) { // TODO 有维修处理权限
          this.processedRepairRecords.forEach(record => {
            let status = record.status
            if (status === '申请中') {
              ret.push({
                title: '新的维修处理待批准',
                router: '/repair',
                description: `夹具名${record.name}, 申请时间${record.applicationTime}`
              })
            }
          })
        }

        if (1) { // TODO 有报废处理权限
          this.processedScrapRecords.forEach(record => {
            let status = record.status
            console.log(record)
            if (status === '申请中' || status === '终审通过') {
              ret.push({
                title: '新的报废处理待批准',
                router: '/scrapRecord',
                description: `夹具名${record.name}, 申请时间${record.applicationTime}`

              })
            }
          })
        }

        if (1) { // TODO 点检提醒
          this.processedCheckRemindData.forEach(record => {
            const { apparatusEntity } = record
            const name = apparatusEntity.def.name
            const seqId = apparatusEntity.seqId
            const day = record.time
            ret.push({
              title: '点检提醒',
              router: '/apparatusData',
              description: `名字${name}, 序列号${seqId}的夹具离点检日期还有${day}天`
            })
          })
        }

        ret.sort((a, b) => {
          return Date.parse(a.date) -  Date.parse(b.date)
        })

        return ret
      },
      breadcrumb() {
        return this.$route.fullPath.split('/').filter(router => {
          return router !== '' && Number.isNaN(router*1)
        })

      },
      selectedKey() {
        return [this.getSelectedKey(this.$route.path)]
      }
    },
    methods: {
      handleMenuClick({ item, key, keyPath }) {
        this.selectedKeys = [key]
      },
      getSelectedKey(path) {
        return `/${path.split('/')[1]}`
      },
      handleLogout(e) {
        e.preventDefault()
        this.$apolloHelpers.onLogout()
        const storage = new MyStorage()
        storage.remove('userInfo')
        this.$router.push('/login')
      },
      async fetchCheckRound() {

        let { data } = await this.$apolloProvider.defaultClient.query({
          query: checkRoundlQuery,
          variables: { input: this.$store.state.user.userInfo}
        })

        let { checkReminds } = data
        this.processedCheckRemindData = checkReminds.payload
      }
    },
    created() {
      const store = new MyStorage()
      const userInfo = store.get('userInfo')
      console.log(userInfo)
      this.$store.commit('user/setUserInfo', userInfo)
      let permissions = userInfo.permissions
      let data = { ...visitorRouter}

      if (permissions[permissionsIndex.WarehouseIn].value) {
        Object.assign(data, op1Router)
      }

      if (permissions[permissionsIndex.RepairApplicationProcess].value) {
        Object.assign(data, op2Router)
      }

      if (permissions[permissionsIndex.ClampingApparatusInformationMutation].value) {
        Object.assign(data, supervisorRouter)
      }

      if (permissions[permissionsIndex.SystemManagement].value) {
        Object.assign(data, adminRouter)
      }

      const router = []
      const keys = Object.keys(data)
      keys.forEach(key => {
        let [menuValue, icon] = data[key].split('\t')

        if (typeof icon === 'undefined') {
          icon = 'user'
        }


        router.push({
          name: menuValue,
          router: `/${key !== 'home' ? key : ''}`,
          icon
        })
      })

      this.menuItemList = router

    },
    middleware: 'isAuth',
    async fetch() {
      let userInfo = this.$store.state.user.userInfo
      await this.$store.dispatch(`homeData/fetchData`)
    },


  };
</script>
<style>
  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  .thumbnail {
   max-width: 80px;
  }

  .bar-right > * {
    margin-left: 20px;
  }

  .bar-right {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    text-align: right;
  }

  .height100 {
    height: 100%;
  }

  #__nuxt {
    height: 100%;
  }

  #__layout {
    height: 100%;
  }

  #__layout > * {
    height: 100%;

  }


  .menu-horizontal {
    display: none;
  }

  .menu-inline {
    display: block;
  }

  .breadcrumb {
    display: inline-block;
    position: relative;
    top: -2px;
  }

  @media screen and (max-width: 575px) {

    .ant-layout-header {
      height: 46px;
    }

    .ant-layout-content {
      margin-top: 56px!important;
    }

    .menu-horizontal {
      display: block;
    }

    .menu-inline {
      display: none;
    }

    .trigger-icon {
      display: none;
    }

    .breadcrumb {
      left: 20px;
    }


    /*一定不能更改!!!*/
    .ant-col.ant-col-xs-12.ant-col-sm-9.ant-col-md-8.ant-form-item-label {
      width: auto;
      line-height: 3;
      margin-right: 10px;
    }

    .ant-col.ant-col-xs-12.ant-col-sm-9.ant-col-md-8.ant-form-item-label::after {
      display: inline-block;
      content: ": ";
    }

    .ant-col.ant-col-xs-12.ant-col-sm-15.ant-col-md-16.ant-form-item-control-wrapper {
      width: auto;
    }
  }


</style>
