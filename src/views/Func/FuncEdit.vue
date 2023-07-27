<script lang="ts" setup>
// @ts-ignore
import { arr2tree } from '../../utils/common.js';

const sysAllFuncMap = [
  {key: 'role_func', tip: '组件 - 角色管理及角色功能分配'},
  {key: 'staff', tip: '组件 - 员工管理组件'},
  {key: 'user_manage', tip: '组件 - 系统用户管理组件'},
  {key: 'classroom', tip: '组件 - 教室管理组件'},
  {key: 'class', tip: '组件 - 班级管理组件'},
  {key: 'student', tip: '组件 - 学生管理组件'},
  {key: 'password', tip: '组件 - 密码修改组件'}
];
/* TS版本的defineProps */
interface PropsType { allFuncs: Func[] }
const props = defineProps<PropsType>();
/* TS版本的defineEmits */
interface EmitsType { (name: "save", func: Func): void; }
const emit = defineEmits<EmitsType>();

const formRef = ref<FormInstance | null>(null)   // 关联表单
const model = ref<Func>({ func_id: 0, func_name: "", func_fid: 0, func_key: "" }) // 与表单进行双向绑定
const isEdit = ref<boolean>(false);  // 是否开启进入了编辑状态
const isLeaf = ref<boolean>(false);  // 标识是否是叶子节点
const rules: Rule = {                // 表单验证规则（运行中是不会改变的，所以不要加ref/reactive） 
  func_name: [{
    // @ts-ignore
    validator: (rule: any, value: string) => {
      if(value === "")  // 非空验证
        return Promise.reject('* 功能名不能为空')
      else if(value.length < 2 || value.length > 20) // 长度验证
        return Promise.reject('* 功能名长度 2 - 20')
      else if(props.allFuncs.some(func => 
        func.func_fid === model.value.func_fid && 
        func.func_name === value && 
        func.func_id !== model.value.func_id)) // 同级唯一性验证
        return Promise.reject('* 同级兄弟节点不可重名')
      else
        return Promise.resolve();
    },
    trigger: 'blur'
  }],
  func_key: [{
    // @ts-ignore
    validator: (rule: any, value: string) => {
      if(isLeaf.value && value === "")
        return Promise.reject('* 叶子节点必须绑定功能')
      else
        return Promise.resolve()
    },
    trigger: 'change'
  }]
}
watch(isLeaf, (newValue) => { if(!newValue) model.value.func_key = ""});
const cascaderValue = computed<number[]>({                // el-cascader需要双向绑定的计算属性
  // @ts-ignore
  get() {
    let func_fid = model.value.func_fid;
    const result: number[] = [func_fid];
    while(func_fid !== 0) {
      func_fid  = props.allFuncs.find(func => func.func_id === func_fid)?.func_fid as number;
      result.unshift(func_fid);
    }
    return result;
  },
  set(arr: number[]) {  model.value.func_fid = arr[arr.length - 1] }
})
const allFuncTreeWithNoLeaf = computed<FuncTree>(() => [{ // el-cascader需要的仅包含非叶子节点的树形数据
  func_id: 0, func_name: 'Root', func_fid: -1, func_key: "", 
  children: arr2tree(props.allFuncs.filter(func => func.func_key === ""), 'func_id', 'func_fid')
}]) 

// 功能函数
const saveHandler = async () => {
  await formRef.value?.validate() // 表单验证
  emit("save", toRaw(model.value))
}
// defineExpose对外公开可供外部直接访问的数据和方法
defineExpose({
  beginAdd: (func_fid: number) => {
    formRef.value?.resetFields();     // 重置表单
    model.value = { func_id: 0, func_name: "", func_fid, func_key: "" }
    isLeaf.value = false;             // 不重要，反正进去了可以选
    nextTick(() => {isEdit.value = true;});
  },
  beginUpdate: (func: Func) => {
    formRef.value?.resetFields();     // 重置表单
    model.value = {...func};          // 回显数据
    isLeaf.value = !!func.func_key;   // 不重要，反正进去了也看不见
    nextTick(() => {isEdit.value = true;});
  },
  endEdit: () => {isEdit.value = false;}
});

</script>

<template>
  <a-modal title="菜单功能节点编辑" :visible="isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveHandler" @cancel="isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="rules" :model="model" ref="formRef">
      <a-form-item label="功能节点类型：">
        <a-radio-group 
          :options="[{label: '叶子节点', value: true}, {label: '非叶子节点', value: false}]" 
          v-model:value="isLeaf" :disabled="model.func_id !== 0"
        ></a-radio-group>
      </a-form-item>
      <a-form-item label="父功能节点：">
        <a-cascader 
          :allow-clear="false"
          expandTrigger="hover"
          change-on-select
          v-model:value="cascaderValue" 
          :options="allFuncTreeWithNoLeaf" 
          :fieldNames="{label: 'func_name', value: 'func_id'}"
          :disabled="model.func_id == 0"
        ></a-cascader>
      </a-form-item>
      <a-form-item label="功能点节名称：" name="func_name" has-feedback>
        <a-input  placeholder="请输入节点功能名称.." v-model:value.trim="model.func_name"></a-input>
      </a-form-item>
      <a-form-item label="功能节点组件绑定：" v-show="isLeaf" name="func_key" has-feedback>
        <a-select v-model:value="model.func_key">
          <a-select-option value="">- 请选择 -</a-select-option>
          <a-select-option v-for="item in sysAllFuncMap" :key="item.key" :value="item.key">{{ item.tip }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped></style>