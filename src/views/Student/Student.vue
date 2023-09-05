<script setup lang="ts">
import { DeploymentUnitOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
import { fetchStudentList, Qualification, getQualificationName } from '../../hooks/useStudentList';
import { getClassName } from '../../hooks/useStudentList';
import StudentEdit from './StudentEdit.vue'
import StudentUpload from './StudentUpload.vue';
import StudentAssign from './StudentAssign.vue'
import { message } from 'ant-design-vue';

const allStudents = shallowRef<Student[]>([]);
const searchValue = ref('');
const studentAssignRef = ref<InstanceType<typeof StudentAssign> | null>(null)
const studentUploadRef = ref<InstanceType<typeof StudentUpload> | null>(null)
const studentEditRef = ref<InstanceType<typeof StudentEdit> | null>(null)
const selectedQualification = ref(null);
const isVisible = reactive<{ [id: number]: boolean }>({}); // 定义ref来追踪每个预览图片的可见状态
// 点击预览按钮时，设置对应id的图片预览可见状态为true
const openPreview = (stuId: number) => {
  setVisible(stuId, true);
}
// 设置图片预览的可见状态
const setVisible = (stuId: number, visible: boolean) => {
  isVisible[stuId] = visible;
}

onMounted(async () => {
  await fetchList();
})
const fetchList = async() => {
  const studentList = await fetchStudentList();
  allStudents.value = studentList;
  console.log(studentList);
}
const columns = [
  { title: "学生姓名", dataIndex: "stu_name", fixed: 'left' },
  { title: "班级", dataIndex: "stu_cls_id", slots: { customRender: 'stu_cls_id' } },
  { title: "存档照片", dataIndex: "stu_avatar", slots: { customRender: 'avatar' }, width: 120 },
  { title: "性别", dataIndex: "stu_sex", slots: { customRender: 'stu_sex' } },
  { title: "联系电话", dataIndex: "stu_phone", width: 120 },
  { title: "联系电话2", dataIndex: "stu_phone2", width: 120 },
  { title: "出生日期", dataIndex: "stu_born", width: 120 },
  { title: "学历", dataIndex: "stu_qualification", slots: { customRender: 'qualification' }, width: 120  },
  { title: "学院", dataIndex: "stu_school" },
  { title: "专业", dataIndex: "stu_major" },
  { title: "家庭住址", dataIndex: "stu_address" },
  { title: "备注", dataIndex: "stu_remark" },
  { title: "操作", slots: { customRender: 'edit' }, fixed: 'right' }
];
const page = ref({ // 用于保存分页信息
  total: 0,
  pageSize: 4,
  current: 1,
})

const filteredStudents = computed(() => {
  return selectedQualification.value ? allStudents.value.filter(item => item.stu_qualification === selectedQualification.value) : allStudents.value;
})
const handleChange = (value: any) => {
  selectedQualification.value = value;
  fetchList();
}
const onSearch = async (svaule: string) => {
  searchValue.value = svaule;
  fetchList();
};
const handleMenuClick = (stuId: number, avatar: string, e: any) => {
  const key = e.key;
  if (key === '1') {
    studentAssignRef.value?.handleDivideClass(stuId);
  } else if (key === '2') {
    studentUploadRef.value?.handleArchivePhoto(stuId, avatar);
  } else if (key === '3') {
    studentEditRef.value?.handleEdit(stuId);
  } else {
    // 处理未知的 key 值
  }
};
const saveAssignHandler = async (model: StudentAssign) => {
  console.log(model);
  await api.student.assignclass(model) // 发ajax
  fetchList();                                                 // 再次发起ajax请求全部的角色数据                                           // 提示用户成功
  message.success('分班成功')             // 关闭modal
  studentAssignRef.value?.endEdit(); 
}
const saveUploadHandler = async (model: AvatarUpdate) => {
  console.log(model);
  await api.student.avatarupdate(model);
  // await api.student.assignclass(model) // 发ajax
  fetchList();                                                 // 再次发起ajax请求全部的角色数据                                           // 提示用户成功
  message.success('更新成功')             // 关闭modal
  studentUploadRef.value?.endEdit(); 
}
const saveEditHandler = async (model: Student) => {
  await api.student[model.stu_id ? 'update' : 'add'](model) // 发ajax
  fetchList();                                                 // 再次发起ajax请求全部的角色数据                                           // 提示用户成功
  message.success(`员工${model.stu_name ? '编辑' : '新增'}成功`)             // 关闭modal
  studentEditRef.value?.endEdit(); 
}
// 选择反馈
const state = reactive<{ selectedRowKeys: Array<number>; }>({ selectedRowKeys: [] }); // 深响应式对象
const onSelectChange = (keys: Array<number>) => { // 数字数组
  console.log(keys);
  state.selectedRowKeys = keys;
  console.log(state.selectedRowKeys)
};
// 批量分班
const batchAssign = (ids: Array<number>) => {
  console.log(ids)
  studentAssignRef.value?.distributeAll(ids)
  // 清空选中
  state.selectedRowKeys = [];
}
const handlePageChange = (pageNum: number) => {
  page.value.current = pageNum;
}
</script>

<template>
  <StudentAssign :all-students="allStudents" ref="studentAssignRef" @save="saveAssignHandler" />
  <StudentUpload :all-students="allStudents" ref="studentUploadRef" @save="saveUploadHandler" />
  <StudentEdit :all-students="allStudents" ref="studentEditRef" @save="saveEditHandler" />
  <!-- 多选 -->
  <a-table v-if="allStudents" :data-source="filteredStudents" :columns="columns" scoped 
    :scroll="{ x: 1500 }"
    selectedRowKeys: state.selectedRowKeys,
    :rowKey="(record) => record.stu_id"
    :row-selection="{ fixed: true, onChange: onSelectChange }"
    :pagination="{
      total: page.total,
      pageSize: page.pageSize,
      current: page.current,
      onChange: handlePageChange
    }"
  >
    <template #title>
      <a-space warp>
        <a-tooltip title="新增">
          <a-button type="primary" shape="circle" :icon="h(PlusOutlined)" @click="studentEditRef?.beginAdd" />
        </a-tooltip>
        <a-input-search
          v-model:value="searchValue"
          placeholder="键入姓名搜索"
          @search="onSearch"
        />
        <a-select v-if="allStudents" v-model="selectedQualification" placeholder="学历" allowClear @change="handleChange" style="width: 150px">
          <a-select-option v-for="item in Qualification" :key="item.dic_id" :value="item.dic_id">
            {{ item.dic_name }}
          </a-select-option>
        </a-select>
        <a-button type="default" :icon="h(DeploymentUnitOutlined)" @click="batchAssign(state.selectedRowKeys)" :disabled="state.selectedRowKeys.length === 0">批量分班</a-button>
      </a-space>
    </template>
    <template #stu_cls_id="{ text }">
      {{ getClassName(text) }}
    </template>
    <template #stu_sex="{ text }">
      {{ !text ? '女' : text === 1 ? '男' : '非二元性别' }}
    </template>
    <template #avatar="{ text, record }">
      <a-button type="primary" ghost @click="openPreview(record.stu_id)">预览</a-button>
      <a-image
        :style="{ display: 'none' }"
        :preview="{
          visible: isVisible[record.stu_id],
          onVisibleChange: (visible) => setVisible(record.stu_id, visible),
        }"
        :src="`${text}`"
      />
    </template>
    <template #qualification="{ text }">
      {{ getQualificationName(text) }}
    </template>
    <template #edit="{ record }">
      <a-dropdown>
        <template #overlay>
          <a-menu @click="handleMenuClick(record.stu_id, record.stu_avatar, $event)">
            <a-menu-item key="1">分班</a-menu-item>
            <a-menu-item key="2">照片存档</a-menu-item>
            <a-menu-item key="3">编辑</a-menu-item>
          </a-menu>
        </template>
        <a-button>
          操作
          <DownOutlined />
        </a-button>
      </a-dropdown>
    </template>
  </a-table>
</template>
