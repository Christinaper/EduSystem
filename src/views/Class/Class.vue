<script setup lang="ts">
import { CheckCircleOutlined, EditOutlined, LoginOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { fetchClassList, getMajorName, getTeacherName, getClsrName, ClassMajor, roomList } from '../../hooks/useClassList'
import { staffList } from '../../hooks/useStaffList';
import { h } from 'vue';
import { message } from 'ant-design-vue';

const allClasses = ref<Class[]>([]);
const searchValue = ref('');
const selectedMajor = ref(null);

onMounted(async () => {
  await fetchList();
})
const fetchList = async() => {
  const { list } = await fetchClassList(selectedMajor.value);
  allClasses.value = list;
}

const columns = [
  { title: "班级名称", dataIndex: "cls_name" },
  { title: "班级专业", dataIndex: "cls_dic_id_major", slots: { customRender: 'cls_dic_id_major' } },
  { title: "教学老师", dataIndex: "cls_stf_id_teacher", slots: { customRender: 'id_teacher' } },
  { title: "教务老师", dataIndex: "cls_stf_id_admin", slots: { customRender: 'id_admin' } },
  { title: "教学秘书", dataIndex: "cls_stf_id_job", slots: { customRender: 'id_job' } },
  { title: "教室", dataIndex: "cls_clsr_id", slots: { customRender: 'clsr_id' }  },
  { title: "开课时间", dataIndex: "cls_begin" },
  { title: "结课时间", dataIndex: "cls_end" },
  { title: "班级状态", slots: { customRender: 'cls_state' } },
  { title: "备注", dataIndex: "cls_remark" },
  { title: "操作", slots: { customRender: 'cls_edit' } }
];
const tagColors: { [key: number]: { color: string; style: string } } = {
  8: { color: "#c40001", style: "color: #f6ed61;" },
  9: { color: "#fff300", style: "color: #000000;" },
  10: { color: "#0000a0", style: "color: #d2e7f1;" },
  11: { color: "#004101", style: "color: #dcdcdc;" },
}
// 编辑
const edit = reactive<Edit<Class>>({
  isEdit: false,
  formRef: null,
  model: { 
    cls_id: 0, 
    cls_name: '', 
    cls_dic_id_major: '请选择', 
    cls_clsr_id: null, 
    cls_stf_id_teacher: '请选择', cls_stf_id_admin: '请选择', cls_stf_id_job: '请选择', 
    cls_begin: null, cls_end: null, cls_remark: '',
    cls_stf_id_teacher_name: '', cls_stf_id_admin_name: '', cls_stf_id_job_name: '', 
},
  rules: {
    cls_name: [{
      // @ts-ignore
      validator: (rule: any, value: string) => {
        if(value.length === 0) 
          return Promise.reject('* 班级名不能为空');
        else if(value.length < 1 || value.length > 10)
          return Promise.reject('* 班级名长度 1 - 10');
        else if(allClasses.value.some(item => item.cls_name === value && item.cls_id !== edit.model.cls_id))
          return Promise.reject('* 班级名已存在');
        else
          return Promise.resolve();
      },
      trigger: 'blur'
    }]
    // else...
  }
})
const page = ref({ // 用于保存分页信息
  total: 0,
  pageSize: 5,
  current: 1,
})

const clsBegin = reactive<Edit<ClassBegin>>({
  isEdit: false,
  formRef: null,
  model: {cls_clsr_id: '请选择', cls_id: 0}
})
const filteredClasses = computed(() => {
  return selectedMajor.value ? allClasses.value.filter(item => item.cls_dic_id_major === selectedMajor.value) : allClasses.value;
})

const handleChange = (value: any) => {
  selectedMajor.value = value;
  fetchList();
}
const onSearch = async (svaule: string) => {
  searchValue.value = svaule;
  fetchList();
};
const end = async (id: any) => {
  const cls_id = { cls_id: id }
  await api.classs.end(cls_id);
  fetchList();
  message.success("结课成功");
}
const begin = async (id: any) => {
  console.log(id);
  clsBegin.model.cls_id = id;
  clsBegin.isEdit = true;
}

const beginAdd = () => {
  edit.formRef?.resetFields();
  edit.isEdit = true;
}
const beginUpdate = (id: number) => {
  console.log(id);
  edit.formRef?.resetFields();
  const classes = allClasses.value.find(item => item.cls_id === id) as Class;
  edit.model = {...classes};
  edit.isEdit = true;
};
const saveHandler = async () => {
  await clsBegin.formRef?.validate();                                   // 表单验证
  await api.classs.begin(clsBegin.model) // 发ajax
  fetchList();                                                 // 再次发起ajax请求全部的角色数据
  clsBegin.isEdit = false                                            // 关闭modal   
  message.success("开课成功")                                  // 提示用户成功
}
const saveEditHandler = async () => {
  await edit.formRef?.validate();                                   // 表单验证
  await api.classs[edit.model.cls_id ? 'update' : 'add'](edit.model) // 发ajax
  fetchList();                                                 // 再次发起ajax请求全部的角色数据
  edit.isEdit = false                                            // 关闭modal   
  message.success(`${edit.model.cls_name ? '编辑' : '新增'}成功`)                                // 提示用户成功
}
const handlePageChange = (pageNum: number) => {
  page.value.current = pageNum;
}
</script>

<template>
  <a-table v-if="allClasses" :data-source="filteredClasses" :columns="columns" scoped
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
          <a-button type="primary" shape="circle" :icon="h(PlusOutlined)" @click="beginAdd" />
        </a-tooltip>
        <a-input-search
          v-model:value="searchValue"
          placeholder="键入姓名搜索"
          style="width: 200px"
          @search="onSearch"
        />
        <a-select v-if="allClasses" v-model="selectedMajor" placeholder="科目" allowClear @change="handleChange" style="width: 150px">
          <a-select-option v-for="item in ClassMajor" :key="item.dic_id" :value="item.dic_id">
            {{ item.dic_name }}
          </a-select-option>
        </a-select>
      </a-space>
    </template>
    <template #cls_dic_id_major="{ text }">
      <a-tag :color="tagColors[text].color">
        <span :style="tagColors[text].style">{{ getMajorName(text) }}</span>
      </a-tag>
    </template>
    <template #id_teacher="{ text }">
      {{ getTeacherName(text) }}
    </template>
    <template #id_admin="{ text }">
      {{ getTeacherName(text) }}
    </template>
    <template #id_job="{ text }">
      {{ getTeacherName(text) }}
    </template>
    <template #clsr_id="{ text }">
      {{ getClsrName(text) }}
    </template>
    <template #cls_state="{ record }">
      <a-tag :color="record.cls_end ? 'pink' : (record.cls_begin ? 'cyan' : 'blue')">
        {{ record.cls_end ? '已结课' : (record.cls_begin ? '已开课' : '未开课') }}
      </a-tag>
    </template>
    <template #cls_edit="{ record }">
      <a-space warp>
        <a-tooltip title="编辑">
          <a-button type="primary" shape="circle" :icon="h(EditOutlined)" @click="beginUpdate(record.cls_id)" :disabled="record.cls_end && (record.cls_begin && record.cls_end)" />
        </a-tooltip>
        <a-tooltip title="结课" v-if="record.cls_begin && !record.cls_end">
          <a-button danger ghost :icon="h(LogoutOutlined)" @click="end(record.cls_id)">结课</a-button>
        </a-tooltip>
        <a-tooltip title="开课" v-else-if="!record.cls_begin">
          <a-button type="primary" ghost :icon="h(LoginOutlined)" @click="begin(record.cls_id)">开课</a-button>
        </a-tooltip>
        <a-tooltip title="已结课" v-else>
          <a-button type="primary" disabled :icon="h(CheckCircleOutlined)">完成</a-button>
        </a-tooltip>
      </a-space>
    </template>
  </a-table>
  <a-modal title="选择教室" :visible="clsBegin.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveHandler" @cancel="clsBegin.isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="clsBegin.rules" :model="clsBegin.model" :ref="el => clsBegin.formRef = el">
      <a-form-item label="教室" name="clsr_name">
        <a-select v-if="allClasses" v-model:value="clsBegin.model.cls_clsr_id" placeholder="请选择" allowClear>
          <a-select-option v-for="item in roomList" :key="item.clsr_id" :value="item.clsr_id" :disabled="item.clsr_occupy">
            {{ item.clsr_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal title="编辑" :visible="edit.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveEditHandler" @cancel="edit.isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="edit.rules" :model="edit.model" :ref="el => edit.formRef = el">
      <a-form-item label="班级名称：" name="cls_name">
        <a-input v-model:value.trim="edit.model.cls_name"></a-input>
      </a-form-item>
      <a-form-item label="班级专业：" name="cls_dic_id_major">
        <a-select allowClear v-if="allClasses" v-model:value="edit.model.cls_dic_id_major" placeholder="请选择">
          <a-select-option v-for="item in ClassMajor" :key="item.dic_id" :value="item.dic_id">
            {{ item.dic_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="教学老师：" name="cls_stf_id_teacher">
        <a-select allowClear v-if="allClasses" v-model:value="edit.model.cls_stf_id_teacher" placeholder="请选择">
          <a-select-option v-for="item in staffList.filter(stf => stf.stf_category === 4)" :key="item.stf_id" :value="item.stf_id" :disabled="!item.stf_invalid">
            {{ item.stf_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="教务老师：" name="cls_stf_id_admin">
        <a-select allowClear v-if="allClasses" v-model:value="edit.model.cls_stf_id_admin" placeholder="请选择">
          <a-select-option v-for="item in staffList.filter(stf => stf.stf_category === 5)" :key="item.stf_id" :value="item.stf_id" :disabled="!item.stf_invalid">
            {{ item.stf_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="教学秘书：" name="cls_stf_id_job">
        <a-select allowClear v-if="allClasses" v-model:value="edit.model.cls_stf_id_job" placeholder="请选择">
          <a-select-option v-for="item in staffList.filter(stf => stf.stf_category === 6)" :key="item.stf_id" :value="item.stf_id" :disabled="!item.stf_invalid">
            {{ item.stf_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="班级备注：" name="cls_remark">
        <a-textarea v-model:value.trim="edit.model.cls_remark"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
