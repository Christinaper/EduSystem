<template>
  <video class="video-background" autoplay loop muted>
    <source src="../../assets/bgvideo.mp4" type="video/mp4">
  </video>
  <div class="formContainer">
    <a-form 
      ref="formRef"
      :model="model"
      :rules="rules"
      :label-col="{span: 8}"
    >
      <a-form-item
        label="Username"
        name="user_name"
        has-feedback
      >
        <a-input v-model:value="model.user_name">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Password"
        name="user_pwd"
        has-feedback
      >
        <a-input-password v-model:value="model.user_pwd">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" @click="login">
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </div>
  
</template>
<script setup lang="ts">
import { message } from 'ant-design-vue';

const router = useRouter();
const formRef = ref<FormInstance | null>(null);
const model = reactive<Login>({user_name: "", user_pwd: ""})
const rules: Record<keyof Login, Rule[]> = {
  user_name: [
    {required: true, message: "用户名不能为空", trigger: 'blur'}, // blur???
    {min: 5, max: 20, message: "请输入5-20位", trigger: 'blur'}
  ],
  user_pwd: [
    {required: true, message: "密码不能为空", trigger: 'blur'},
    {min: 3, max: 20, message: "请输入3-20位", trigger: 'blur'}
  ]
}

const login = async () => {
  // 表单验证触发
  await formRef.value?.validate();
  // Ajax发起登录请求
  const token = await api.user.login(toRaw(model))
  // 保存token，跳转页面到主页
  sessionStorage.setItem('token', token);
  router.replace("/home");
  message.info('✅✅✅✅✅✅✅✅');
}

const disabled = computed(() => {
  return !(model.user_name && model.user_pwd);
});
</script>

<style>
.ant-form-item-label > label {
  color: #fff;
}
.formContainer {
  width: 350px;
  text-align: center;
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ant-spin-nested-loading {
  position: relative;
  height: 100%;
}
.ant-spin-container {
  height: 100%;
}
</style>
