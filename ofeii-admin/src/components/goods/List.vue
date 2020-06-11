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
      <!-- 搜索添加表头 -->
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

      <!-- table表格区域 -->
      <el-table
        :data="goodslist"
        border
        stripe>
        <el-table-column type="index" label="🚄"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="140px"></el-table-column>
        <el-table-column label="商品重量(kg)" prop="goods_weight" width="140px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="200px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}    
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 25, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
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
      goodslist:[]
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
      this.goodslist = res.data.goods
      this.total = res.data.total;
      console.log(this.goodslist)
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    }
    
  },

}
</script>

<style lang="scss" scoped>

</style>