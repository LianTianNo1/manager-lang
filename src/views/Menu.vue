<template>
  <div class="user-manage">
    <!-- 搜索框 -->
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.state">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <!-- 列表操作 -->
      <div class="action">
        <el-button @click="handleCreate" type="primary">新增</el-button>
      </div>
      <!-- 用户列表 -->
      <el-table :data="menuList" row-key="_id" :tree-props="{ children: 'children' }">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(scope.row)"
              >新增</el-button
            >
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
export default {
  name: "Menu",
  setup() {
    // 初始化接口调用
    onMounted(() => {
      // 获取菜单列表
      getMenuList();
    });
    // 解构出上下文
    const { proxy } = getCurrentInstance();
    // 菜单列表
    const menuList = ref([]);
    // 获取菜单列表
    const getMenuList = async () => {
      try {
        const list = await proxy.$api.getMenuList();
        menuList.value = list;
      } catch (error) {
        throw new Error(error);
      }
    };
    // 定义动态表格-格式
    const columns = reactive([
      {
        label: "菜单名称",
        prop: "menuName",
        width: 150,
      },
      {
        label: "图标",
        prop: "icon",
      },
      {
        label: "菜单类型",
        prop: "menuType",
        formatter(row, column, value) {
          return {
            1: "菜单",
            2: "按钮",
          }[value];
        },
      },
      {
        label: "权限标识",
        prop: "menuCode",
      },
      {
        label: "路由地址",
        prop: "path",
      },
      {
        label: "组件路径",
        prop: "component",
      },
      {
        label: "菜单状态",
        prop: "menuState",
        width: 90,
        formatter(row, column, value) {
          return {
            1: "正常",
            2: "停用",
          }[value];
        },
      },
      {
        label: "创建时间",
        prop: "createTime",
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
    ]);
    // 查询表单
    const queryForm = reactive([]);

    // 查询菜单
    const handleQuery = () => {};
    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    // 新增
    const handleCreate = (params) => {};
    // 快捷新增
    const handleAdd = (params) => {};
    // 编辑
    const handleEdit = (params) => {};
    // 删除
    const handleDel = async (row) => {};

    return {
      menuList,
      columns,
      queryForm,
      handleQuery,
      handleReset,
      handleDel,
      handleCreate,
      handleAdd,
      handleEdit,
      getMenuList,
    };
  },
};
</script>
<style scoped lang="scss"></style>
