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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>

      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      total:0,
      goodlist:[]
      
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{
        params: this.queryInfo
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取商品列表数据失败😢')
      }
      this.goodlist = res.data
      console.log(this.goodlist)
    }
    
  },

}
</script>

<style lang="scss" scoped>

</style>