<template>
    <el-container class="home-container">
        <!--  头部区-->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">
                退出
            </el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="iscollapse ? '64px' : '200px'">
                <div class="to-button" @click="togglebutton">
                    |||
                </div>
                <!-- 侧边栏菜单区域 -->
                <el-menu
                    background-color="#81c4ab"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    unique-opened
                    :collapse="iscollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        :index="item.id + ''"
                        v-for="item in menulist"
                        :key="item.id"
                    >
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="icons[item.id]" class="iconfont"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="'/' + subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)"
                        >
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{ subItem.authName }}</span>
                            </template></el-menu-item
                        >
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧主体区 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view> </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    created() {
        this.getMenuList();

        this.activePath = window.sessionStorage.getItem("activePath");
    },
    props: {},
    data() {
        return {
            // 左侧菜单数据
            menulist: [],
            icons: {
                "125": "el-icon-s-custom",
                "103": "el-icon-s-check",
                "101": "el-icon-s-goods",
                "102": "el-icon-s-order",
                "145": "el-icon-s-marketing",
            },
            // 是否折叠
            iscollapse: false,
            //被激活的链接地址
            activePath: "",
        };
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        // 获取所有的菜单
        async getMenuList() {
            const { data: res } = await this.$http.get("menus");
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg);
            this.menulist = res.data;
            // console.log(res);
        },
        // 点击按钮,切换菜单的折叠与展开
        togglebutton() {
            this.iscollapse = !this.iscollapse;
        },
        //保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
        },
    },
    components: {},
};
</script>

<style scoped lang="less">
.home-container {
    height: 100%;
}
.el-header {
    background-color: #bbe6d6;
    display: flex;
    justify-content: space-between;
    // padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
        img {
            width: 50px;
            height: 50px;
        }
    }
    .el-button {
        background-color: #81c4ab;
        border: 0;
    }
}

.el-aside {
    background-color: #81c4ab;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.to-button {
    background-color: #69ddb2;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
