import { createApp } from 'vue'
import './assets/base.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './assets/icon/iconfont.css'

import router from './router/router'

import VueCookies from 'vue-cookies'
import store from './store/index.js'
import App from './App.vue'

// 全局方法
import Request from '@/utils/Request.js'
import Verify from '@/utils/Verify'
import Message from '@/utils/Message'
import Utils from './utils/Utils.js'
import Confirm from './utils/Utils'
//全局组件
import Avatar from '@/components/Avatar.vue'
import DataList from '@/components/DataList.vue'
const app=createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
app.use(router)
app.use(VueCookies)
app.use(store)
app.config.globalProperties.globalInfo={
  bodyWidth:1300,
  avatarUrl:"/api/file/getAvatar/",
  imageUrl:'/api/file/getImage/'
}
app.config.globalProperties.Verify=Verify
app.config.globalProperties.Request=Request
app.config.globalProperties.Message=Message
app.config.globalProperties.VueCookies=VueCookies
app.config.globalProperties.Utils=Utils
app.config.globalProperties.Confirm=Confirm
 
app.component('Avatar',Avatar)
app.component('DataList',DataList)
app.mount('#app')
