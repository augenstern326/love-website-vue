import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'
import './assets/js/main.js'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App);

app.use(Antd);
app.mount('#app');
