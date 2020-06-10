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
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
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
      activeName:'first'
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisabled(){
      return (this.selectedCateKeys.length !== 3)? true : false
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
    handleChange(){
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        return 
      }

      console.log(this.selectedCateKeys)
    },
    // tabs 点击时间的处理函数
    handleTabsClick(){
      console.log(this.activeName)
    }
  },

}
</script>

<style lang="scss" scoped>
.cat_opt{
  margin: 1.2rem 0;
}
</style>