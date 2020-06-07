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
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="roleList"
        style="width: 100%"
        border
        stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="🌮"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px">
          <el-button type="primary" icon="el-icon-search">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" icon="el-icon-setting">分配权限</el-button>
        </el-table-column>
        <!-- <el-table-column prop="path" label="路径"></el-table-column> -->

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色的列表数据
      roleList:[]
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
      this.roleList = res.data
      console.log(this.roleList)
    }

  },

}
</script>

<style lang="scss" scoped>

</style>