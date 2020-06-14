<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索添加表头 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total:0,
      orderlist:[]   

      
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{
        params: this.queryInfo
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取订单数据失败😢')
      }
      this.$message.success('获取订单数据成功🥰')
      this.orderlist = res.data
      console.log(this.orderlist)
    }
    
  },

}
</script>

<style lang="scss" scoped>

</style>