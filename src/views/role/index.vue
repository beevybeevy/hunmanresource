<template>
  <div class="container">
    <el-button type="primary" size="mini" @click="dialogFormVisible = true">添加角色</el-button>
    <el-table v-loading="isLoading" :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="序号" width="180" />
      <el-table-column prop="name" label="角色" width="180">
        <template v-slot="{row}">
          <el-input v-if="row.isEdit" v-model="row.editData.name" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="启用">
        <template v-slot="{ row }">
          <!-- 编辑后显示按钮，可以选择切换和不切换 -->
          <el-switch v-if="row.isEdit" v-model="row.editData.state" :active-value="1" :inactive-value="0" />
          <span v-else>{{ row.state === 1 ? '已启用' : '未启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template v-slot="{row}">
          <el-input v-if="row.isEdit" v-model="row.editData.description" />
          <span v-else>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <!-- 点击编辑后的两个按钮 -->
        <template v-slot="{ row }">
          <template v-if="row.isEdit">
            <el-button type="primary" size="mini" @click="submitEdit(row.editData)">确定</el-button>
            <el-button type="text" @click="row.isEdit=false">取消</el-button>
          </template>
          <template v-else>
            <el-button type="text">分配权限</el-button>
            <el-button type="text" @click="editItem(row)">编辑</el-button>
            <el-button type="text" @click="deleteItem(row.id)">删除</el-button>
          </template>
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
    <!-- 添加角色出来的弹框 -->
    <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
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
      rules: {}
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
      console.log(res)
      // console.log(res.rows)
      this.tableData = res.rows
      this.total = res.total
      this.isLoading = false
      this.tableData.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editData', {
          name: item.name,
          state: item.state,
          description: item.description,
          id: item.id
        })
      })
    },
    async openDialog() {
      this.form.state === true ? this.form.state = 1 : this.form.state = 0
      // console.log(this.form.description)
      await addRole(this.form.name, this.form.description, this.form.state)
      this.dialogFormVisible = false
      this.renderPage()
    },
    async deleteItem(id) {
      // console.log(this.tableData.id)
      // 先确认再删除，所以要把删除逻辑写在确认里面
      this.$confirm('确认删除吗').then(async() => {
        await deleteRole(id)
        this.renderPage()
      }).catch()
    },
    editItem(row) {
      row.isEdit = true
    },
    async submitEdit(obj) {
      // console.log(id, obj)

      await editRole(obj)
      this.$message.success('更新数据成功')
      // this.renderPage()
      this.renderPage()
    }
  }

}
</script>
