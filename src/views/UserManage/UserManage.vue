<script setup lang="ts">
import { ApartmentOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
import { fetchUserList, roleList, getRoleName } from '../../hooks/useUserList'
import UserEdit from './UserEdit.vue';
import { Modal, message } from 'ant-design-vue';

const allUsers = ref<User[]>([]);
const searchValue = ref('');
const selectedRole = ref(null);
const userEditRef = ref<InstanceType<typeof UserEdit> | null>(null)
const edit = reactive<Edit<User>>({
  isEdit: false,
  formRef: null,
  model: { 
    role_id: -1,
    user_name: '',
    user_pwd: ''
  },
})
const page = ref({ // 用于保存分页信息
  total: 0,
  pageSize: 5,
  current: 1,
})

onMounted(async () => {
  await fetchList();
})
const fetchList = async() => {
  const {list, total} = await fetchUserList(selectedRole.value, searchValue.value);
  allUsers.value = list;
  console.log(total);
}

const columns = [
  { title: "用户名", dataIndex: "user_name" },
  { title: "用户密码", dataIndex: "user_pwd", slots: { customRender: 'pwd' } },
  { title: "角色", dataIndex: "role_id", slots: { customRender: 'role' } },
  { title: "操作", slots: { customRender: 'edit' } }
];

const filteredUsers = computed(() => {
  return selectedRole.value ? allUsers.value.filter(item => item.role_id === selectedRole.value) : allUsers.value;
})
const handleChange = (value: any) => {
  selectedRole.value = value;
  fetchList();
}
const onSearch = async (svaule: string) => {
  searchValue.value = svaule;
  fetchList();
};
const remove = async (uName: string) => {
  // 是否删除
  Modal.confirm({
    title: '确认删除',
    content: `确定删除用户【${uName}】吗？`,
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await api.user.remove(uName);
        fetchList();
        message.success('删除成功');
      } catch (error) {
        message.error('删除失败，请重试');
      }
    }
  })
}

const saveEditHandler = async (model: User) => {
  // console.log(model);
  await api.user[model.user_name ? 'update' : 'add'](model) // 发ajax
  fetchList();                                                 // 再次发起ajax请求全部的角色数据                                           // 提示用户成功
  message.success(`员工${model.user_name ? '编辑' : '新增'}成功`)             // 关闭modal
  userEditRef.value?.endEdit(); 
}
const handleRole = (uName: string) => {
  // 执行编辑操作
  console.log('编辑', uName);
  const users = allUsers.value.find(item => item.user_name === uName) as User;
  if (users) {
    edit.model = { ...users };
    nextTick(() => { edit.isEdit = true });
  } else {
    console.log('用户不存在或数据未加载');
  }
}
const confirm = async () => {
  await api.user.config(edit.model);
  fetchList();                                                 // 再次发起ajax请求全部的角色数据                                           // 提示用户成功
  message.success(`【${edit.model.user_name}】角色更新成功`)             // 关闭modal
  userEditRef.value?.endEdit(); 
}
const handlePageChange = (pageNum: number) => {
  page.value.current = pageNum;
}
</script>

<template>
  <UserEdit :all-users="allUsers" ref="userEditRef" @save="saveEditHandler" />
  <a-table v-if="allUsers" :data-source="filteredUsers" :columns="columns" scoped
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
          <a-button type="primary" shape="circle" :icon="h(PlusOutlined)" @click="userEditRef?.beginAdd" />
        </a-tooltip>
        <a-input-search
          v-model:value="searchValue"
          placeholder="键入姓名搜索"
          @search="onSearch"
        />
        <a-select v-if="allUsers" v-model="selectedRole" placeholder="角色" allowClear @change="handleChange" style="width: 150px">
          <a-select-option v-for="item in roleList" :key="item.role_id" :value="item.role_id">
            {{ item.role_name }}
          </a-select-option>
        </a-select>
      </a-space>
    </template>
    <template #role="{ text }">
      {{ getRoleName(text) }}
    </template>
    <template #pwd="{ text }">
      <a-popover placement="right">
        <template #content>
          <p>{{ text }}</p>
        </template>
        <template #title>
          <span>密码</span>
        </template>
        <a-button :icon="h(EyeOutlined)">查看</a-button>
      </a-popover>
    </template>
    <template #edit="{ record }">
      <a-space warp>
        <a-tooltip title="编辑">
          <a-button type="primary" shape="circle" :icon="h(EditOutlined)" @click="userEditRef?.handleEdit(record.user_name)" />
        </a-tooltip>
        <a-tooltip title="删除">
          <a-button danger ghost :icon="h(DeleteOutlined)" @click="remove(record.user_name)">删除</a-button>
        </a-tooltip>
        <a-tooltip title="角色分配">
          <a-popconfirm placement="right" ok-text="分配" cancel-text="取消" @confirm="confirm">
            <template #icon><api-outlined style="color: #ff4655" /></template>
            <template #title>
              <a-select v-model:value="edit.model.role_id" placeholder="角色" allowClear style="width: 200px;">
                <a-select-option v-for="item in roleList" :key="item.role_id" :value="item.role_id">
                  {{ item.role_name }}
                </a-select-option>
              </a-select>
            </template>
            <a-button type="primary" ghost :icon="h(ApartmentOutlined)" @click="handleRole(record.user_name)">角色分配</a-button>
          </a-popconfirm>
        </a-tooltip>
      </a-space>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
</style>