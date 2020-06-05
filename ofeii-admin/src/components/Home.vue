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
    <!-- 侧边栏区 -->
    <el-container>
      <el-aside :width="isCollapse ?'80px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">⇛</div>
        <!-- 侧边栏菜单区 -->   
        <el-menu
          class="home-aside-menu"
          :unique-opened="false"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
        <!-- 一级菜单 -->
        <!-- index 误区动态绑定 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span slot="title">{{item.authName}}</span>
            </template>
              <el-menu-item :index="item.id+'-'+subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>  
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 main footer -->
      <el-container>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      // 是否折叠
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
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
.home-aside-menu{
  margin-left: -1.25rem;
}
.el-aside {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  .el-menu {
    border-right: none;
  }
}
.el-submenu {
  margin: 0 2rem;
}
.toggle-button {
  background-color: #f2f2f2;
  font-size: 1rem;
  line-height: 2rem;
  color: rgba(0, 0, 0, 0.493);
  text-align: center;
  letter-spacing: 0.2rem;
}
</style>