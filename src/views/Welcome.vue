<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎来到</div>
      <div class="title">通用后台管理系统</div>
      <div class="desc">使用Vue3+Koa+Mongo打造通用后台管理系统</div>
    </div>
    <Clock></Clock>
  </div>
</template>

<script>
// const Clock = () => import('../components/Clock.vue')
import Clock from '../components/Clock.vue'
export default {
  name: "welcome",
  components: {
    Clock
  }
};
</script>

<style lang="scss">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: linear-gradient(180deg, #ff9200, transparent 50%);
  .content {
    position: relative;
    bottom: 40px;
    margin-right: 5rem;
    .sub-title {
      font-size: 56px;
      line-height: 42px;
      color: #fff;
      margin-bottom: 5rem;
      font-weight: 600;
      letter-spacing: 10px;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #c160ff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 105px;
    background-image: url('./../assets/images/welcome.png');
    width: 371px;
    height: 438px;
  }
}
</style>