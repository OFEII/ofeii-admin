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
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  created() {
    
  },
  methods: {
    
  },

}
</script>

<style lang="scss" scoped>

</style>