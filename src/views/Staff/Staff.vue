<script setup lang="ts">

import { message } from 'ant-design-vue';
import StaffEdit from './StaffEdit.vue';
import { EditOutlined, UserDeleteOutlined, UserAddOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
import { fetchStaffList, getCategoryName, staffCategory } from '../../hooks/useStaffList';

// 获取员工列表
const allStaffs = ref<Staff[]>([])
const value = ref('');
const selectedCategory = ref(null);
// 用于保存StaffEdit组件的引用
/* 泛型语法<InstanceType<typeof StaffEdit> | null>
  表示staffEditRef可持有两种类型之一:
  1. InstanceType<typeof StaffEdit>: 表示StaffEdit组件的实例类型
  2. null: 可持有空值
*/
const staffEditRef = ref<InstanceType<typeof StaffEdit> | null>(null) 
const page = ref({ // 用于保存分页信息
  total: 0,
  pageSize: 5,
  current: 1,
})

onMounted(async () => {
  await fetchList();
})
const fetchList = async() => {
  const {list, total} = await fetchStaffList(selectedCategory.value, value.value);
  allStaffs.value = list;
  page.value.total = total;
}

const columns = [
  { title: "姓名", dataIndex: "stf_name" },
  { title: "职务类型", dataIndex: "stf_category", slots: { customRender: 'stf_category' } },
  { title: "备注", dataIndex: "stf_remark", ellipsis: true, width: 320 },
  { title: "员工状态", dataIndex: "stf_invalid", slots: { customRender: 'stf_invalid' } },
  { title: "操作", slots: { customRender: 'stf_edit' } },
];
const filteredStaffs = computed(() => { // 过滤
  return selectedCategory.value ? allStaffs.value.filter(staff => staff.stf_category === selectedCategory.value) : allStaffs.value;
})

const handleChange = (value: any) => {
  selectedCategory.value = value;
  fetchList();
}
const onSearch = async (searchValue: string) => {
  console.log('use value', searchValue);
  value.value = searchValue;
  fetchList();
};
const dimission = async (stf_id: any) => {
  console.log(stf_id);
  await api.staff.dimission(stf_id);
  fetchList();
  message.success("离职成功");
}
const hire = async (stf_id: any) => {
  console.log(stf_id);
  await api.staff.hire(stf_id);
  fetchList();
  message.success("入职成功");
}

const saveHandler = async (model: Staff) => {
  await api.staff[model.stf_id ? 'update' : 'add'](model) // 发ajax
  fetchList();                                                 // 再次发起ajax请求全部的角色数据                                           // 提示用户成功
  message.success(`员工${model.stf_name ? '编辑' : '新增'}成功`)             // 关闭modal
}
const handlePageChange = (pageNum: number) => {
  page.value.current = pageNum;
}
</script>

<template>
  <!-- 自定义组件 -->
  <!-- 通过':all-staffs'属性，将allStaffs变量传给<staff-edit>组件 -->
  <!-- 通过ref属性将组件实例赋值给staffEditRef变量，我们可以通过staffEditRef变量访问<staff-edit>组件的实例，从而调用组件的方法和访问组件的属性 -->
  <staff-edit :all-staffs="allStaffs" ref="staffEditRef" @save="saveHandler" />
  <a-table v-if="allStaffs" :data-source="filteredStaffs" :columns="columns" scoped
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
          <a-button type="primary" shape="circle" :icon="h(PlusOutlined)" @click="staffEditRef?.beginAdd" />
        </a-tooltip>
        <a-input-search
          v-model:value="value"
          placeholder="键入姓名搜索"
          style="width: 200px"
          @search="onSearch"
        />
        <a-select allowClear v-if="allStaffs" v-model="selectedCategory" placeholder="请选择员工类型" @change="handleChange">
          <a-select-option v-for="item in staffCategory" :key="item.dic_id" :value="item.dic_id">
            {{ item.dic_name }}
          </a-select-option>
        </a-select>
      </a-space>
    </template>
    <template #stf_category="{ text }">
      {{ getCategoryName(text) }}
    </template>
    <template #stf_invalid="{ text }">
      <a-tag :color="text ? 'cyan' : 'pink'">
        {{ text ? '在职' : '离职' }}
      </a-tag>
    </template>
    <template #stf_edit="{ record }">
      <a-space warp>
        <a-tooltip title="编辑">
          <a-button type="primary" shape="circle" :icon="h(EditOutlined)" @click="staffEditRef?.beginUpdate(record.stf_id)"  />
        </a-tooltip>
        <a-tooltip title="离职" v-if="record.stf_invalid">
          <a-button danger ghost :icon="h(UserDeleteOutlined)" @click="dimission(record.stf_id)">离职</a-button>
        </a-tooltip>
        <a-tooltip title="入职" v-else>
          <a-button type="primary" ghost :icon="h(UserAddOutlined)" @click="hire(record.stf_id)">入职</a-button>
        </a-tooltip>
      </a-space>
    </template>
  </a-table>
</template>
