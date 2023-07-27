<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { useAllFuncs } from '../../hooks/useAllFuncs';

const allRouters = shallowRef<Role[]>([])
// const columns = [
//   { title: '角色名', dataIndex: 'role_name' },
//   { title: '操作', dataIndex: '?', slots: [] }
// ]
onMounted(async() => allRouters.value = await api.role.getAll())

const edit = reactive<Edit<Role>>({
  isEdit: false,
  formRef: null,
  model: { role_id: 0, role_name: "" },
  rules: {
    // 验证规则
    role_name: [{
      // @ts-ignore
      validator: (rule: any, value: string) => { 
        if(value.length === 0)
          return Promise.reject('角色名不能为空');
        else if(value.length < 2 || value.length > 10)
          return Promise.reject('角色名长度2-10');
        else if(allRouters.value.some(role => role.role_name === value && role.role_id !== edit.model.role_id))
          return Promise.reject('用户名已存在');
        else
          return Promise.resolve();
      },
      trigger: 'blur'
    }]
  }
})
const beginAdd = () => {
  edit.formRef?.resetFields();
  edit.model = { role_id: 0, role_name: "" }
  edit.isEdit = true
}
const beginUpdate = (role_id: number) => {
  edit.formRef?.resetFields();
  const role = allRouters.value.find(role => role.role_id === role_id) as Role;
  edit.model = { ...role }
  edit.isEdit = true
}
const saveHandler = async() => {
  await edit.formRef?.validate(); // 表单验证
  await api.role[edit.model.role_id ? 'update' : 'add'](edit.model) // 发Ajax
  allRouters.value = await api.role.getAll(); // 再次发起Ajax请求全部的角色数据
  edit.isEdit = false; // 关闭modal
  message.success(`"${edit.model.role_name}"角色编辑成功`) // 提示用户成功
}

// 角色功能分配
const { allFuncs, treeData } = useAllFuncs();
const isSetting = ref<boolean>(false);
const checkedKeys = shallowRef<number[]>([]); // 只会有完全打钩的节点的id
const roleFuncModel = reactive<RoleFunc>({role_id: 0, role_func_ids: ""});
const beginRoleFuncSet = async(role_id: number) => {
  // 把角色的id记下来，确定保存的时候用
  roleFuncModel.role_id = role_id;
  // 获取role_id这个角色的所有功能
  const roleFuncs = await api.role.getRoleFuncs(role_id);
  checkedKeys.value = roleFuncs.filter(func => {
    return func.func_key !== "" || roleFuncs.every(item => item.func_fid !== func.func_id)
  }).reduce((arr: number[], func) => {
    arr.push(func.func_id);
    return arr;
  }, [])
  // 下一时间片，显示modal
  nextTick(() => isSetting.value = true)
}
const setRoleFunc = async() => {
  // 从树形控件中搜集
  roleFuncModel.role_func_ids = checkedKeys.value.reduce((arr: number[], checkedFunc_id) => { // 使用reduce遍历checkedKeys数组
    if(checkedFunc_id === 0 || arr.includes(checkedFunc_id)) return arr; // 全选的0 或 已经搜集过，自动忽略
    arr.push(checkedFunc_id); // 搜集选中的功能节点的checkedFunc_id并存储在数组中，将每个checkedFunc_id添加到arr数组中
    let func_fid = allFuncs.value.find(func => func.func_id === checkedFunc_id)?.func_fid as number; // 根据checkedFunc_id查找对应父功能节点func_fid
    while(func_fid !== 0 && !arr.includes(func_fid)) {
      arr.push(func_fid);
      func_fid = allFuncs.value.find(func => func.func_id === func_fid)?.func_fid as number;
    }
    return arr;
  }, []).join(','); // 将结果数组arr使用join(',')方法转换成字符串，并赋值给roleFuncModel.role_func_ids
  // 发Ajax
  await api.role.setRoleFuncs(roleFuncModel);
  // 关闭modal
  isSetting.value = false;
  // 提示成功
  message.success('角色的最新功能配置生效')
}
</script>

<template>
  <!-- 系统角色列表 -->
  <a-table :data-source="allRouters" bordered :pagination="false">
    <template #title>
      <a-button type="primary" @click="beginAdd"><template #icon><PlusOutlined /></template>新增</a-button>
    </template>
    <a-table-column key="role_name" title="角色名" data-index="role_name"></a-table-column>
    <a-table-column title="操作">
      <template #default="{ record }">
        <a-space>
          <a-button type="primary" ghost @click="beginUpdate(record.role_id)"><template #icon><FormOutlined /></template>修改</a-button>
          <a-button ghost danger><template #icon><DeleteOutlined /></template>删除</a-button>
          <a-button @click="beginRoleFuncSet(record.role_id)"><template #icon><SmileOutlined /></template>功能分配</a-button>
        </a-space>
      </template>
    </a-table-column>
  </a-table>
  <!-- 系统角色功能配置 -->
  <a-modal 
    title="系统角色功能配置" 
    :visible="isSetting"
    :closable="false"
    :mask-closable="false"
    :keyboard="false"
    ok-text="确定"
    cancel-text="取消"
    @ok="setRoleFunc"
    @cancel="isSetting = false"
    force-render
  >
    <a-tree
      show-line
      checkable
      defaultExpandAll
      v-if="allFuncs.length"
      :tree-data="treeData" 
      :field-names="{key: 'func_id', title: 'func_name', children: 'children'}"
    ></a-tree>
  </a-modal>
  <!-- 角色编辑 -->
  <a-modal 
    title="系统角色编辑" 
    :visible="edit.isEdit"
    :closable="false"
    :mask-closable="false"
    :keyboard="false"
    ok-text="确定"
    cancel-text="取消"
    @ok="saveHandler"
    @cancel="edit.isEdit = false"
    force-render
  >
    <a-form :label-col="{ span: 7 }" :rules="edit.rules" :model="edit.model" :ref="el => edit.formRef = el">
      <a-form-item label="系统角色名称：" name="role_name">
        <a-input v-model:value.trim="edit.model.role_name"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="less">
</style>