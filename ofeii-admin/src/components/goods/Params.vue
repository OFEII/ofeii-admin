<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closeable="false"
        show-icon>
      </el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品级联的选择框 -->
                    <!-- options指定数据源 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            border
            stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>
                  {{item}}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index" label="🚀"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table
            :data="onlyTableData"
            border
            stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index" label="🚀"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">>删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="60%"
      @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item :label="titleText" label-width="100px" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item :label="titleText" label-width="100px" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      catelist:[],
      // 级联选择框的配置对象
      cascaderProps:{
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // checkStrictly: true
      },
      // 选中父级分类的id数组
      selectedCateKeys: [],
      activeName:'many',
      onlyTableData:[],
      manyTableData:[],
      addDialogVisible: false,
      addForm:{
        attr_name:''
      },
      addFormRules:{
        attr_name:[{required:true,message:'请输入参数',trigger:'blur'}]
      },
      editDialogVisible:false,
      editForm:{
        attr_name:''
      },
      editFormRules:{
        attr_name:[{required:true,message:'请输入参数',trigger:'blur'}]
      },
      // 控制按钮与文本框的切换显示
      inputVisible:false,
      // 文本框输入的内容
      inputValue:''

    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisabled(){
      return (this.selectedCateKeys.length !== 3)? true : false
    },
    // 当前选中三级分类的id
    cateId(){
      return (this.selectedCateKeys.length ===3) ? this.selectedCateKeys[2] : null
    },
    // 动态计算dialog的标题
    titleText(){
      return this.activeName === 'many' ? '动态参数':'静态属性'
    }
  },
  methods: {
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    async handleChange(){
      this.getParamsData()
    },
    // tabs 点击时间的处理函数
    handleTabsClick(){
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData(){
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        return 
      }
      console.log(this.selectedCateKeys)
      // 根据所选分类的id和当前所处的面板获取对应的参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取对应面板数据失败')
      }
      this.$message.success('获取对应面板数据ok')
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') :[]
        
      });
      if(this.activeName === 'many'){
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
    },
    
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if(res.meta.status !==201){
          return this.$message.error('添加参数失败😢')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditDialog(attr_id){
      console.log(this.cateId)
      console.log(this.attr_id)

      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{attr_sel:this.activeName}
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })

        if(res.meta.status !== 200){
          return this.$message.error('修改参数失败')
        }

        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    removeParamsById(attr_id){
        this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除参数失败😢");
          }
          this.$message.error("删除参数成功🤗");
          this.getParamsData();
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
    },
    // 文本框失去焦点 或enter
    handleInputConfirm(){
      console.log('ok')
    },
    showInput(){
      this.inputVisible = true
    }

  },

}
</script>

<style lang="scss" scoped>
.cat_opt{
  margin: 1.2rem 0;
}

.el-tag{
  margin: .8rem;
}
.input-new-tag{
  width: 120px;
}
</style>