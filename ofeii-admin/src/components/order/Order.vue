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

      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe >
        <el-table-column type="index" label="🍜"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location"></el-button>
          </template>

        </el-table-column>






      </el-table>
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
      this.orderlist = res.data.goods
      this.total = res.data.total
      console.log(this.orderlist)
    }
    
  },

}
</script>

<style lang="scss" scoped>

</style>