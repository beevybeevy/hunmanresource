<template>
  <div class="container">
    <el-button type="primary" size="mini" @click="dialogFormVisible = true">添加角色</el-button>
    <el-table v-loading="isLoading" :data="tableData" style="width: 100%" border>

      <el-table-column prop="id" label="序号" width="180" />
      <el-table-column prop="name" label="角色" width="180" />
      <el-table-column prop="state" label="启用" />
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

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <!-- 嵌套输入框 -->
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role'
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
        name: ''
      },
      formLabelWidth: '120px'
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
      this.tableData = res.rows
      this.total = res.total
      this.isLoading = false
    }
  }

}
</script>
