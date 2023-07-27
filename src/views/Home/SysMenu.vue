<script lang="ts" setup>
// @ts-ignore
import { arr2tree } from '../../utils/common.js';
import SysMenuItem from './SysMenuItem.vue';

const router = useRouter();
// 取出功能表数据
const { userFuncs } = storeToRefs(store.dashboard)
const menuData = computed<FuncTree>(() => arr2tree(userFuncs.value, 'func_id', 'func_fid'));

const menuClickHandler = (item: any) => router.push({name: item.key})
</script>

<template>
  <a-menu mode="inline" @click="menuClickHandler" theme="dark">
    <SysMenuItem :data="menuData" />
  </a-menu>
</template>

<style lang="less" scoped>
</style>