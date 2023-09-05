<script setup lang="ts">
import { Qualification } from '../../hooks/useStudentList';
import dayjs, { Dayjs } from 'dayjs'

/* TS版本的defineEmits */
interface EmitsType { (name: "save", func: Student): void; }
const emit = defineEmits<EmitsType>();
/* TS版本的defineProps */
interface PropsType { allStudents: Student[] }
const props = defineProps<PropsType>();

// 编辑
const edit = reactive<Edit<Student>>({
  isEdit: false,
  formRef: null,
  model: { 
    stu_id: 0,
    stu_name: '',
    stu_avatar: '',
    stu_cls_id: 0,
    stu_sex: -1,
    stu_phone: '',
    stu_phone2: '',
    stu_born: '',
    stu_qualification: '请选择',
    stu_school: '',
    stu_major: '',
    stu_address: '',
    stu_remark: '',
    stu_bornInit: ref<Dayjs>(dayjs()),
  },
  rules: {
    stu_name: [{
      // @ts-ignore
      validator: (rule: any, value: string) => {
        if(value.length === 0) 
          return Promise.reject('* 姓名不能为空');
        else if(value.length < 1 || value.length > 10)
          return Promise.reject('* 姓名长度 1 - 10');
        else if(props.allStudents.some(item => item.stu_name === value && item.stu_id !== edit.model.stu_id))
          return Promise.reject('* 学生已存在');
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
    // 执行新增操作
    edit.formRef?.resetFields();
    nextTick(() => {edit.isEdit = true});
  },
  handleEdit: (stuId: number) => {
    // 执行编辑操作
    const students = props.allStudents.find(item => item.stu_id === stuId) as Student;
    // 使用 dayjs 处理 stu_born
    edit.model = {...students};
    edit.model.stu_bornInit = dayjs(students.stu_born, 'YYYY-MM-DD');
    nextTick(() => {edit.isEdit = true});
  },
  endEdit: () => {edit.isEdit = false}
})
const datePrintf = (date: Dayjs | string, dateString: string) => {
  console.log(date);
  edit.model.stu_born = dateString;
}
const saveEditHandler = async () => {
  await edit.formRef?.validate(); 
  edit.model.stu_born = dayjs(edit.model.stu_born).format('YYYY-MM-DD'); // 将日期转换为YYYY-MM-DD的格式
  emit("save", toRaw(edit.model))                                  // 表单验证       
}
</script>

<template>
  <a-modal title="编辑" :visible="edit.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveEditHandler" @cancel="edit.isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="edit.rules" :model="edit.model" :ref="el => edit.formRef = el">
      <a-form-item label="姓名" name="stu_name">
        <a-input v-model:value.trim="edit.model.stu_name"></a-input>
      </a-form-item>
      <a-form-item label="性别" name="stu_sex">
        <a-radio-group v-model:value="edit.model.stu_sex" button-style="solid">
          <a-radio-button :value="1">男</a-radio-button>
          <a-radio-button :value="0">女</a-radio-button>
          <a-radio-button :value="2">非二元性别</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="联系电话" name="stu_phone">
        <a-input v-model:value.trim="edit.model.stu_phone"></a-input>
      </a-form-item>
      <a-form-item label="备用电话" name="stu_phone2">
        <a-input v-model:value.trim="edit.model.stu_phone2"></a-input>
      </a-form-item>
      <a-form-item label="出生日期" name="stu_born">
        <a-date-picker v-model:value="edit.model.stu_bornInit" @change="datePrintf" />
      </a-form-item>
      <a-form-item label="学历" name="stu_qualification">
        <a-select allowClear v-if="allStudents" v-model:value="edit.model.stu_qualification" placeholder="请选择" style="width: 200px">
          <a-select-option v-for="item in Qualification" :key="item.dic_id" :value="item.dic_id">
            {{ item.dic_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="学院" name="stu_school">
        <a-input v-model:value.trim="edit.model.stu_school"></a-input>
      </a-form-item>
      <a-form-item label="专业" name="stu_major">
        <a-input v-model:value.trim="edit.model.stu_major"></a-input>
      </a-form-item>
      <a-form-item label="家庭住址" name="stu_address">
        <a-input v-model:value.trim="edit.model.stu_address"></a-input>
      </a-form-item>
      <a-form-item label="备注" name="stu_remark">
        <a-textarea v-model:value.trim="edit.model.stu_remark"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<style>
.ant-form-item-label > label {
  color: #000;
}
</style>