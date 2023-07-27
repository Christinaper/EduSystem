<script setup lang="ts">
import { message } from 'ant-design-vue';

const formRef = ref<FormInstance | null>(null);
const edit = reactive<Edit<PwdChange>>({
  isEdit: false,
  formRef: null,
  model: {oldPwd: "", newPwd: "", newPwdAgain: ""},
  rules: markRaw({
    oldPwd: [
      {
        validator: (_: any, value: string) => {
          if(value.length === 0) 
            return Promise.reject('* 旧密码不能为空');
          else if(value.length > 20 || value.length < 2)
            return Promise.reject('* 旧密码长度在2-10')
          else
            return Promise.resolve();
        },
        trigger: 'blur'
      }
    ],
    newPwd: [
      {
        validator: (_: any, value: string) => {
          if(value.length === 0) 
            return Promise.reject('* 新密码不能为空');
          else if(value.length > 20 || value.length < 2)
            return Promise.reject('* 新密码长度在2-10')
          else
            return Promise.resolve();
        },
        trigger: 'blur'
      }
    ],
    newPwdAgain: [
      {
        validator: (_: any, value: string) => {
          if(value.length === 0) 
            return Promise.reject('* 请确认新密码');
          else if(edit.model.newPwd !== value)
            return Promise.reject('* 与新密码不同,请重新确认！')
          else
            return Promise.resolve();
        },
        trigger: 'blur'
      }
    ]
  })
})
const saveHandler = async () => {
  // 表单验证触发
  edit.formRef?.validate();
  try {
    // 等待api返回结果
    const response = await api.user.pwdchange(edit.model);
    // 根据结果显示不同的消息
    if (response.data.success) { // 假设成功标识字段为 success
      message.info('密码修改成功');
    } else {
      message.error('密码修改失败，请重试');
    }
  } catch (error) {
    // 捕获并处理错误
    // message.error('密码修改失败，请检查您的网络连接或稍后再试');
    console.error(error);
  } finally {
    // 清空edit.model中的数据
    edit.model.oldPwd = "";
    edit.model.newPwd = "";
    edit.model.newPwdAgain = "";
  }
}

const disabled = computed(() => {
  return !(edit.model.newPwdAgain && edit.model.oldPwd);
});
</script>

<template>
  <div class="formContainer">
    <a-form 
      ref="formRef"
      :model="edit.model"
      :rules="edit.rules"
      :label-col="{span: 8}"
    >
      <a-form-item
        label="原始密码"
        name="oldPwd"
        has-feedback
      >
        <a-input-password v-model:value.trim="edit.model.oldPwd">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        label="新密码"
        name="newPwd"
        has-feedback
      >
        <a-input-password v-model:value.trim="edit.model.newPwd">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        label="确认新密码"
        name="newPwdAgain"
        has-feedback
      >
        <a-input-password v-model:value.trim="edit.model.newPwdAgain">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" @click="saveHandler">
          修改密码
        </a-button>
      </a-form-item>
    </a-form>
  </div>
  
</template>

<style>
.formContainer {
  width: 350px;
  text-align: center;
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.ant-spin-nested-loading {
  position: relative;
  height: 100%;
}
.ant-spin-container {
  height: 100%;
}
</style>
