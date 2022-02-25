
<template>
  <div>登录</div>
  <!-- <router-link to="/welcome">去欢迎</router-link> -->
  <el-button @click="goHome">回首页</el-button>
</template>

<script>
export default {
  name: 'login',
  methods: {
    goHome() {
      this.$router.push('/welcome')
    }
  }
}
</script>

<style scoped>
</style>
