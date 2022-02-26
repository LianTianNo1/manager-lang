
<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form>
        <h1 class="title">后台管理系统</h1>
        <el-form-item>
          <el-input type="text" v-model="user.userName">
            <template #prefix>
              <el-icon class="el-input__icon"><Avatar /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="user.userPwd">
            <template #prefix>
              <el-icon class="el-input__icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary">登录</el-button>
        </el-form-item>
        <el-icon><bottom /></el-icon>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Lock, Avatar } from '@element-plus/icons-vue'
export default {
  name: 'login',
  components: {
    Avatar,
    Lock
  },
  data() {
    return {
      user: {
        userName: "",
        userPwd: "",
      }, rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        userPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    goHome() {
      this.$router.push('/welcome')
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9e7f0;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    background: #f8e7f1;
    box-shadow: 20px 20px 60px #d3c4cd, -20px -20px 60px #f8e7f1,
      0 0 2vh 2vh #f9e7f0;
    padding: 1em;
    border-radius: 20px;
    .title {
      font-size: 2em;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .el-form-item {
      margin: 2rem !important;
    }
    .btn-login {
      width: 100%;
    }
    .el-button--primary {
      --el-button-bg-color: #fdb4df !important;
      --el-button-border-color: #f8e7f1 !important;
      --el-button-hover-bg-color: rgb(231 101 177) !important;
      --el-button-hover-border-color: rgb(253 180 223) !important;
      --el-button-active-bg-color: rgb(253 180 223) !important;
      --el-button-active-border-color: rgb(227 102 176) !important;
    }
  }
}
</style>
