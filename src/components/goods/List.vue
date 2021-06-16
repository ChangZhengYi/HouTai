<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryinof.query"
                        clearable
                        @clear="getgoodslist"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getgoodslist"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">
                        添加商品
                    </el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index" label="#"> </el-table-column>
                <el-table-column label="商品名称" prop="goods_name">
                </el-table-column>
                <el-table-column
                    label="商品价格（元）"
                    prop="goods_price"
                    width="90px"
                >
                </el-table-column>
                <el-table-column
                    label="商品重量"
                    prop="goods_weight"
                    width="70px"
                >
                </el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dataFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row.goods_id)"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="removebyId(scope.row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryinof.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryinof.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
            >
            </el-pagination>
            <!-- 修改用户的对话框 -->
            <el-dialog
                title="修改角色"
                :visible.sync="editdialogVisible"
                width="50%"
                @close="editdialog()"
            >
                <el-form :model="addForm" ref="editFormRef" label-width="70px">
                    <el-form-item label="商品名称">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="价格">
                        <el-input v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="数量">
                        <el-input v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="重量">
                        <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-input v-model="addForm.goods_cat"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editdialogVisible = false"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="edituserinfo"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getgoodslist();
    },
    props: {},
    data() {
        return {
            //查询参数对象
            queryinof: {
                query: "",
                pagenum: 1,
                pagesize: 10,
            },
            //商品列表
            goodslist: [],
            //总数据条数
            total: 0,
            //控制修改用户对话框的显示与隐藏
            editdialogVisible: false,
            //查询到的用户信息对象
            editForm: "",
            addForm: {
                goods_name: "",
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
            },
        };
    },
    methods: {
        //根据分页获取对应的商品列表
        async getgoodslist() {
            const { data: res } = await this.$http.get("goods", {
                params: this.queryinof,
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品列表失败");
            }
            this.$message.success("获取商品列表成功");
            console.log(res.data);
            this.goodslist = res.data.goods;
            this.total = res.data.total;
        },
        handleSizeChange(newsize) {
            this.queryinof.pagesize = newsize;
            this.getgoodslist();
        },
        handleCurrentChange(newpage) {
            this.queryinof.pagenum = newpage;
            this.getgoodslist();
        },
        async removebyId(id) {
            const confirmResult = await this.$confirm(
                "此操作将永久删除该商品, 是否继续?",
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
            const { data: res } = await this.$http.delete(`goods/${id}`);
            if (res.meta.status !== 200) {
                return this.$message.error("删除失败！！");
            }
            this.$message.success("删除成功！！");
            this.getgoodslist();
        },
        goAddpage() {
            this.$router.push("/goods/add");
        },
        //点击编辑用户的对话框
        async showEditDialog(id) {
            console.log(id);
            const { data: res } = await this.$http.get(`goods/${id}`);
            if (res.meta.status !== 200) {
                return this.$message.error("查询商品信息失败！！");
            }
            this.addForm = res.data;
            this.editdialogVisible = true;
        },
        //监听修改用户对话框的关闭事件
        editdialog() {
            this.$refs.editFormRef.resetFields();
        },
        //修改用户信息并提交

        async edituserinfo() {
            //可以发起修改用户的请求
            const { data: res } = await this.$http.put(
                "goods/" + this.addForm.goods_id,
                {
                    goods_name: this.addForm.goods_name,
                    goods_price: this.addForm.goods_price,
                    goods_number: this.addForm.goods_number,
                    goods_weight: this.addForm.goods_weight,
                    goods_cat: this.addForm.goods_cat,
                }
            );
            if (res.meta.status !== 200) {
                return this.$message.error("更新商品信息失败！！");
            }

            //隐藏添加的对话框
            this.editdialogVisible = false;
            //重新获取用户列表
            this.getgoodslist();
            this.$message.success("更新商品信息成功");
        },
    },
    components: {},
};
</script>

<style scoped lang="less"></style>
