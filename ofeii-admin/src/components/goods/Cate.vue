<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="showAddCateDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- template 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- template 是序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- template 操作 -->
        <template v-slot:option="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 25]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类dialog -->
    <el-dialog 
      title="添加分类" 
      :visible.sync="addCateDialogVisible" 
      width="50%"
      @close="addCateDialogClosed">
      <el-form :model="addCateForm" 
      :rules="addCateFormRules" 
      ref="addCateFormRef" 
      label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类dialog -->
    <el-dialog 
      title="编辑分类" 
      :visible.sync="editCateDialogVisible" 
      width="50%"
      @close="editCateDialogClosed">
      <el-form :model="editCateForm" 
      :rules="editCateFormRules" 
      ref="editCateFormRef" 
      label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表 默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模版列
          type: "template",
          // 表示当前这一列使用模版的名称
          template: "isok"
        },
        {
          label: "排序",
          // 表示将当前列定义为模版列
          type: "template",
          // 表示当前这一列使用模版的名称
          template: "order"
        },
        {
          label: "操作",
          // 表示将当前列定义为模版列
          type: "template",
          // 表示当前这一列使用模版的名称
          template: "option"
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      },
      // 选中父级分类的id数组
      selectedKeys: [],
      editCateDialogVisible: false,
      editCateFormRules:{

      },
      editCateForm:{
        cat_name: ''
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      // console.log(res.data);
      this.catelist = res.data.result;
      this.total = res.data.total;
      // console.log(this.catelist);
      // console.log(this.total);
    },
    // 监听pagesize的变化
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenums 变化
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据失败
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类的数据失败");
      }
      this.parentCateList = res.data;
      // console.log(this.parentCateList);
    },
    parentCateChange() {
      // console.log(this.selectedKeys);
      // 如果selectedKeys数组中的length大于0 证明选中父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
      // 点击按钮，添加新的分类
    addCate(){
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.post(
          'categories',
          this.addCateForm
        )
        // console.log(res)
        if(res.meta.status !==201){
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
      
    },
    // 监听对话框的关闭事件 重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys=[]
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async showEditCateDialog(id){
      const {data:res} = await this.$http.get("categories/"+id)
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    editCateDialogClosed(){
      this.$refs.editCateFormRef.resetFields();
    },
    // 修改分类信息并提交
    editCateInfo() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id,
          this.editCateForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新分类名称失败😢");
        }
        this.editCateDialogVisible = false;
        this.getCateList()
        this.$message.success("更新分类名称成功🤗");
      });
    },
    removeCateById(id){
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("categories/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败😢");
          }
          this.$message.error("删除用户成功🤗");
          this.getCateList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.treeTable {
  margin-top: 1rem;
}
.el-cascader {
  display: table-cell;
}
</style>