<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="logo-login" />
      </div>
      <!-- 登录表单form -->
      <el-form class="login-form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="login-btns">
          <el-button type="primary">登录</el-button>
          <el-button type="primary" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>登录组件
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "ofeii",
        password: "123"
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在3到12个字符之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 18, message: "长度在6到18个字符之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm(){
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    }
  },

};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background-color: #2b4b6b;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 1px 1px 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login-form {
  width: 80%;
  position: absolute;
  bottom: 0;
  padding: 0 40px;
}
.login-btns {
  display: flex;
  justify-content: flex-end;
}
</style>