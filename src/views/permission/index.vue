<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary">主要按钮</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="名称"
        />
        <el-table-column
          prop="code"
          label="标识"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="del(scope.row.id)">添加</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button
              ref="delPermissions"
              type="text"
              size="small"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹出框 -->
      <el-dialog
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>确定要删除该数据吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="del()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPermissions, deletePermissions } from '@/api/table'

export default {
  name: 'Permission',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      id: null
    }
  },
  async created() {
    const res = await getPermissions()
    this.tableData = res
  },
  methods: {
    // 弹出框的删除
    async del() {
      deletePermissions(this.id)
      this.dialogVisible = false
      this.tableData = await getPermissions()
    },
    // X 号的点击关闭
    handleClose() {
      this.dialogVisible = false
    },
    // 打开弹出框
    handleDelete(id) {
      this.dialogVisible = true
      this.id = id
    }
  }
}
</script>

<style scoped>
.app-container{
  padding: 20px;
}

.el-button{
  margin-bottom: 10px;
}
</style>
