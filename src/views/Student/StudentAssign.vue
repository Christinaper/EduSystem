<script setup lang="ts">
import { classList } from '../../hooks/useClassList';

/* TS版本的defineEmits */
interface EmitsType { (name: "save", func: StudentAssign): void; }
const emit = defineEmits<EmitsType>();
/* TS版本的defineProps */
interface PropsType { allStudents: Student[] }
const props = defineProps<PropsType>();
 
// 分班
const stuAssgin = reactive<Edit<StudentAssign>>({
  isEdit: false,
  formRef: null,
  model: {stu_cls_id: '请选择', stu_id: 0, stu_ids: []}
})

// defineExpose对外公开可供外部直接访问的数据和方法
defineExpose({
  handleDivideClass: (stuId: number) => { // 单独
    // 执行分班操作
    console.log('分班', stuId);
    const students = props.allStudents.find(item => item.stu_id === stuId) as Student;
    stuAssgin.model.stu_cls_id = students.stu_cls_id;
    stuAssgin.model.stu_id = stuId;
    stuAssgin.isEdit = true
    nextTick(() => {stuAssgin.isEdit = true});
  },
  distributeAll: (ids: Array<number>) => {
    stuAssgin.isEdit = true;
    stuAssgin.model.stu_id = null;
    stuAssgin.model.stu_ids = ids;
    // console.log(ids)
    console.log(stuAssgin.model.stu_ids);
  },
  endEdit: () => {stuAssgin.isEdit = false}
})

const saveHandler = async () => {
  await stuAssgin.formRef?.validate(); 
  emit("save", toRaw(stuAssgin.model));
}
</script>

<template>
  <a-modal title="分配班级" :visible="stuAssgin.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveHandler" @cancel="stuAssgin.isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="stuAssgin.rules" :model="stuAssgin.model" :ref="el => stuAssgin.formRef = el">
      <a-form-item label="教室" name="clsr_name">
        <a-select v-model:value="stuAssgin.model.stu_cls_id" placeholder="请选择" allowClear>
          <a-select-option v-for="item in classList" :key="item.cls_id" :value="item.cls_id">
            {{ item.cls_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
