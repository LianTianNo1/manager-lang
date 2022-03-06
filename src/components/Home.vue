<template>
  <div class="basic-layour">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <div class="logo">
        <img src="../assets/logo.jpg" alt="" />
        <p v-show="!isCollapse">lang Manager</p>
      </div>
      <el-menu
        :default-active="activeMenu"
        default-active="2"
        text-color="var(--bwhite)"
        background-color="var(--ssblue)"
        :collapse="isCollapse"
        router
        class="nav-menu"
      >
        <tree-menu :userMenu="menuList"></tree-menu>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="bread-left">
          <el-icon @click="toggle"><Expand v-if="isCollapse" /> <Fold v-else /></el-icon>
          <div class="bread"><BreadCrumb></BreadCrumb></div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="item">
            <el-icon><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="el-dropdown-link">
              {{ userInfo ? userInfo.userName : "" }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱:{{ userInfo ? userInfo.userEmail : "" }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <Wave class="wave"></Wave>
        <router-view></router-view>
        <!-- <div class="main-home">
        </div> -->
      </div>
    </div>
  </div>
  <div></div>
</template>

<script>
import TreeMenu from "./TreeMenu.vue";
import BreadCrumb from "./BreadCrumb.vue";
import Wave from "./Wave.vue";

export default {
  name: "Home",
  components: {
    Wave,
    TreeMenu,
    BreadCrumb,
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      menuList: [],
      // 选中状态
      activeMenu: location.hash.slice(1),
    };
  },
  mounted() {
    // 获取通知条数
    this.getNoticeCout();
    // 获取菜单
    this.getMenuList();
  },
  methods: {
    handleLogout(command) {
      if (command === "email") {
        return;
      }
      // 退出
      if (command === "logout") {
        this.$store.commit("saveUserInfo", "");
        this.userInfo = null;
        this.$router.push("/login");
      }
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    async getNoticeCout() {
      try {
        const count = await this.$api.noticeCount();
        this.noticeCount = count;
      } catch (error) {
        console.log(error);
      }
    },
    async getMenuList() {
      try {
        const { menuList, actionList } = await this.$api.getPermissionList();
        this.$store.commit("saveActionList", actionList);
        this.$store.commit("saveMenuList", menuList);
        this.menuList = menuList;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.basic-layour {
  position: relative;
  .nav-side {
    position: relative;
    float: left;
    width: 200px;
    transition: width 0.5s;
    background-image: linear-gradient(115deg, var(--pink), var(--sswhite));
    // background: #85cad2e3;
    color: var(--grey);
    height: 100vh;
    box-shadow: 3px 0px 20px #00000030;
    z-index: 9;
    .logo {
      margin: 1rem 0.5rem;
      display: flex;
      height: 80px;
      justify-content: space-around;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      p {
        color: var(--bwhite);
      }
    }
    .nav-menu {
      height: calc(100vh - 2rem - 80px);
      border-right: none;
    }
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    background-color: #ffebe7;
    transition: margin-left 0.5s;
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 60px;
      background-image: linear-gradient(310deg, #2d6ebb, #494ab9);
      color: #374151;
      background: var(--white);
      font-size: 1rem;
      /* margin-bottom: 10px; */
      padding: 0 2vw;
      position: relative;
      display: flex;
      box-shadow: 0px 1px 20px 0px #00000040;
      align-items: center;
      justify-content: space-between;
      z-index: 8;
      .bread-left,
      .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          margin-left: 0.5rem;
        }
        .el-dropdown-link {
          // color: #f5acac;
          color: var(--pink);
          cursor: pointer;
        }
      }
    }
    .wrapper {
      height: calc(100vh - 60px);
      // padding: 1rem;
      // background-color: #ff82a9;
      position: relative;
      .wave {
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
      }
      .main-home {
        position: relative;
        z-index: 1;
        height: 100%;
      }
    }
  }
}
</style>
