<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎来到</div>
      <div class="title">小浪通用后台管理系统</div>
      <div class="desc">基于Vue3+Koa2+MongoDB通用后台管理系统</div>
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  z-index: 2;
  background-image: linear-gradient(
    142deg,
    var(--sblue) 0%,
    var(--spink) 28%,
    transparent 50%
  );
  .content {
    position: relative;
    bottom: 40px;
    margin-right: 5rem;
    .sub-title {
      font-size: 56px;
      line-height: 42px;
      color: var(--bwhite);
      margin-bottom: 5rem;
      font-weight: 600;
      letter-spacing: 10px;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: var(--pink);
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: var(--grey);
    }
  }
}
</style>