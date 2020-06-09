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
    </el-card>
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
    }
  },
  created() {
    this.getCateList()
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
    handleChange(){
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        return 
      }

      console.log(this.selectedCateKeys)
    }
  },

}
</script>

<style lang="scss" scoped>
.cat_opt{
  margin: 1.2rem 0;
}
</style>