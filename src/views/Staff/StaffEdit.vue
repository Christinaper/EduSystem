<script setup lang="ts">
import { staffCategory } from '../../hooks/useStaffList';

/* TS版本的defineEmits */
interface EmitsType { (name: "save", func: Staff): void; }
const emit = defineEmits<EmitsType>();
/* TS版本的defineProps */
interface PropsType { allStaffs: Staff[] }
const props = defineProps<PropsType>();

// 编辑
const edit = reactive<Edit<Staff>>({
  isEdit: false,
  formRef: null,
  model: { stf_id: 0, stf_name: "", stf_category: "请选择", stf_remark: "", stf_invalid: 0 },
  rules: {
    stf_name: [{
      // @ts-ignore
      validator: (rule: any, value: string) => {
        if(value.length === 0) 
          return Promise.reject('* 角色名不能为空');
        else if(value.length < 2 || value.length > 10)
          return Promise.reject('* 角色名长度 2 - 10');
        else if(props.allStaffs.some(item => item.stf_name === value && item.stf_id !== edit.model.stf_id))
          return Promise.reject('* 角色名已存在');
        else
          return Promise.resolve();
      },
      trigger: 'blur'
    }]
    // else...
  }
})
// defineExpose对外公开可供外部直接访问的数据和方法
defineExpose({
   beginAdd: () => {
    edit.formRef?.resetFields();
    edit.model = { stf_id: 0, stf_name: "", stf_category: '请选择员工类型', stf_remark: "", stf_invalid: 0 }
    edit.isEdit = true;
  },
  beginUpdate: (stf_id: number) => {
    edit.formRef?.resetFields();
    const staff = props.allStaffs.find(item => item.stf_id === stf_id) as Staff;    
    edit.model = {...staff};
    edit.isEdit = true;
  }
})

const saveHandler = async () => {
  await edit.formRef?.validate(); 
  emit("save", toRaw(edit.model))                                  // 表单验证       
  edit.isEdit = false;                                // 关闭modal
}
</script>

<template>
  <!-- 员工编辑 -->
  <a-modal title="员工编辑" :visible="edit.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveHandler" @cancel="edit.isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="edit.rules" :model="edit.model" :ref="el => edit.formRef = el">
      <a-form-item label="员工姓名：" name="stf_name">
        <a-input v-model:value.trim="edit.model.stf_name"></a-input>
      </a-form-item>
      <a-form-item label="员工类型：" name="stf_category">
        <a-select allowClear v-if="allStaffs" v-model:value="edit.model.stf_category" placeholder="请选择员工类型">
          <a-select-option v-for="item in staffCategory" :key="item.dic_id" :value="item.dic_id">
            {{ item.dic_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注：" name="stf_remark">
        <a-textarea v-model:value.trim="edit.model.stf_remark"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>