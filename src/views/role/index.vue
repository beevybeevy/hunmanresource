<template>
  <div class="container">
    <el-button type="primary" size="mini" @click="dialogFormVisible = true">添加角色</el-button>
    <el-table v-loading="isLoading" :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="序号" width="180" />
      <el-table-column prop="name" label="角色" width="180">
        <template v-slot="{row}">
          <el-input v-if="row.isEdit" v-model="editData.name" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="启用">
        <template v-slot="{ row }">
          <span>{{ row.state === 1 ? '已启用' : '未启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="operation" label="操作">
        <template v-slot="{ row }">
          <el-button type="text">分配权限</el-button>
          <el-button type="text" @click="editItem(row)">编辑</el-button>
          <el-button type="text" @click="deleteItem(row.id)">删除</el-button>
        </template>
      </el-table-column>

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
import { getRoleList, addRole, deleteRole, editRole } from '@/api/role'
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
        state: false,
        description: ''
      },
      formLabelWidth: '120px',
      rules: {},
      editData: {
        name: ''
      }
    }
  },
  // async created() {
  //   const res = await getRoleList()
  //   console.log(res)
  // }
  async created() {
    await this.renderPage()
    this.rules = {
      name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
      description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
    }
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
      this.tableData.forEach(item => {
        this.$set(item, 'isEdit', false)
      })
    },
    async openDialog() {
      this.form.state === true ? this.form.state = 1 : this.form.state = 0
      // console.log(this.form.description)
      await addRole(this.form.name, this.form.description, this.form.state)
      this.dialogFormVisible = false
    },
    async deleteItem(id) {
      // console.log(this.tableData.id)
      // 先确认再删除，所以要把删除逻辑写在确认里面
      this.$confirm('确认删除吗').then(async() => {
        await deleteRole(id)
        this.renderPage()
      }).catch()
    },
    async editItem(row) {
      const res = await editRole(row.id)
      console.log(res)
      this.editData.name = res.name
      row.isEdit = true
    }
  }

}
</script>
