<script lang="ts" setup>
import FuncEdit from './FuncEdit.vue'
import { message } from 'ant-design-vue'
import { Modal } from "ant-design-vue";
const { allFuncs, treeData, initOrRefreshAllFuncs } = useAllFuncs()

const funcEditRef = ref<InstanceType<typeof FuncEdit> | null>(null)
const beginAdd = (func_fid: number) => funcEditRef.value?.beginAdd(func_fid)
const beginUpdate = (func_id: number) => {
  let func = allFuncs.value.find(item => item.func_id === func_id)
  funcEditRef.value?.beginUpdate(func as Func)   
}
const removeConfirm = (func_id: number) => {
  Modal.confirm({
    title: "确定删除？",
    okText: "确认",
    cancelText: "取消",
    okType: "danger",
    async onOk() {
      await api.func.remove(func_id); //发AJAX请求
      initOrRefreshAllFuncs()                          // 重新加载所有功能
      message.success("删除成功"); //提示删除成功
    },
    onCancel() {
      console.log("cancel");
    },
  });
};
const saveHandler = async (func: Func) => {
  if(func.func_id === 0) await api.func.add(func)  // 新增
  else await api.func.update(func)                 // 修改
  initOrRefreshAllFuncs()                          // 重新加载所有功能
  funcEditRef.value?.endEdit();                    // 结束编辑状态
}
</script>

<template>
  <FuncEdit :all-funcs="allFuncs" ref="funcEditRef" @save="saveHandler" />
  <a-tree :tree-data="treeData" defaultExpandAll show-line v-if="allFuncs.length">
    <template #title="item">
      <div class="custom-tree-node">
        <span>{{ item.func_name }}</span>
        <div class="button-group">
          <a-button size="small" type="primary" ghost v-if="!item.func_key" style="grid-area: a;" @click="beginAdd(item.func_id)">
            <template #icon><PlusOutlined /></template></a-button>
          <a-button size="small" v-if="![0, 1, 2].includes(item.func_id)"  style="grid-area: b;" @click="beginUpdate(item.func_id)">
            <template #icon><FormOutlined /></template></a-button>
          <a-button size="small" danger ghost v-if="![0, 1, 2].includes(item.func_id)"  style="grid-area: c;" @click="removeConfirm(item.func_id)">
            <template #icon><DeleteOutlined /></template></a-button>
        </div>
      </div>
    </template>
  </a-tree>
</template>

<style lang="less" scoped>
.custom-tree-node {
  height: 40px;
  display: flex;
  align-items: center;
  width: 100%;
  .button-group {
    margin-left: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: "a b c";
    width: 100px;
    column-gap: 5px;
  }
}
</style>