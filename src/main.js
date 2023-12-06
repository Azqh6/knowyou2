import { createApp } from 'vue'
import './assets/base.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './assets/icon/iconfont.css'

import router from './router/router'
import App from './App.vue'

// 全局方法
import Request from '@/utils/Request.js'
import Verify from '@/utils/Verify'
import Message from '@/utils/Message'

const app=createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(router)

app.config.globalProperties.Verify=Verify
app.config.globalProperties.Request=Request
app.config.globalProperties.Message=Message

app.mount('#app')
