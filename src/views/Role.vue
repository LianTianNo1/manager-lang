<template>
  <div class="role-manage">
    <!-- 搜索框 -->
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <!-- 列表操作 -->
      <div class="action">
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </div>
      <!-- 角色列表 -->
      <el-table :data="roleList">
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
            <el-button type="primary" @click="handleEdit(scope.row)" size="small"
              >编辑</el-button
            >
            <el-button size="small" @click="handleOpenPermission(scope.row)"
              >设置权限</el-button
            >
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 角色新增弹框 -->
    <el-dialog title="角色新增" v-model="showModal">
      <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹框-->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
export default {
  name: "Role",
  setup() {
    // 初始化接口调用
    onMounted(() => {
      // 获取权限列表
      getRoleList();
      // 获取菜单列表
      getMenuList();
    });
    // 解构出上下文
    const { proxy } = getCurrentInstance();
    // 菜单列表
    const roleList = ref([]);
    // 分页
    const pager = reactive({
      total: 0,
      pageNum: 1,
      pageSize: 10,
    });
    // 监听分页变化
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getRoleList();
    };
    // 获取角色列表
    const getRoleList = async () => {
      try {
        const { list, page } = await proxy.$api.getRoleList({
          ...queryForm,
          ...pager,
        });
        roleList.value = list;
        pager.total = page.total;
      } catch (error) {
        throw new Error(error);
      }
    };
    // 定义动态表格-格式
    const columns = reactive([
      {
        label: "角色名称",
        prop: "roleName",
      },
      {
        label: "备注",
        prop: "remark",
      },
      {
        label: "权限列表",
        prop: "permissionList",
        formatter: (row, column, value) => {
          // console.log(value);
          let names = [];
          // 获取菜单而不是按钮
          let list = value.halfCheckedKeys || [];
          // 遍历所有的菜单，只要映射有的都加入到names
          list.map((key) => {
            let name = actionMap[key];
            if (key && name) names.push(name);
          });
          // 最后返回拼接的值
          return names.join(",");
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
    const queryForm = reactive({ roleName: "" });

    // dialog表单里面值
    const roleForm = reactive({});
    // 重置查询表单
    // 方便复用所以传入的是动态的form ref
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    // 控制dialog的出现 新增角色
    const showModal = ref(false);
    const rules = reactive({
      roleName: [
        {
          required: true,
          message: "请输入角色角色名称",
        },
      ],
    });
    // 行为方式
    const action = ref("");
    // 创建
    const handleAdd = (params) => {
      action.value = "create";
      showModal.value = true;
    };
    // 弹框关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    // 提交校验
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { ...roleForm, action: action.value };
          let res = await proxy.$api.roleOperate(params);
          if (res) {
            showModal.value = false;
            proxy.$message.success("创建成功");
            handleReset("dialogForm");
            getRoleList();
          }
        }
      });
    };
    // 编辑功能
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(roleForm, row);
      });
    };

    // 删除
    const handleDel = async (_id) => {
      await proxy.$api.roleOperate({ _id, action: "delete" });
      proxy.$message.success("删除成功");
      getRoleList();
    };

    // 控制dialog的出现 权限展示
    const showPermission = ref(false);
    // 当前的角色ID
    const curRoleId = ref("");
    // 当前的角色名称
    const curRoleName = ref("");
    // 菜单列表
    const menuList = ref([]);
    // 菜单列表初始化
    const getMenuList = async () => {
      try {
        let list = await proxy.$api.getMenuList();
        menuList.value = list;
        // 传入所有的菜单，返回一个map {菜单id->菜单名}
        getActionMap(list);
      } catch (e) {
        throw new Error(e);
      }
    };
    //权限列表dialog
    const handleOpenPermission = (row) => {
      // 获取该项的角色id 和 名称
      curRoleId.value = row._id;
      curRoleName.value = row.roleName;
      // 显示 dialog
      showPermission.value = true;
      // 解构出改项 应该该选中的keys
      // 不是我们人为选中的，而是数据一开始定义的
      let { checkedKeys } = row.permissionList;
      // 上面一步有延迟，所以用setTimeout
      setTimeout(() => {
        // proxy.$refs.tree 获取到elementui 的tree对象
        // 使用elementui定义的setCheckedKeys 设置选中的值
        // 这样一打开dialog就看见了选中的tree
        proxy.$refs.tree.setCheckedKeys(checkedKeys);
      });
    };
    // 提交给后端设置权限
    const handlePermissionSubmit = async () => {
      // 获取到当前选中的节点
      let nodes = proxy.$refs.tree.getCheckedNodes();
      // 获取到半选中的Keys
      let halfKeys = proxy.$refs.tree.getHalfCheckedKeys();
      // 选中的keys，这个是按钮，他没有children节点
      let checkedKeys = [];
      // 父节点的keys，每一个选中的菜单
      let parentKeys = [];
      // 遍历当前选中节点 区分去按钮和菜单
      nodes.map((node) => {
        // 如果没有子节点就是按钮
        // 我们之前用node_key指向我们的_id,存到 checkedKeys [按钮]
        // 他的爷爷和爸爸节点都存在parentKeys [爷爷，爸爸]
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      // 拼接参数
      let params = {
        // 当前选中的id
        _id: curRoleId.value,
        permissionList: {
          checkedKeys, //选中的子菜单
          halfCheckedKeys: parentKeys.concat(halfKeys), //半选的父菜单
        },
      };
      await proxy.$api.updatePermission(params);
      showPermission.value = false;
      proxy.$message.success("设置成功");
      getRoleList();
    };
    // 映射map
    const actionMap = reactive({});
    // 映射权限
    const getActionMap = (list) => {
      let myactionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          // 如果同时有chilren 和 action说明是菜单
          // 添加到映射的map里面去
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          }
          // 如果还有children没有action递归
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      // 使用一次递归 避免修改原来的对象所以这里处理一下JSON.parse(JSON.stringify())
      deep(JSON.parse(JSON.stringify(list)));
      // 最后复制给组件的actionMap
      actionMap.value = myactionMap;
    };
    return {
      actionMap,
      getActionMap,
      menuList,
      handleOpenPermission,
      getMenuList,
      handleEdit,
      handleSubmit,
      handleAdd,
      curRoleId,
      curRoleName,
      pager,
      handleCurrentChange,
      rules,
      action,
      showModal,
      showPermission,
      roleForm,
      roleList,
      columns,
      queryForm,
      handleClose,
      handlePermissionSubmit,
      handleReset,
      handleDel,
      getRoleList,
    };
  },
};
</script>
<style scoped lang="scss"></style>
