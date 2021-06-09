<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="active_box">
                <img src="../assets/logo.png" alt="" />
            </div>
            <!-- 登录表单区 -->
            <el-form
                label-width="0px"
                class="login_Form"
                :model="loginForm"
                :rules="rules"
                ref="ruleForm"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        prefix-icon="el-icon-user"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                        prefix-icon="el-icon-lock"
                        show-password
                        v-model="loginForm.password"
                    ></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="submitForm('ruleForm')"
                        >登录</el-button
                    >
                    <el-button type="info" @click="resetForm('ruleForm')"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                username: "admin",
                password: "123456",
            },
            rules: {
                // 验证用户名是否合法
                username: [
                    {
                        required: true,
                        message: "请输入登录名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 5,
                        message: "长度在 3 到 5 个字符",
                        trigger: "blur",
                    },
                ],
                // 验证密码是否合法
                password: [
                    {
                        required: true,
                        message: "请输入登录名称",
                        trigger: "blur",
                    },
                    {
                        min: 6,
                        max: 15,
                        message: "长度在 6 到 15 个字符",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // alert("登陆成功");
                    const { data: res } = await this.$http.post(
                        "login",
                        this.loginForm
                    );
                    if (res.meta.status !== 200)
                        return this.$message.error("登录失败");
                    this.$message.success("登录成功");
                    console.log(res);
                    window.sessionStorage.setItem('token',res.data.token)
                    this.$router.push('/home')
                } else {
                    // console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    },
    components: {},
};
</script>

<style scoped lang="less">
.login_container {
    height: 100%;
    background-color: #2b4b6b;
    text-align: center;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .active_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10 #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.btns {
    display: flex;

    justify-content: flex-end;
}
.login_Form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
