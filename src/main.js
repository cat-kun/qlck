import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons'
import App from './App.vue'

const app = createApp(App)

// 注册Icons 全局组件
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key])
})

app.use(ElementPlus)
app.mount('#app')
