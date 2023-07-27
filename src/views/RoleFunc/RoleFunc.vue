<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { Modal } from "ant-design-vue";
/* 获取所有角色 */
const allRoles = shallowRef<Role[]>([]) // 响应式的浅层引用变量
onMounted(async () => {
  allRoles.value = await api.role.getAll()
  console.log(allRoles.value);
})

/* 角色增删改 */
const edit = reactive<Edit<Role>>({ // 使用reactive()函数创建一个响应式对象，类型为Edit<Role> 泛型
  isEdit: false,
  formRef: null, // 表示表单的引用
  model: {role_id: 0, role_name: ""},
  rules: {
    role_name: [{
      // @ts-ignore
      validator: (rule: any, value: string) => {
        if(value.length === 0) 
          return Promise.reject('* 角色名不能为空'); // 返回拒绝的Promise
        else if(value.length < 2 || value.length > 10)
          return Promise.reject('* 角色名长度 2 - 10');
        else if(allRoles.value.some(role => role.role_name === value && role.role_id !== edit.model.role_id))
          return Promise.reject('* 角色名已存在');
        else
          return Promise.resolve(); // 返回成功的Promise
      },
      trigger: 'blur'
    }]
  }
})
const beginAdd = () => {
  edit.formRef?.resetFields(); // 可选串连运算符
  edit.model = {role_id: 0, role_name: ""}
  edit.isEdit = true
}
const removeConfirm = (func_id: number) => {
  Modal.confirm({
    title: "确定删除？",
    okText: "确认",
    cancelText: "取消",
    okType: "danger",
    async onOk() {
      await api.role.delRoleFuncs(func_id); //发AJAX请求
      allRoles.value = await api.role.getAll(); // 重新加载所有角色
      message.success("删除成功"); //提示删除成功
    },
    onCancel() {
      console.log("cancel");
    },
  });
};
const beginUpdate = (role_id: number) => {
  edit.formRef?.resetFields();
  // 找到第一个满足条件的元素，赋值给role，类型断言为Role，就拥有role_id、 role_name
  const role = allRoles.value.find(role => role.role_id === role_id) as Role;
  edit.model = {...role}; // edit.model 赋值为 role 的一个拷贝，即创建一个新的对象，并把 role 的所有属性和值复制过来
  edit.isEdit = true;
}
const save = async () => {
  await edit.formRef?.validate();                                   // 表单验证
  await api.role[edit.model.role_id ? 'update' : 'add'](edit.model) // 发ajax id是参数
  allRoles.value = await api.role.getAll()                          // 再次发起ajax请求全部的角色数据
  edit.isEdit = false                                               // 提示用户成功
  message.success(`"${edit.model.role_name}" 角色编辑成功`)           // 关闭modal
  
}

/* 角色功能分配 */
// allFuncs功能信息数组, treeData树形控件所需的数据对象
const {allFuncs, treeData} = useAllFuncs()
const isSetting = ref<boolean>(false);
const checkedKeys = shallowRef<number[]>([]) // 这里只会有**完全打勾**的节点的id
const roleFuncModel = reactive<RoleFunc>({role_id: 0, role_func_ids: ""}) // 存储当前要设置功能的角色信息
const beginRoleFuncSet = async (role_id: number) => {
  // 把角色的id记下来，确定保存的时候要用
  roleFuncModel.role_id = role_id;
  // 获取role_id这个角色的所有功能, 处理后更新checkedkeys,让tree回显角色的当前对应功能
  const roleFuncs = await api.role.getRoleFuncs(role_id);
  checkedKeys.value = roleFuncs.filter(func => { // 更新被勾选的节点id
    // func.func_key为空：“系统管理”fid0
    // func_fid === func_id 子节点
    // 筛选得到“有功能键” or “没有子节点的功能”
    return func.func_key !== "" || roleFuncs.every(item => item.func_fid !== func.func_id)
  }).reduce((arr: number[], func) => {
    // 收集：把每个元素的id添加到一个空数组中并返回
    arr.push(func.func_id); return arr;
  }, [])
  // 下一时间片，再显示modal
  nextTick(() => isSetting.value = true);
}
const setRoleFunc = async () => {
  // 从树形控件中搜集（被勾选 和 半勾选 的节点id， 以 , 分隔）
  roleFuncModel.role_func_ids = checkedKeys.value.reduce((arr: number[], checkedFunc_id) => {
    if(checkedFunc_id === 0 || arr.includes(checkedFunc_id)) return arr; // 已经搜集过了，直接忽略
    arr.push(checkedFunc_id);                                             // 它本身是肯定要搜集的
    /**
     * allFuncs.value 数组中找到这个 id 对应的功能数据，然后沿着它的 func_fid 属性向上查找它的父节点，
     * 直到找到根节点或者已经收集过的节点为止，把沿途的所有节点 id 都添加到这个数组中。
     * 这样，你就可以把被完全勾选和半勾选的节点 id 都收集到一个数组中。
     */
    let func_fid = allFuncs.value.find(func => func.func_id === checkedFunc_id)?.func_fid as number;
    while(func_fid !== 0 && !arr.includes(func_fid)) {
      arr.push(func_fid);
      func_fid = allFuncs.value.find(func => func.func_id === func_fid)?.func_fid as number;
    }
    return arr;
  }, []).join(',');
  await api.role.setRoleFuncs(roleFuncModel);       // 发ajax
  isSetting.value = false;                          // 关闭modal
  message.success('角色的最新功能配置生效..')         // 提示成功
}
</script>

<template>
  <!-- 系统角色列表 -->
  <a-table :data-source="allRoles" bordered :pagination="false">
    <a-table-column key="role_name" title="角色名" data-index="role_name"></a-table-column>
    <a-table-column title="操作">
      <template #default="{ record }">
        <a-space>
          <a-button type="primary" ghost @click="beginUpdate(record.role_id)"><template #icon><FormOutlined /></template>修改</a-button>
          <a-button danger @click="removeConfirm(record.role_id)"><template #icon><DeleteOutlined /></template>删除</a-button>
          <a-button type="primary" @click="beginRoleFuncSet(record.role_id)"><template #icon><SettingOutlined /></template>功能分配</a-button>
        </a-space>
      </template>
    </a-table-column>
    <template #title>
      <a-button type="primary" ghost @click="beginAdd"><template #icon><PlusOutlined /></template>新增</a-button>
    </template>
  </a-table>
  <!-- 角色功能配置 -->
  <a-modal title="系统角色功能配置"  :visible="isSetting" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="setRoleFunc" @cancel="isSetting = false" force-render>
    <a-tree show-line checkable defaultExpandAll v-if="allFuncs.length"
      :tree-data="treeData" :field-names="{key: 'func_id', title: 'func_name', children: 'children'}"
      v-model:checked-keys="checkedKeys"
    ></a-tree>
  </a-modal>
  <!-- 角色编辑 -->
  <a-modal title="系统角色编辑" :visible="edit.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="save" @cancel="edit.isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="edit.rules" :model="edit.model" :ref="el => edit.formRef = el">
      <a-form-item label="系统角色名称：" name="role_name">
        <a-input v-model:value.trim="edit.model.role_name"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
  
</style>