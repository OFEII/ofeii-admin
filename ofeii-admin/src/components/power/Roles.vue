<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="rolelist"
        style="width: 100%"
        border
        stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="🌮"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px" >
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-search" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框dialog -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRoleDialogVisible"
      width="30%"
      @close="addRoleDialogClosed">
      <el-form 
        :model="addRoleForm" 
        :rules="addRoleFormRules" 
        ref="addRoleFormRef"
        label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框dialog -->  
    <el-dialog
      title="修改用户"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed">
      <el-form
        :model="editRoleForm" 
        :rules="editRoleFormRules" 
        ref="editRoleFormRef"
        label-width="80px">
        <el-form-item label="角色名称" >
          <el-input v-model="editRoleForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色的列表数据
      rolelist:[],
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      addRoleForm:{
        roleId:'',
        roleName:'',
        roleDesc:''
      },
      addRoleFormRules:{},
      editRoleForm:{
        roleId:'',
        roleName:'',
        roleDesc:''
      },
      editRoleFormRules:{},

    }
  },
  created() {
    // 获取所有的权限
    this.getRoleList()
  },
  methods: {
    // 所有角色的列表
    async getRoleList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    // 监听新增角色dialog的关闭事件
    addRoleDialogClosed(){
      this.$refs.addRoleFormRef.resetFields()
    },
    // 点击按钮 添加新用户  
    addRole(){
      this.$refs.addRoleFormRef.validate(async valid=>{
        // console.log(valid)
        if(!valid) return 
        // 可以发起添加用户网络请求
        const {data:res} = await this.$http.post('roles',this.addRoleForm)
        if(res.meta.status!==201){
          this.$message.error('添加用户失败😥')
        }
        this.$message.success('添加用户成功🤗')
        this.addRoleDialogVisible = false
        this.getRoleList()
      })
    },
    // 编辑用户信息的dialog
    async showEditRoleDialog(id){
      console.log(id)
      const{data:res} = await this.$http.get('roles/'+id)
      if(res.meta.status !==200){
        return this.$message.error('查询用户信息失败')
      }
      this.editRoleForm = res.data
      // console.log(this.editForm)
      this.editRoleDialogVisible = true
    },        
    // 监听关闭修改用户dialog的关闭事件
    editRoleDialogClosed(){
      this.$refs.editRoleFormRef.resetFields()
    },
    // 修改用户信息并提交
    editRoleInfo(){
      this.$refs.editRoleFormRef.validate(async valid=>{
        if(!valid) return
        // 发起修改用户信息的数据请求
        const {data:res} = await this.$http.put('roles/'+ this.editRoleForm.roleId,{
          roleId: this.editRoleForm.roleId,
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        console.log('roles/'+ this.editRoleForm.roleId)
        console.log('roles/'+ this.editRoleForm)

        if(res.meta.status !== 200){
          return this.$message.error('更新用户信息失败😢')
        }
        this.editRoleDialogVisible = false
        this.getRoleList()
        this.$message.success('更新用户信息失败成功🤗')
      })
    },
    // 根据id删除对应的用户信息
    removeRoleById(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res} = await this.$http.delete('roles/'+id)
          if(res.meta.status !== 200){
            return this.$message.error('删除用户失败😢')
          }
          this.$message.error('删除用户成功🤗')
          this.getRoleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }    
  }
}
</script>

<style lang="scss" scoped>

</style>