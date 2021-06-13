<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="adddialogVisible = true">
                        添加角色
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="rolelist" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row
                            :class="[
                                'bdbottom',
                                i1 === 0 ? 'bdtop' : '',
                                'vcenter',
                            ]"
                            v-for="(item1, i1) in scope.row.children"
                            :key="item1.id"
                        >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag
                                    @close="
                                        removerightbyid(scope.row, item1.id)
                                    "
                                    closable
                                    >{{ item1.authName }}</el-tag
                                >
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二 三级权限 -->
                            <el-col :span="19">
                                <el-row
                                    :class="[
                                        i2 === 0 ? '' : 'bdtop',
                                        'vcenter',
                                    ]"
                                    v-for="(item2, i2) in item1.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            type="success"
                                            @close="
                                                removerightbyid(
                                                    scope.row,
                                                    item2.id
                                                )
                                            "
                                            closable
                                            >{{ item2.authName }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            type="warning"
                                            v-for="(item3,
                                            i3) in item2.children"
                                            :key="item3.id"
                                            @close="
                                                removerightbyid(
                                                    scope.row,
                                                    item3.id
                                                )
                                            "
                                            closable
                                        >
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>{{ scope.row }}</pre> -->
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row.id)"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="removeUserById(scope.row.id)"
                            >删除</el-button
                        >
                        <el-button
                            type="warning"
                            icon="el-icon-setting"
                            size="mini"
                            @click="showSetRightDialog(scope.row)"
                            >分配权限</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="adddialogVisible"
            width="50%"
            @close="adddialog()"
        >
            <!-- 内容主体区 -->
            <el-form :model="addForm" ref="addFormref" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="addForm.roleDesc"></el-input>
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
            title="修改角色"
            :visible.sync="editdialogVisible"
            width="50%"
            @close="editdialog()"
        >
            <el-form :model="editForm" ref="editFormRef" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="edituserinfo"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 分配权限的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed"
        >
            <!-- 树形控件 -->
            <el-tree
                :data="rightslist"
                :props="treetProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defkeys"
                ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            //所有角色列表数据
            rolelist: [],
            total: 0,
            // 控制添加对话框的显示与隐藏
            adddialogVisible: false,
            //控制修改用户对话框的显示与隐藏
            editdialogVisible: false,
            //查询到的用户信息对象
            editForm: "",

            //添加用户的表单数据
            addForm: {
                roleName: "",
                roleDesc: "",
                roleId: "",
            },
            //控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            //所有权限的数据
            rightslist: [],
            //树形控件的属性绑定对象
            treetProps: {
                label: "authName",
                children: "children",
            },
            //默认选中的节点id值数组
            defkeys: [],
            //即将分配权限的角色id
            roleId: "",

        };
    },
    created() {
        this.getRolesList();
    },
    methods: {
        async getRolesList(id) {
            const { data: res } = await this.$http.get("roles");
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败！！");
            }
            this.rolelist = res.data;
        },
        async userChanged(userinfo) {
            console.log(userinfo);
            const { data: res } = await this.$http.put(
                `roles/${userinfo.id}/state/${userinfo.mg_state}`
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
                    "roles",
                    this.addForm
                );
                if (res.meta.status !== 201) {
                    return this.$message.error("添加用户失败！！");
                }

                //隐藏添加的对话框
                this.adddialogVisible = false;
                //重新获取用户列表
                this.getRolesList();
                this.$message.success("添加用户成功");
            });
        },
        //点击编辑用户的对话框
        async showEditDialog(id) {
            // console.log(id);
            const { data: res } = await this.$http.get("roles/" + id);
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
                    "roles/" + this.editForm.roleId,
                    {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc,
                    }
                );
                if (res.meta.status !== 200) {
                    return this.$message.error("更新用户信息失败！！");
                }

                //隐藏添加的对话框
                this.editdialogVisible = false;
                //重新获取用户列表
                this.getRolesList();
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
            const { data: res } = await this.$http.delete("roles/" + id);
            if (res.meta.status !== 200) {
                return this.$message.error("删除用户失败！！");
            }
            this.$message.success("删除用户成功！！");
            this.getRolesList();
        },
        //根据id删除对应的权限
        async removerightbyid(role, rightId) {
            //弹框提示用户是否要删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除该文件, 是否继续?",
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
            const { data: res } = await this.$http.delete(
                `roles/${role.id}/rights/${rightId}`
            );
            if (res.meta.status !== 200) {
                return this.$message.error("删除权限失败！！");
            }
            this.$message.success("删除权限成功！！");
            // this.getRolesList();
            role.children = res.data;
        },
        //展示分配权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id;
            //获取所有权限的数据
            const { data: res } = await this.$http.get("rights/tree");
            if (res.meta.status !== 200) {
                return this.$message.error("获取权限数据失败！！");
            }
            this.rightslist = res.data;
            // console.log(this.rightslist);
            this.getleafKeys(role, this.defkeys);
            this.setRightDialogVisible = true;
        },
        //通过递归的形式，获取角色下所有的3级权限的id,并保存到  defkeys 数组中
        getleafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach((item) => this.getleafKeys(item, arr));
        },
        //监听分配对话框的关闭事件
        setRightDialogClosed() {
            this.defkeys = [];
        },
        //点击为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            const idStr = keys.join(",");
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                {
                    rids: idStr,
                }
            );
            if (res.meta.status !== 200) {
                return this.$message.error("更新权限失败！！");
            }
            this.$message.success("更新权限成功！！");
            // this.getRolesList();
            this.getRolesList();
            this.setRightDialogVisible = false;
        },
    },
    components: {},
};
</script>

<style scoped lang="less">
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
