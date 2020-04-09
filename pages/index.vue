<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :selectedKeys="selectedKeys" @click="handleMenuClick">
        <a-menu-item v-for="(menuItem, i) in menuItemList" :key="menuItem.router">
          <nuxt-link :to="menuItem.router">
            <a-icon type="user" />
            <span>{{ menuItem.name }}</span>
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  export default {
    data() {
      return {
        collapsed: false,
        menuItemList: [],
        selectedKeys: []
      };
    },
    methods: {
      handleMenuClick({ item, key, keyPath }) {
        this.selectedKeys = [key]
      },
      getSelectedKey(path) {
        return `/${path.split('/')[1]}`
      }
    },
    created() {
      //TODO 之后和接口对接
      setTimeout(() => {
        const data = [{
          name: '入库操作',
          router: '/putInOperation'
        }, {
          name: '出库操作',
          router: '/putOutOperation'
        }, {
          name: '报修',
          router: '/repair'
        }, {
          name: '采购入库',
          router: '/purchase'
        }, {
          name: '工夹具信息',
          router: '/apparatusData'
        }]
        this.menuItemList = data
        console.log(this.getSelectedKey(this.$route.path))
        let key = this.getSelectedKey(this.$route.path)
        if (key === '/') { // 进入第一个tab
          key = data[0].router
          this.$router.push(key)
        }
        this.selectedKeys = [key]
      }, 500)
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
</style>
