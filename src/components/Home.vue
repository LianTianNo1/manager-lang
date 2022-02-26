<template>
  <div class="basic-layour">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="user">用户</div>
      </div>
      <div class="wrapper">
        <Wave class="wave"></Wave>
        <div class="main-home">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
  <div></div>
</template>

<script >
import Wave from './Wave.vue'
export default {
  name: 'Home',
  components: {
    Wave
  }
}
</script>
<style scoped lang="scss">
.basic-layour {
  position: relative;
  .nav-side {
    position: relative;
    float: left;
    width: 200px;
    transition: width 0.5s;
    background-image: linear-gradient(92deg, #2d6ebb, #494ab9);
    background: #111827;
    color: #9ca3af;
    height: 100vh;
    box-shadow: 3px 0px 20px #00000030;
    z-index: 9;
  }
  .content-right {
    margin-left: 200px;
    background-color: #ffebe7;
    .nav-top {
      height: 60px;
      background-image: linear-gradient(310deg, #2d6ebb, #494ab9);
      color: #374151;
      background: #f3f4f6;
      font-size: 1rem;
      /* margin-bottom: 10px; */
      padding: 0 2vw;
      position: relative;
      display: flex;
      box-shadow: 0px 1px 20px 0px #00000040;
      align-items: center;
      justify-content: space-between;
      z-index: 8;
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
        padding: 1rem;
        height: 100%;
      }
    }
  }
}
</style>
