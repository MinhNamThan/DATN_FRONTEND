import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "./theme/theme.less";

createApp(App).use(Antd).use(store).use(router).mount('#app')
