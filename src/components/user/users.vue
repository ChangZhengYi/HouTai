<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="queryInof.query"
                        clearable
                        @clear="getUserList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="adddialogVisible = true">
                        添加用户
                    </el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column label="#" type="index"> </el-table-column>
                <el-table-column label="姓名" prop="username">
                </el-table-column>

                <el-table-column label="邮箱" prop="email"> </el-table-column>
                <el-table-column label="电话" prop="mobile"> </el-table-column>
                <el-table-column label="角色" prop="role_name">
                </el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="userChanged(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210px">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-tooltip
                            effect="dark"
                            content="修改"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <!-- 删除 -->
                        <el-tooltip
                            effect="dark"
                            content="删除"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeUserById(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="setrole(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInof.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInof.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="adddialogVisible"
            width="50%"
            @close="adddialog()"
        >
            <!-- 内容主体区 -->
            <el-form
                :model="addForm"
                :rules="addFormrules"
                ref="addFormref"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editdialogVisible"
            width="50%"
            @close="editdialog()"
        >
            <el-form
                :model="editForm"
                :rules="editFormrules"
                ref="editFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="edituserinfo"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 分配角色的对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setroledialogVisible"
            width="50%"
            @close="setroledialogClosed"
        >
            <div>
                <p>当前的用户:{{ uesrinfo.username }}</p>
                <p>当前的角色:{{ uesrinfo.role_name }}</p>
                <p>
                    分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                            v-for="item in roleslist"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setroledialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="saveRoleInfo"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        //验证邮箱的规则
        var checkEmail = (rule, value, callback) => {
            const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if (regEmail.test(value)) {
                return callback();
            }
            callback(new Error("请输入合法的邮箱"));
        };
        //验证手机号的规则
        var checkMobile = (rule, value, callback) => {
            const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
            if (regmobile.test(value)) {
                return callback();
            }
            callback(new Error("请输入合法的手机号码"));
        };
        return {
            // 获取用户列表的参数对象
            queryInof: {
                query: "",
                // 当前页数
                pagenum: 1,
                //当前每页显示多少条数据
                pagesize: 2,
            },
            userlist: [],
            total: 0,
            // 控制添加对话框的显示与隐藏
            adddialogVisible: false,
            //添加用户的表单数据
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
            //添加表单的验证规则对象
            addFormrules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 10,
                        message: "用户名长度在 3 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                    {
                        min: 6,
                        max: 15,
                        message: "密码长度在 6 到 15 个字符",
                        trigger: "blur",
                    },
                ],
                email: [
                    {
                        required: true,
                        message: "请输入邮箱",
                        trigger: "blur",
                    },
                    {
                        validator: checkEmail,
                        trigger: "blur",
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    {
                        validator: checkMobile,
                        trigger: "blur",
                    },
                ],
            },
            //控制修改用户对话框的显示与隐藏
            editdialogVisible: false,
            //控制分配角色对话框的显示与隐藏
            setroledialogVisible: false,
            //查询到的用户信息对象
            editForm: "",
            //需要被分配角色的用户信息
            uesrinfo: {},
            //已选中的角色id值
            selectedRoleId: "",
            //所有角色的数据列表
            roleslist: [],

            //修改表单的验证规则对象
            editFormrules: {
                email: [
                    {
                        required: true,
                        message: "请输入邮箱",
                        trigger: "blur",
                    },
                    {
                        validator: checkEmail,
                        trigger: "blur",
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    {
                        validator: checkMobile,
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get("users", {
                params: this.queryInof,
            });
            if (res.meta.status !== 200)
                return this.$message.error("获取用户列表失败");
            this.userlist = res.data.users;
            this.total = res.data.total;
            // console.log(res);
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.queryInof.pagesize = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.queryInof.pagenum = val;
            this.getUserList();
        },
        async userChanged(userinfo) {
            console.log(userinfo);
            const { data: res } = await this.$http.put(
                `users/${userinfo.id}/state/${userinfo.mg_state}`
            );
            if (res.meta.status !== 200) {
                uesrinfo.mg_state = !uesrinfo.mg_state;
                return this.$message.error("更新用户状态失败！！");
            }
            this.$message.success("更新用户状态成功");
        },
        //监听添加用户对话框的添加事件
        adddialog() {
            this.$refs.addFormref.resetFields();
        },
        //点击按钮添加新用户
        addUser() {
            this.$refs.addFormref.validate(async (valid) => {
                if (!valid) return;
                //可以发起添加用户的请求
                const { data: res } = await this.$http.post(
                    "users",
                    this.addForm
                );
                if (res.meta.status !== 201) {
                    return this.$message.error("添加用户失败！！");
                }

                //隐藏添加的对话框
                this.adddialogVisible = false;
                //重新获取用户列表
                this.getUserList();
                this.$message.success("添加用户成功");
            });
        },
        //点击编辑用户的对话框
        async showEditDialog(id) {
            // console.log(id);
            const { data: res } = await this.$http.get("users/" + id);
            if (res.meta.status !== 200) {
                return this.$message.error("查询用户信息失败！！");
            }
            this.editForm = res.data;
            this.editdialogVisible = true;
        },
        //监听修改用户对话框的关闭事件
        editdialog() {
            this.$refs.editFormRef.resetFields();
        },
        //修改用户信息并提交
        edituserinfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return;
                //可以发起修改用户的请求
                const { data: res } = await this.$http.put(
                    "users/" + this.editForm.id,
                    {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile,
                    }
                );
                if (res.meta.status !== 200) {
                    return this.$message.error("更新用户信息失败！！");
                }

                //隐藏添加的对话框
                this.editdialogVisible = false;
                //重新获取用户列表
                this.getUserList();
                this.$message.success("更新用户信息成功");
            });
        },
        //根据id删除对应的id信息
        async removeUserById(id) {
            //弹框询问是否删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除该用户, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (confirmResult !== "confirm") {
                return this.$message.info("已取消删除");
            }
            const { data: res } = await this.$http.delete("users/" + id);
            if (res.meta.status !== 200) {
                return this.$message.error("删除用户失败！！");
            }
            this.$message.success("删除用户成功！！");
            this.getUserList();
        },
        //展示分配角色的对话框
        async setrole(uesrinfo) {
            this.uesrinfo = uesrinfo;

            //获取所有角色的列表
            const { data: res } = await this.$http.get("roles");
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败！！");
            }
            this.roleslist = res.data;
            this.setroledialogVisible = true;
        },
        //点击按钮，分配角色
        async saveRoleInfo() {
            if (!this.selectedRoleId) {
                return this.$message.error("请选择要分配的角色");
            }
            const { data: res } = await this.$http.put(
                `users/${this.uesrinfo.id}/role`,
                {
                    rid: this.selectedRoleId,
                }
            );
            if (res.meta.status !== 200) {
                return this.$message.error("更新用户角色失败！！");
            }
            this.$message.success("更新用户角色成功！！");
            this.getUserList();
            this.setroledialogVisible = false;
        },
        //监听分配角色对话框的关闭事件
        setroledialogClosed() {
            this.selectedRoleId = "";
            this.uesrinfo = "";
        },
    },
    components: {},
};
</script>

<style scoped lang="less"></style>
