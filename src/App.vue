<script setup lang="ts">
const { spinning } = storeToRefs(store.dashboard)
const indicator = ref<JSX.Element>(
  h('img', { src: "src/assets/loading.gif", alt: "loding" })
);

</script>

<template>
  <!-- 一级路由对应组件渲染的占位符 -->
  <a-spin :spinning="spinning" :indicator="indicator" tip="✨✨✨Loading✨✨✨" size="large">
    <router-view></router-view>
  </a-spin>
</template>

<style scoped>

</style>