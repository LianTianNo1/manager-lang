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
          <el-button type="primary" @click="getMenuList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <!-- 列表操作 -->
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
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
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(2, scope.row)"
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
    <el-dialog title="用户新增" v-model="showModal">
      <el-form ref="dialogForm" :model="menuForm" label-width="100px" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.icon" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType == 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType == 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
        const list = await proxy.$api.getMenuList(queryForm);
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
        width: 90,
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

    // 重置查询表单
    // 方便复用所以传入的是动态的form ref
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    // 控制dialog的出现
    const showModal = ref(false);
    const rules = reactive({
      menuName: [
        {
          required: true,
          message: "请输入菜单名称",
          trigger: "blur",
        },
        {
          min: 2,
          max: 10,
          message: "长度在2-8个字符",
          trigger: "blur",
        },
      ],
    });
    // 添加还是编辑方式
    const action = ref("");
    const menuForm = reactive({
      parentId: [null],
      menuType: 1,
      menuState: 1,
    });
    // 快捷新增
    const handleAdd = (type, row) => {
      showModal.value = true;
      action.value = "add";
      // 如果是下面的row点的新增，把自己的 父ID和自己的ID
      // 组合到一起 【父父，父，自己】
      // 除了顶层的id他没有parentID就过滤掉
      if (type == 2) {
        menuForm.parentId = [...row.parentId, row._id].filter((item) => item);
      }
    };
    // 弹框关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    // 编辑
    const handleEdit = (row) => {
      showModal.value = true;
      action.value = "edit";
      // 在一次的dom更新后进行操作赋值操作
      // 这样点击关闭的时候才能清除数据
      proxy.$nextTick(() => {
        // 把row拷贝过来赋值给menuForm这样表单就有数据了
        Object.assign(menuForm, row);
      });
    };
    // 删除
    const handleDel = async (_id) => {
      await proxy.$api.menuSubmit({ _id, action: "delete" });
      proxy.$message.success("删除成功");
      getMenuList();
    };
    // 校验确认提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { ...menuForm, action };
          let res = await proxy.$api.menuSubmit(params);
          showModal.value = false;
          proxy.$message.success("操作成功");
          handleReset("dialogForm");
          getMenuList();
        }
      });
    };

    return {
      rules,
      action,
      showModal,
      menuForm,
      menuList,
      columns,
      queryForm,
      handleClose,
      handleSubmit,
      handleReset,
      handleDel,
      handleAdd,
      handleEdit,
      getMenuList,
    };
  },
};
</script>
<style scoped lang="scss"></style>
