<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item></el-breadcrumb-item>
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
      <el-row class="cat_opt" justify="start">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品级联的选择框 -->
        </el-col>
      </el-row>
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
.cat_pot{
  margin: 1rem 0;
}
</style>