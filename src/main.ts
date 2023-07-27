import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.less' // 引入官方提供的 less 样式入口文件
import { StoreInstaller } from './store'

createApp(App).use(router).use(StoreInstaller).mount('#app')
