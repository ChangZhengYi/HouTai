import Vue from "vue";
import VueRouter from "vue-router";
// import Login from "../components/login.vue";
const Login = () =>
    import(
        /* webpackChunkName: "login_home_welcome" */ "../components/login.vue"
    );
// import home from "../components/home.vue";
const home = () =>
    import(
        /* webpackChunkName: "login_home_welcome" */ "../components/home.vue"
    );
// import Welcome from "../components/welcome.vue";
const Welcome = () =>
    import(
        /* webpackChunkName: "login_home_welcome" */ "../components/welcome.vue"
    );

// import Users from "../components/user/users.vue";
const Users = () =>
    import(
        /* webpackChunkName: "Users_Rights_Roles" */ "../components/user/users.vue"
    );
// import Rights from "../components/power/Rights.vue";
const Rights = () =>
    import(
        /* webpackChunkName: "Users_Rights_Roles" */ "../components/power/Rights.vue"
    );
// import Roles from "../components/power/Roles.vue";
const Roles = () =>
    import(
        /* webpackChunkName: "Users_Rights_Roles" */ "../components/power/Roles.vue"
    );

// import Cate from "../components/goods/Cate.vue";
const Cate = () =>
    import(
        /* webpackChunkName: "Cate_Params" */ "../components/goods/Cate.vue"
    );
// import Params from "../components/goods/params.vue";
const Params = () =>
    import(
        /* webpackChunkName: "Cate_Params" */ "../components/goods/params.vue"
    );

// import List from "../components/goods/List.vue";
const List = () =>
    import(/* webpackChunkName: "List_Add" */ "../components/goods/List.vue");
// import Add from "../components/goods/add.vue";
const Add = () =>
    import(/* webpackChunkName: "List_Add" */ "../components/goods/add.vue");

// import Order from "../components/order/order.vue";
const Order = () =>
    import(
        /* webpackChunkName: "Order_Report" */ "../components/order/order.vue"
    );
// import Report from "../components/report/report.vue";
const Report = () =>
    import(
        /* webpackChunkName: "Order_Report" */ "../components/report/report.vue"
    );

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
            redirect: "/welcome",
            children: [
                { path: "/welcome", component: Welcome },
                { path: "/users", component: Users },
                { path: "/rights", component: Rights },
                { path: "/roles", component: Roles },
                { path: "/categories", component: Cate },
                { path: "/params", component: Params },
                { path: "/goods", component: List },
                { path: "/orders", component: Order },
                { path: "/goods/add", component: Add },
                { path: "/reports", component: Report },
            ],
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
