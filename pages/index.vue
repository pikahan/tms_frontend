<template>
  <a-layout id="components-layout-demo-custom-trigger" class="height100">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed" style="height: 100%" class="height100 menu-inline" >
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :selectedKeys="selectedKey" @click="handleMenuClick" >
        <a-menu-item v-for="(menuItem, i) in menuItemList" :key="menuItem.router">
          <nuxt-link :to="menuItem.router">
            <a-icon type="user" />
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
              <a-icon type="user" />
              <span>{{ menuItem.name }}</span>
            </nuxt-link>
          </a-menu-item>
        </a-menu>
        <div class="header_bar"  style="display: flex;justify-content: space-between">
          <div>
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="()=> collapsed = !collapsed"
            />
            <a-breadcrumb style="display: inline-block;position: relative;top: -2px;">
              <a-breadcrumb-item >Home</a-breadcrumb-item>
              <a-breadcrumb-item v-for="name of breadcrumb">{{ name }}</a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="bar-right">
            <div class="bell-icon" style="position: relative; top: 2px; display: inline-block">
              <a-badge dot><a-icon style="font-size: 16px" type="bell" /></a-badge>
            </div>
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
                  <a href="javascript:;">修改密码</a>
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
          <welcome :name="this.$store.state.user.userInfo.employeeId" :info="`还有${listInfo.length}件未处理的消息, 请及时处理。`" />
          <h3>待处理消息</h3>
          <a-list item-layout="horizontal" :data-source="listInfo">
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

  const op1Router = {
    home: '主页',
    putInOperation: '入库操作',
    putOutOperation: '出库操作',
    repair: '报修',
    apparatusData: '工夹具信息',
  }

  const op2Router = {
    purchase: '采购入库',
    scrapRecord: '报废管理',
    apparatusDef: '夹具定义',
  }

  const supervisorRouter = {
    apparatusTypeManagement: '类别管理',
  }

  const adminRouter = {
    userManagement: '用户管理',
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
        console.log(this.$route.fullPath.split('/').filter(router => {
          return router !== '' || Number.isNaN(router*1)
        }))
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
      this.$store.commit('user/setUserInfo', userInfo)
      let permissions = userInfo.permissions
      let data = { ...op1Router}
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
        router.push({
          name: data[key],
          router: `/${key !== 'home' ? key : ''}`
        })
      })

      this.menuItemList = router
      // if (key === '/') { // TODO 之后改成首页
      //   key = "/" + Object.keys(data)[0]
      //   // this.$router.push(key)
      // }
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

  @media screen and (max-width: 576px) {
    .menu-horizontal {
      display: block;
    }

    .menu-inline {
      display: none;
    }
  }


</style>
