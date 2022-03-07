<template>
  <div class="login-wrapper">
    <div class="modal">
      <!-- status-icon显示图标提醒
      form 绑定 user
      :rules使用校验规则
       -->
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <h1 class="title">后台管理系统</h1>
        <!-- 必须使用prop才能校验 -->
        <el-form-item prop="userName">
          <el-input type="text" v-model="user.userName">
            <template #prefix>
              <el-icon class="el-input__icon"><Avatar /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" v-model="user.userPwd">
            <template #prefix>
              <el-icon class="el-input__icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="btn-login" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive } from "vue";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage.js";

export default {
  name: "login",
  setup() {
    const { proxy } = getCurrentInstance();
    const user = reactive({
      userName: "",
      userPwd: "",
    });
    const rules = reactive({
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
    });
    const login = () => {
      proxy.$refs.userForm.validate((valid) => {
        if (valid) {
          proxy.$api.login(user).then(async (res) => {
            proxy.$store.commit("saveUserInfo", res);
            await loadAsyncRoutes();
            proxy.$router.push("/welcome");
          });
        } else {
          return false;
        }
      });
    };
    // 异步加载路由
    const loadAsyncRoutes = async () => {
      // 拿到token，才去创建路由
      let userInfo = storage.getItem("userInfo") || {};
      if (userInfo.token) {
        try {
          // 获取该用户的菜单列表
          const { menuList } = await proxy.$api.getPermissionList();
          // 通过递归获取到所有的路由

          let routes = utils.generateRoute(menuList);
          // 通过遍历递归拼接后的路由，创建动态路由
          routes.map((route) => {
            // 获取到组件的地址
            let url = `../views/${route.component}.vue`;

            // 加载组件
            route.component = () => import(/* @vite-ignore */ url);
            console.log(route.component);
            // 通过 addRoute 创建动态路由,在 home 路由下面创建
            // route 之前我们就通过 generateRoute 拼装好了只是没有加载组件
            router.addRoute("home", route);
          });
        } catch (error) {
          ElMessage.error(error || "创建动态路由失败");
        }
      }
    };
    return {
      login,
      loadAsyncRoutes,
      user,
      rules,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #f9e7f0;
  background: url(../assets/images/loginbg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    background: #d4e2ef57;
    box-shadow: 20px 20px 60px #436593, -20px -20px 60px #c1d4e9, 0 0 2vh 2vh #537ca8;
    padding: 1em;
    border-radius: 20px;
    overflow: hidden;

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
      --el-button-bg-color: #c4d5e9 !important;
      --el-button-border-color: #436593 !important;
      --el-button-hover-bg-color: rgb(214 228 244) !important;
      --el-button-hover-border-color: rgb(155 180 216) !important;
      --el-button-active-bg-color: rgb(67 100 147) !important;
      --el-button-active-border-color: rgb(197 214 234) !important;
    }
  }
}
</style>
