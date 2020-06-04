<template>

  <!-- <el-container>
    <div>
  <el-button type="info" @click="logout">退出</el-button>
</div>
  </el-container> -->
  <el-container class="home-container">
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  },
  
}
</script>

<style lang="scss" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: rgb(98, 96, 96);
}
.el-aside{
  background-color: rgb(122, 118, 118);
}

</style>