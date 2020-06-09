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
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" :gutter="10" v-for="(item1, i1) in scope.row.children" :key="item1.id" >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag type="primary" closable @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row :class="['bdbottom',i2===0?'bdtop':'bdbottom','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"  closable @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="🌮"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px" >
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-search" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
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
    <!-- 分配权限的对话框dialog -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree 
        :data="rightslist" 
        :props="treeProps" 
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
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
      setRightDialogVisible: false,
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
      // 所有权限的数据
      rightslist:{},
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点列表
      defKeys:[],
      // 当前即将分配权限的角色id
      roleId:''

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
      // console.log(id)
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
        // console.log('roles/'+ this.editRoleForm.roleId)
        // console.log('roles/'+ this.editRoleForm)

        if(res.meta.status !== 200){
          return this.$message.error('更新用户信息失败😢')
        }
        this.$message.success('更新用户信息失败成功🤗')
        this.getRoleList()
        this.editRoleDialogVisible = false
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
    },
    removeRightById(role, rightId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !== 200){
          return this.$message.error('删除权限失败😢')
        }
        this.$message.error('删除权限成功🤗')
        // this.getRoleList()发生页面的完整渲染
        role.children = res.data
        this.$message({
          type: 'success',
          message: '删除成功🤗!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除😢'
        });          
      });
    },
    async showSetRightDialog(role){
      this.roleId = role.id
      const{data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200){
        return this.$message.error('获取所有权限数据失败')
      }
      this.rightslist = res.data
      // console.log(this.rightslist)

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true

    },
    // 监听分配权限的对话框负责
    setRightDialogClosed(){
      this.defKeys = []
      // this.$refs.addRoleFormRef.resetFields()
    },
    // 通过递归获取所有角色的三级权限id并保存到defKeys数组中
    getLeafKeys(node,arr){
      // 如果node节点不包含children属性 则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>
        this.getLeafKeys(item,arr))
    },
    // 角色授权功能
    async allotRight(){
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]    
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !==200){
        return this.$message.error('分配权限失败😢')
      }
      this.$message.success('分配权成功🤗')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag{
  margin: 8px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
  border-bottom: 1px solid #eee;
}

.vcenter{
  display: flex;
  align-items: center;
}
</style>