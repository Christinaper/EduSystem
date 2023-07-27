<script setup lang="ts">

/* TS版本的defineEmits */
// 定义接口，只有一个函数类型的属性，表示组件可以触发一个名为"save"的事件，并传递一个User类型的参数func
interface EmitsType { (name: "save", func: User): void; }
const emit = defineEmits<EmitsType>(); // // 这个 emit 函数可以在 setup 中调用，用来触发组件的自定义事件
/* TS版本的defineProps */
interface PropsType { allUsers: User[] }
const props = defineProps<PropsType>();
const disabled = ref<boolean>(false);

// 编辑
const edit = reactive<Edit<User>>({
  isEdit: false,
  formRef: null,
  model: { 
    role_id: -1,
    user_name: '',
    user_pwd: ''
  },
  rules: {
    user_pwd: [{
      // @ts-ignore
      validator: (rule: any, value: string) => {
        if(value.length === 0) 
          return Promise.reject('* 新密码不能为空');
        else if(value.length < 3 || value.length > 10)
          return Promise.reject('* 新密码长度 3 - 10');
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
  handleEdit: (uName: string) => {
    // 执行编辑操作
    console.log('编辑', uName);
    const users = props.allUsers.find(item => item.user_name === uName) as User;
    edit.model = {...users};
    disabled.value = true;
    nextTick(() => {edit.isEdit = true});
  },
  beginAdd: () => {
    // 执行新增操作
    edit.formRef?.resetFields();
    edit.model = { role_id: 0, user_name: '', user_pwd: '' }
    disabled.value = false;
    nextTick(() => {edit.isEdit = true});
  },
  endEdit: () => {edit.isEdit = false}
})

const saveEditHandler = async () => {
  await edit.formRef?.validate(); 
  // edit.model.stu_born = dayjs(edit.model.stu_born).format('YYYY-MM-DD'); // 将日期转换为YYYY-MM-DD的格式
  emit("save", toRaw(edit.model))                                  // 表单验证       
}
</script>

<template>
  <a-modal title="编辑" :visible="edit.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveEditHandler" @cancel="edit.isEdit = false" force-render>
    <a-form :label-col="{span: 7}" :rules="edit.rules" :model="edit.model" :ref="el => edit.formRef = el">
      <a-form-item label="姓名" name="stu_name">
        <a-input v-model:value.trim="edit.model.user_name" :disabled="disabled"></a-input>
      </a-form-item>
      <a-form-item label="密码" name="stu_name">
        <a-input v-model:value.trim="edit.model.user_pwd"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
