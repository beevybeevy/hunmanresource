<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" size="mini" class="role-button" @click="dialogFormVisible = true">添加角色</el-button>
      <el-table v-loading="isLoading" class="table" :data="tableData" style="width: 100%" border :header-cell-style="{background: '#f5f6f8'}">
        <el-table-column prop="id" label="序号" width="180">
          <template v-slot="{ row }">
            <span>{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="角色" width="180">
          <template v-slot="{ row }">
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
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editData.description" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <!-- 点击编辑后的两个按钮 -->
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="submitEdit(row)">确定</el-button>
              <el-button type="text" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <!-- 点击分配权限出现新的Dialog -->
              <el-button type="text" @click="distributeDialog(row.id)">分配权限</el-button>
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
        class="pagination-center"
        @current-change="onPageChange"
      />
      <!-- 添加角色出来的弹框 -->
      <el-dialog title="新增角色" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="newContent" :model="form" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <!-- 使用开关 -->
          <el-form-item label="启用：">
            <el-switch v-model="form.state" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="openDialog">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 点击分配权限后出来的弹框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <el-tree
          ref="tree"
          :data="permissionData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="permissionArray"
          :props="defaultProps"
          check-on-click-node
          check-strictly
          @check-change="handleCheckChange"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="submitPermissionChange">确 定</el-button>
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getRoleList, addRole, deleteRole, editRole, getPermissionList, getRoleDetail, correctPermission } from '@/api/role'
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
      dialogVisible: false,
      form: {
        name: '',
        state: false,
        description: ''
      },
      formLabelWidth: '120px',
      rules: {},
      permissionData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permissionArray: []
    }
  },
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
      const res = await getRoleList(this.page, this.pagesize)
      this.tableData = res.rows
      this.total = res.total
      this.isLoading = false
      this.tableData.forEach((item, index) => {
        const idx = (this.page - 1) * this.pagesize + index + 1
        this.$set(item, 'index', idx)
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
      this.$refs.newContent.resetFields()
      if (this.total % this.pagesize === 0) {
        this.total++
      }
      this.page = Math.ceil(this.total / this.pagesize)
      this.$message.success('添加成功')
      this.renderPage()
    },
    async deleteItem(id) {
      // console.log(this.tableData.id)
      // 先确认再删除，所以要把删除逻辑写在确认里面
      this.$confirm('确认删除吗').then(async() => {
        await deleteRole(id)
        if (this.tableData.length === 1 && this.page > 1) {
          this.page--
          this.$message.success('已删除')
        }
        this.renderPage()
      }).catch()
    },
    editItem(row) {
      row.isEdit = true
    },
    async submitEdit(row) {
      // console.log(id, obj)
      row.name = row.editData.name
      row.state = row.editData.state
      row.description = row.editData.description
      editRole(row.editData).then(() => {
        this.$message.success('更新数据成功')
        // this.renderPage()
        row.isEdit = false
      }).catch(() => {})
    },
    async distributeDialog(id) {
      this.selectedID = id
      const res = await getPermissionList(id)
      const result = res.filter(item => item.enVisible === '1')
      this.permissionData = this.transformData(result, 0)
      const secondRes = await getRoleDetail(id)
      this.permissionArray = secondRes.permIds
      this.dialogVisible = true
    },

    // 改变数据模式的递归函数
    transformData(list, rootValue) {
      const arr = []
      list.forEach(item => {
        if (item.pid === rootValue) {
          const children = this.transformData(list, item.id)
          if (children.length) {
            item.children = children
          }
          arr.push(item)
        }
      })
      // console.log(arr)
      return arr
    },
    async submitPermissionChange() {
      this.$confirm('确认更改权限吗').then(async() => {
        this.dialogVisible = false
        const arr = this.$refs.tree.getCheckedKeys()
        await correctPermission(this.selectedID, arr)
        this.$message.success('更改权限成功')
      }).catch()
    },
    // 子发生变化，父会被勾选中（前提是子的状态需要是true
    handleCheckChange(data, isChecked) {
      console.log(data, isChecked)
      if (data.pid !== 0) {
        if (isChecked === true) {
          this.$refs.tree.setChecked(data.pid, true)
        }
      }
    }
  }

}
</script>

<style>
.pagination-center {
  text-align: center;
  margin-top:10px
}
.role-button{
  margin-bottom:5px
}
.app-container{
  background-color: #fff;
  margin: 20px;
  padding:10px
}

</style>
