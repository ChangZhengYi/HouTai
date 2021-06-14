<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <!-- <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="queryInof.query"
                        clearable
                        @clear="getUserList"
                    > -->
                    <el-button type="primary" @click="showadddcatedialog">
                        添加分类
                    </el-button>
                    <!-- </el-input> -->
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table
                class="treetable"
                :data="catelist"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                :show-index="true"
                index-text="#"
                border
            >
                <!-- //是否有效 -->
                <template slot="isok" slot-scope="scope"
                    ><i
                        class="el-icon-success"
                        v-if="scope.row.cat_deleted === false"
                        style="color:lightgreen"
                    ></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>

                <!-- //排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">
                        一级</el-tag
                    >
                    <el-tag
                        type="success"
                        size="mini"
                        v-else-if="scope.row.cat_level === 1"
                        >二级</el-tag
                    >
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- //'操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="showEditDialog(scope.row.cat_id)"
                        >编辑</el-button
                    >
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="removeUserById(scope.row.cat_id)"
                        >删除</el-button
                    >
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querinfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="querinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addcatedialogVisible"
            width="50%"
            @close="addcatedialogClosed"
        >
            <!-- 添加分类的表单 -->
            <el-form
                :model="addcateform"
                :rules="addcateformrules"
                ref="addcateformref"
                label-width="100px"
            >
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addcateform.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <el-cascader
                        v-model="selectedkeys"
                        :options="parentcatelist"
                        expandTrigger="hover"
                        @change="parentCateChanged"
                        clearable
                        :props="{
                            checkStrictly: true,
                            value: 'cat_id',
                            label: 'cat_name',
                            children: 'children',
                        }"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addcatedialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类的对话框 -->
        <el-dialog
            title="修改分类"
            :visible.sync="editdialogVisible"
            width="50%"
            @close="editdialog()"
        >
            <el-form :model="editForm" ref="editFormRef" label-width="70px">
                <el-form-item label="分类">
                    <el-input v-model="addcateform.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="edituserinfo"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
        this.getCatelist();
    },
    props: {},
    data() {
        return {
            //查询条件
            querinfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            //商品分类的数据列表 ，默认为空
            catelist: [],
            //总数据条数
            total: 0,
            //控制添加分类对话框的显示与隐藏
            addcatedialogVisible: false,
            //添加分类的表单数据对象
            addcateform: {
                //将要添加的分类的名称
                cat_name: "",
                //父级分类的id
                cat_pid: 0,
                //分类的等级，默认添加的是一级分类
                cat_level: 0,
            },
            //添加分类表单的验证规则对象
            addcateformrules: {
                cat_name: [
                    {
                        required: true,
                        message: "请输入分类名称",
                        trigger: "blur",
                    },
                ],
            },
            //为table指定列的定义
            columns: [
                {
                    label: "分类名称",
                    prop: "cat_name",
                    width: "400px",
                },
                {
                    label: "是否有效",
                    //表示将当前列定义为模板列
                    type: "template",
                    //表示当前这一列使用的模板名称
                    template: "isok",
                },
                {
                    label: "排序",
                    //表示将当前列定义为模板列
                    type: "template",
                    //表示当前这一列使用的模板名称
                    template: "order",
                },
                {
                    label: "操作",
                    //表示将当前列定义为模板列
                    type: "template",
                    //表示当前这一列使用的模板名称
                    template: "opt",
                },
            ],
            //父级分类的列表
            parentcatelist: [],
            //指定级联选择器的配置对象
            // cascaderprops: {
            //     value: "cat_id",
            //     label: "cat_name",
            //     children: "children",
            // },
            //选中父级分类的id数组
            selectedkeys: [],
            //控制修改用户对话框的显示与隐藏
            editdialogVisible: false,
            //查询到的用户信息对象
            editForm: "",
            //添加用户的表单数据
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
        };
    },
    methods: {
        //获取商品分类数据
        async getCatelist() {
            const { data: res } = await this.$http.get("categories", {
                params: this.querinfo,
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败");
            }
            //把数据列表赋值给catelist
            this.catelist = res.data.result;
            //为总数据条数赋值
            this.total = res.data.total;
        },
        //监听pagesize改变
        handleSizeChange(newsize) {
            this.querinfo.pagesize = newsize;
            this.getCatelist();
        },
        //监听pagenum改变
        handleCurrentChange(newpage) {
            this.querinfo.pagenum = newpage;
            this.getCatelist();
        },
        //点击按钮展示添加分类的对话框
        showadddcatedialog() {
            //先获取父级分类的数据列表
            this.getparentcatelist();
            this.addcatedialogVisible = true;
        },
        //获取父级分类的数据列表
        async getparentcatelist() {
            const { data: res } = await this.$http.get("categories", {
                params: { type: 2 },
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取父级分类数据失败");
            }

            this.parentcatelist = res.data;
        },
        //选择项发生变化触发这个函数
        parentCateChanged() {
            // console.log(this.selectedkeys);
            //如果selectedkeys数组中的length 大于0，证明选中了父级分类
            //反之没有选中任何父级分类
            if (this.selectedkeys.length > 0) {
                //父级分类的id
                this.addcateform.cat_pid = this.selectedkeys[
                    this.selectedkeys.length - 1
                ];
                //为当前分类的等级赋值
                this.addcateform.cat_level = this.selectedkeys.length;
                return;
            } else {
                this.addcateform.cat_pid = 0;
                this.addcateform.cat_level = 0;
            }
        },
        //点击按钮添加新的分类
        addCate() {
            this.$refs.addcateformref.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    "categories",
                    this.addcateform
                );
                if (res.meta.status !== 201) {
                    return this.$message.error("添加分类失败");
                }

                this.$message.success("添加分类成功");
                this.getCatelist();
                this.addcatedialogVisible = false;
            });
        },
        //监听对话框的关闭事件，重置表单数据
        addcatedialogClosed() {
            this.$refs.addcateformref.resetFields();
            this.selectedkeys = [];
            this.addcateform.cat_pid = 0;
            this.addcateform.cat_level = 0;
        },
    
        //监听修改分类对话框的关闭事件
        editdialog() {
            this.$refs.editFormRef.resetFields();
        },
        //修改分类并提交
        edituserinfo() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return;
                //可以发起修改分类的请求
                const { data: res } = await this.$http.put(
                    "categories/" + this.editForm.cat_id,
                    {
                        cat_name: this.addcateform.cat_name,
                    }
                );
                if (res.meta.status !== 200) {
                    return this.$message.error("更新分类失败！！");
                }

                //隐藏添加的对话框
                this.editdialogVisible = false;
                //重新获取列表
                this.getCatelist();
                this.$message.success("更新分类成功");
            });
        },
        //根据id删除对应的id信息
        async removeUserById(id) {
            //弹框询问是否删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除该分类, 是否继续?",
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
            const { data: res } = await this.$http.delete("categories/" + id);
            if (res.meta.status !== 200) {
                return this.$message.error("删除分类失败！！");
            }
            this.$message.success("删除分类成功！！");
            this.getCatelist();
        },
    },
    components: {},
};
</script>

<style scoped lang="less">
.treetable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>
