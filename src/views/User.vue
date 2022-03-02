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
        <el-button type="primary">新增</el-button>
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
            <el-button size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
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
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
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
      pageSize: 6
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
    });
    // 获取用户列表和分页信息
    const getUserList = async () => {
      let params = { ...user, ...pager }
      try {
        const { list, page } = await proxy.$api.getUserList(params)
        console.log('page', page)
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
    //  重置
    const handleReset = () => {
      proxy.$refs.form.resetFields()
    }
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

    const handleCreate = () => { }
    const handleEdit = () => { }
    return {
      columns, pager, user, userList, handleCurrentChange, handleQuery, getUserList, handleReset, handleCreate, handleDel, handleEdit, handlePatchDel, handleSelectionChange,
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
