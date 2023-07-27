<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model:collapsed="collapsed" collapsible theme="dark">
      <div class="logo" />
      <!-- 引入SysMenu组件，用于显示菜单项 -->
      <SysMenu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" class="header">
        <a-button class="logout-btn" @click="loginOutHandler" ghost danger>退出登录</a-button>
      </a-layout-header>
      <!-- 面包屑 -->
      <a-breadcrumb style="margin: 16px 16px">
        <a-breadcrumb-item>首页</a-breadcrumb-item>    
        <a-breadcrumb-item v-if="currentFuncName">{{ currentFuncName }}</a-breadcrumb-item>    
      </a-breadcrumb>
      <a-layout-content>
        <!-- 二级路由组件对应的渲染 -->
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import router from "../../router";
import SysMenu from './SysMenu.vue'

const collapsed = ref<boolean>(false);
const { currentFuncName } = storeToRefs(store.dashboard); // 从pinia仓库中解构出来并转为响应式
// 组件挂载后调用，刷新重新调用，切换菜单不会重新调用
onMounted(() => {store.dictionary.init()}) // 字典初始化
const loginOutHandler = () => {
  sessionStorage.clear();
  store.dashboard.clearDashboard();
  router.replace({path: '/login'});
}
</script>

<style lang="less" scoped>
#app {
  width: 100%;
}
body {
  margin: 0;
  height: 100vh;
}
.ant-layout-sider {
  z-index: 99;
}
.header {
  position: relative;
}
.logout-btn {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}
.ant-layout-content {
  margin: 0 16px 24px;
  padding: 24px;
  background-color: #fff;
  min-height: 280px;
}
#components-layout-demo-custom-trigger {
  // width: 100%;
  height: 100vh; // 铺满屏幕高度
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #ff4655;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: #ff4655;
  margin: 16px;
}
</style>
