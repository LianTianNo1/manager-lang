<template>
  <div class="user-manage">
    <!-- 搜索框 -->
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
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
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <!-- 用户列表 -->
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
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
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total || 10"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
      <el-dialog title="用户新增" v-model="showModal">
        <el-form
          ref="dialogForm"
          :model="userForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="userForm.userName"
              :disabled="action === 'edit'"
              placeholder="请输入用户名称"
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input
              v-model="userForm.userEmail"
              :disabled="action === 'edit'"
              placeholder="请输入用户邮箱"
            >
              <template #append>@lang.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="岗位" prop="job">
            <el-input v-model="userForm.job" placeholder="请输入岗位" />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="userForm.state">
              <el-option :value="1" label="在职"></el-option>
              <el-option :value="2" label="离职"></el-option>
              <el-option :value="3" label="试用期"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统角色" prop="roleList">
            <el-select
              v-model="userForm.roleList"
              placeholder="请选择用户系统角色"
              multiple
              style="width: 100%"
            >
              <el-option
                v-for="role in roleList"
                :key="role._id"
                :label="role.roleName"
                :value="role._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-cascader
              v-model="userForm.deptId"
              placeholder="请选择所属部门"
              :options="deptList"
              :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
              clearable
              style="width: 100%"
            ></el-cascader>
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
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
export default {
  name: "User",
  setup() {
    // 解构出上下文
    const { proxy } = getCurrentInstance()
    const user = reactive({ state: 0 })
    // 用户列表
    const userList = ref([])
    // 分页
    const pager = reactive({
      pageNum: 1,
      pageSize: 6,
    })
    // 定义动态表格-格式
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        width: 180,
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width: 180,
      },
    ]);

    // 初始化接口调用
    onMounted(() => {
      // 获取用户列表
      getUserList();
      // 获取部门列表
      getDeptList();
      // 获取角色列表
      getRoleList();
    });
    // 获取用户列表和分页信息
    const getUserList = async () => {
      let params = { ...user, ...pager }
      try {
        const { list, page } = await proxy.$api.getUserList(params)
        // console.log('page', page)
        userList.value = list
        pager.total = page.total
      } catch (error) {
        proxy.$message.error('获取数据出现异常')
        console.log(error)
      }

    }
    // 查询用户
    const handleQuery = () => {
      getUserList()
    }
    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    // 监听分页变化
    const handleCurrentChange = (current) => {
      // 设置第几页
      pager.pageNum = current
      // 再重新进行分页查询
      getUserList()
    }
    // 删除用户
    const handleDel = async (row) => {
      await proxy.$api.userDel({
        // 可删除多个 userId:[id1,id2,...]
        userId: [row.userId]
      })
      proxy.$message.success('删除成功！')
      getUserList()

    }
    // 选中用户列表对象
    const checkedUserIds = ref([]);
    // 删除多条信息
    const handlePatchDel = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value, //可单个删除，也可批量删除
      });
      // 判断改变条数
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.success("修改失败");
      }
    };
    // 多选 element封装的方法 list是选中的项
    const handleSelectionChange = (list) => {
      // 把所有选中的项加入到arr里，最后把arr赋值给选中的checkedUserIds
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUserIds.value = arr;
    };
    // 定义用户操作行为
    const action = ref("add");
    // 弹框显示对象dialog
    const showModal = ref(false);
    // 新增用户Form对象
    const userForm = reactive({
      state: 3,
    });
    // 用户弹窗关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset('dialogForm');
    };
    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        { required: true, message: "请输入用户邮箱", trigger: "blur" },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
    });

    // 用户新增
    const handleCreate = () => {
      action.value = "add";
      showModal.value = true;
    }

    // 所有角色列表
    const roleList = ref([]);
    // 获取角色列表
    const getRoleList = async () => {
      let list = await proxy.$api.getRoleList();
      roleList.value = list;
    };

    // 所有部门列表
    const deptList = ref([]);
    // 获取部门列表
    const getDeptList = async () => {
      let list = await proxy.$api.getDeptList();
      deptList.value = list;
    };
    // 用户提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm);
          params.userEmail += "@lang.com";
          // 请求方式
          params.action = action.value;
          let res = await proxy.$api.userSubmit(params);
          if (res) {
            // 隐藏dialog
            showModal.value = false;
            proxy.$message.success("用户创建成功");
            // 清空添加信息的form
            handleReset("dialogForm");
            // 重新获取用户列表
            getUserList();
          }

        }
      });
    };
    // 用户编辑
    const handleEdit = (row) => {
      // 为编辑状态，之后和添加使用同一个接口发给后端，后端判断是添加还是编辑
      action.value = "edit";
      // 显示对话框
      showModal.value = true;
      // 在对话框显示出来的时候
      proxy.$nextTick(() => {
        // 把userFrom做一层浅拷贝，把改行的信息传入进行
        Object.assign(userForm, row);
      });
    };
    return {
      action, handleEdit, getRoleList, getDeptList, deptList, roleList, userForm, handleClose, rules, showModal, handleSubmit, columns, pager, user, userList, handleCurrentChange, handleQuery, getUserList, handleReset, handleCreate, handleDel, handlePatchDel, handleSelectionChange,
    }

  }
}
</script>
<style scoped lang="scss">
.user-manage {
  position: relative;
  background-image: linear-gradient(145deg, var(--spink), var(--sblue));
}
.base-table {
  background: var(--swhite);
}
</style>
