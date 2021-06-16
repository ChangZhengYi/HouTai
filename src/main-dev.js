import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.css";
import axios from "axios";

import TreeTable from "vue-table-with-tree-grid";
//导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
//导入富文本编辑器对应的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
import NProgress from "nprogress";
import "nprogress/nprogress.css";
axios.defaults.baseURL = "http://42.192.40.14:8889/api/private/v1/";
// axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/";

axios.interceptors.request.use((config) => {
    // console.log(config);
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});
axios.interceptors.response.use((config) => {
    NProgress.done();
    return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

Vue.component("tree-table", TreeTable);
//将富文本，注册为全局可用的组件
Vue.use(VueQuillEditor /* { default global options } */);

Vue.filter("dataFormat", function(originVal) {
    const dt = new Date(originVal);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + "").padStart(2, "0");
    const d = (dt.getDate() + "").padStart(2, "0");
    const hh = (dt.getHours() + "").padStart(2, "0");
    const mm = (dt.getMinutes() + "").padStart(2, "0");
    const ss = (dt.getSeconds() + "").padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");