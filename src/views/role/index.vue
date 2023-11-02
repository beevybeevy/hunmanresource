<template>
  <div class="container">
    <el-button type="primary" size="mini" @click="dialogFormVisible = true">添加角色</el-button>
    <el-table v-loading="isLoading" :data="tableData" style="width: 100%" border>

      <el-table-column prop="id" label="序号" width="180" />
      <el-table-column prop="name" label="角色" width="180" />
      <el-table-column prop="state" label="启用">
        <template v-slot="{ row }">
          <span>{{ row.state === 1 ? '已启用' : '未启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="operation" label="操作" />

    </el-table>
    <el-pagination
      background
      layout="prev,pager,next"
      :current-page="page"
      :page-size="pagesize"
      :total="total"
      @current-change="onPageChange"
    />

    <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
      <!-- 嵌套输入框 -->
      <el-form :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <!-- 使用开关 -->
        启用：<el-switch v-model="form.state" />
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="openDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      tableData: [],
      page: 1,
      pagesize: 5,
      total: 0,
      isLoading: false,
      dialogFormVisible: false,
      form: {
        name: '',
        // value: false,
        state: false,
        description: ''
      },
      formLabelWidth: '120px',
      value: false,
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  // async created() {
  //   const res = await getRoleList()
  //   console.log(res)
  // }
  async created() {
    this.renderPage()
  },
  methods: {
    onPageChange(page) {
      this.page = page
      this.renderPage()
    },
    // 渲染页面
    async renderPage() {
      this.isLoading = true
      // 还缺少Loading遮罩
      const res = await getRoleList(this.page, this.pagesize)
      // console.log(res.rows)
      this.tableData = res.rows
      this.total = res.total
      this.isLoading = false
    },
    async openDialog() {
      this.form.state === true ? this.form.state = 1 : this.form.state = 0
      console.log(this.form.description)
      await addRole(this.form.name, this.form.description, this.form.state)
      this.dialogFormVisible = false
    }
  }

}
</script>
