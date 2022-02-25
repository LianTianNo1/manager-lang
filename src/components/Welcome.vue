<script>
export default {

  mounted() {
    // this.$request({
    //   method: 'get',
    //   url: '/login',
    //   data() {
    //     name: 'lang'
    //   },
    // }).then((res) => {
    //   console.log(res)
    // })
    this.$request.get('/login', { name: 'lang' }).then(res => console.log(res))
  },
}


</script>

<template>
  <div>欢迎</div>
  <router-link to="/login">去登录</router-link>
</template>

<style scoped>
</style>
