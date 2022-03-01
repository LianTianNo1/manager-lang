<template>
  <el-sub-menu :key="menu._id" v-for="menu in userMenu" :index="menu.path">
    <template #title>
      <el-icon><component :is="menu.icon" /></el-icon>
      <span>{{ menu.menuName }}</span>
    </template>
    <el-menu-item
      :index="menuson.path"
      :key="menuson._id"
      v-for="menuson in menu.children"
    >
      <template #title>
        <el-icon><component :is="menuson.icon" /></el-icon>
        <span>{{ menuson.menuName }}</span>
      </template>
    </el-menu-item>
  </el-sub-menu>
</template>
<script>
export default {
  name: "TreeMenu",
  props: {
    userMenu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>