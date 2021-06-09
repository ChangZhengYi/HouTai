import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import home from "../components/home.vue";
Vue.use(VueRouter);

const routes = [];

const router = new VueRouter({
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/login",
            component: Login,
        },
        {
            path: "/home",
            component: home,
        },
    ],
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 从哪个路径跳转而来
    // next 是一个函数，表示放行
    // next( ) 放行   next('/login') 强制跳转
    if (to.path === "/login") return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) return next("/login");
    next();
});

export default router;