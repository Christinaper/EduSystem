<script setup lang="ts">
import { message } from 'ant-design-vue';
/* TS版本的defineEmits */
// 定义一个'EmitsType'接口，它规定了一个函数类型，该函数触发名为'save'的事件，并且参数类型为AvatarUpdate
interface EmitsType { (name: "save", func: AvatarUpdate): void; } 
// 使用defineEmits定义一个名为'emit'的函数，该函数可以用来触发事件(save事件)
const emit = defineEmits<EmitsType>();
const fileList = ref([]);
const previewVisible = ref(false);
// const previewImage = ref('');
// 定义一个名为preUpload的函数，用于在上传前对文件进行检查，包括格式、大小验证，返回true/false来控制是否允许上传
const preUpload = (file: any) => {
  const isJPG = file.type === 'image/jpeg';
  const isPng = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if(!isJPG && !isPng) {
    message.error('上传头像图片只能是JPG格式或者PNG格式!');
  }
  if (!isLt2M) {
    message.error('上传头像图片大小不能超过 2MB!');
  }
  return (isJPG || isPng) && isLt2M; 
}
// 用于关闭预览图片对话框，并在需要时设置 file.raw.status 属性
const handleCancel = () => {
  // if(file && file.raw) file.raw.status = file.status;
  previewVisible.value = false;
}
// 用于处理文件列表的改变事件，根据文件状态来更新 fileList
// const handleChange = (data: any) => {
//   console.log(data);
//   if (data.file.status == "removed") {
//     fileList.value = data.fileList;
//   }
// };
// 用于处理预览图片事件
const thumbUrl = ref('')
const handlePreview = async (file: any) => {
  console.log(file);
  thumbUrl.value = file.thumbUrl; // Base64编码
  previewVisible.value = true;
}
// 预上传操作
const uploadImage = async (file: any) => {
  const formData = new FormData(); // 创建一个新的FormData对象，用于将上传的文件数据和其他表单数据封装成一个可提交的数据对象
  formData.append('avatar', file.file); // 将文件对象file.file添加到formData对象中; avatar是后端接口所需的参数名; file.file是a-upload组件传递过来的文件对象
  // formData.append('token', sessionStorage.getItem('token') || '')
  api.student.avatarupload(formData)
    .then(response => {
      // 获取预上传到服务器后的临时文件的名字
      stuUpload.model.stu_avatar_new = response;
      if(fileList.value.length > 1) fileList.value.shift(); // 控制fileList长度，显示最新上传的文件
      file.onSuccess(); // 上传中成功时必须执行 onSuccess() ，这样才能让正在上传的图片呈现为上传成功状态，不然会一直显示在上传中。
      return response;
    })
    .catch(error => {
      console.log(error);
      file.onError();
      throw error;
    })
    // if (file && file.raw) {
    //   file.raw.status = file.status; // 保存上传文件的状态(未使用
    // }
}

const stuUpload = reactive<Edit<AvatarUpdate>>({
  isEdit: false,
  formRef: null,
  model: {stu_avatar_old: '', stu_avatar_new: '', stu_id: 0}
})

// defineExpose对外公开可供外部直接访问的数据和方法
defineExpose({
  handleArchivePhoto: (stu_id: number, stu_avatar_old: string | undefined) => {
    // 执行照片存档操作
    console.log('照片存档', stu_id);
    stuUpload.model = { stu_id, stu_avatar_old, stu_avatar_new: ""  }
    nextTick(() => {stuUpload.isEdit = true});
  },
  endEdit: () => {stuUpload.isEdit = false}
})

const saveHandler = async () => {
  await stuUpload.formRef?.validate(); // 表单验证
  emit("save", toRaw(stuUpload.model)) // 触发save事件
}
</script>

<template>
  <a-modal title="照片存档" :visible="stuUpload.isEdit" :closable="false" :mask-closable="false"  :keyboard="false"
    ok-text="确定" cancel-text="取消" @ok="saveHandler" @cancel="stuUpload.isEdit = false" force-render>
    <a-row>
      <a-col :span="12">
        <a-image
          :width="200"
          :src="`${stuUpload.model.stu_avatar_old}`"
          fallback="data:image/png;base64,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"
        />
      </a-col>
      <a-col :span="12">
        <div class="clearfix">
          <a-upload
            name="avatar"
            v-model:file-list="fileList"
            accept="image/jpeg, image/png"
            :before-upload="preUpload"
            :custom-request="uploadImage"
            list-type="picture-card"
            @preview="handlePreview"
          >
            <div v-if="fileList.length < 2">
              <plus-outlined />
              <div style="margin-top: 8px">上传</div>
            </div>
          </a-upload>
          <a-modal v-model:visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="thumbUrl" />
          </a-modal>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>