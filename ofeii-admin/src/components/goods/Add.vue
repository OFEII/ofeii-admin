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
        <!-- 警告提示区域 -->
        <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false">
        </el-alert>
        <!-- 含状态步骤条 -->
        <el-steps :space="200" :active="+activeIndex" finish-status="success" align-center >
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form 
          :model="addForm" 
          :rules="addFormRules" 
          ref="addFormRef" 
          label-width="100px" 
          label-position="top">
        <!-- tab区域 -->
          <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforeTabLeave" @tab-click="tabClicked">
            <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格(元)" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量(kg)" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                    v-model="addForm.goods_cat"
                    :options="catelist"
                    :props="cateProps"
                    @change="handleChange">
                  </el-cascader>
              </el-form-item>
            <el-tab-pane label="商品参数" name="1">商品参数
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">商品属性
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">商品图片
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">商品内容
            </el-tab-pane>
          </el-tabs>
        </el-form>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      tabPosition: 'left',
      addForm:{
        goods_name:'',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat:[]
      },
      addFormRules:{
        goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
        goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
        goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
        goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
        goods_cat:[{required:true,message:'请选择商品分类',trigger:'blur'}],
      },
      catelist:[],
      cateProps:{
        expandTrigger: "hover",
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      manyTableData:[]
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId(){
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
  async getCateList(){
    const {data:res} =  await this.$http.get('categories')
    if(res.meta.status !== 200){
      return this.$message.error('获取商品参数分类数据失败')
    }
    this.catelist = res.data
    console.log(this.catelist)
  },
  // 级联选择器中选项变化就会触发
  handleChange(){
    console.log(this.addForm.goods_cat)
    if(this.addForm.goods_cat.length !== 3){
      this.addForm.goods_cat = []
    }
  },
  beforeTabLeave(activeName,oldActiveName){
    // console.log('离开'+oldActiveName)
    // console.log('进入'+activeName)
    // return false
    if(oldActiveName === '0' && this.addForm.goods_cat.length !==3){
      this.$message.error('请先选择商品分类😛')
      return false
    }
  },
  async tabClicked(){
    // console.log(this.activeIndex)
    if(this.activeIndex === '1'){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:'many'}
      })
      if(res.meta.status !== 200){
      return this.$message.error('获取动态参数列表失败😢')
      }
      this.manyTableData = res.data
      console.log(this.manyTableData)
      this.$message.success('获取动态参数列表成功🥰')


    }
  }
  
    
  },

}
</script>

<style lang="scss" scoped>
.el-steps{
  margin: 2rem 0;
}

</style>