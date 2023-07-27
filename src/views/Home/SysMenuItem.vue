<script lang="ts" setup>
interface PropsType { data: FuncTree }
// 对外公开属性
const props = defineProps<PropsType>()
</script>

<template>
  <template v-for="item in props.data" :key="item.func_id">
    <!-- 叶子🍃 -->
    <a-menu-item v-if="item.func_fid" :key="item.func_key">
      <template #icon>
        <LineOutlined class="site-form-item-icon" />
      </template>
      <span v-text="item.func_name"></span>
    </a-menu-item>
    <a-sub-menu v-else>
      <template #title>
        <AppstoreOutlined class="site-form-item-icon" />
        <span>{{ item.func_name }}</span>
      </template>
      <SysMenuItem v-if="item.children" :data="item.children" />
    </a-sub-menu>
  </template>

</template>

<style lang="less" scoped>
</style>