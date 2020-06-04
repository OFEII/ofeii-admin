<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img class="home-logo" src="../assets/logo.png" alt="logo" />
        <span class="home-title">OFEII-Admin OFEII电商后台管理系统</span>
      </div>
      <div>
        <el-button class="btn-exit" type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        侧边栏菜单区
        <el-menu
          background-color="#fff"
          text-color="#6396FF"
          active-text-color="#f2f2f2">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单的模版区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>导航一</span>
            </template>
      
            <el-menu-item index="1-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
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
      menulist:[]
    }
  },
  created() {
    this.getMenuList()
  },
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.home-logo {
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
}
.home-title {
  margin-left: 1rem;
}
.btn-exit {
  background-color: #528afc;
}
.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 1.2rem;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
  // font-weight: bold;
  padding: 1rem;
  > div {
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>