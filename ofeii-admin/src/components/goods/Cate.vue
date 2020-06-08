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
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false">
        <!-- template 是否有效 -->
        <template v-slot:isok="scope"> 
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- template 是序 -->
        <template v-slot:order="scope"> 
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- template 操作 -->
        <template v-slot:option="scope"> 
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品分类的数据列表 默认为空
      catelist:[],
      // 总数据条数
      total:0,
      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },{
          label:'是否有效',
          // 表示将当前列定义为模版列
          type:'template',
          // 表示当前这一列使用模版的名称
          template:'isok'
        },{
          label:'排序',
          // 表示将当前列定义为模版列
          type:'template',
          // 表示当前这一列使用模版的名称
          template:'order'
        },{
          label:'操作',
          // 表示将当前列定义为模版列
          type:'template',
          // 表示当前这一列使用模版的名称
          template:'option'
        }

      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList(){
      const {data:res} = await this.$http.get('categories',{
        params: this.querInfo
      })

      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败')
      }
      console.log(res.data)
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(this.catelist)
      console.log(this.total)

    }
  },

}
</script>

<style lang="scss" scoped>

</style>