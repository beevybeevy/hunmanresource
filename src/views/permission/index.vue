<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" @click="addorechoLevel('add')">添加权限</el-button>
      <el-table default-expand-all :data="tableData" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" size="small" @click="addorechoLevel()">添加</el-button>
            <el-button type="text" size="small" @click="addorechoLevel('eitm', row.id)">编辑</el-button>
            <el-button
              ref="delPermissions"
              type="text"
              size="small"
              @click="handleDelete(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 删除弹出框 -->
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
      <!-- 新增、编辑弹出框 -->
      <el-dialog :title="titleItem" :visible.sync="dialogFormVisible">
        <el-form ref="formDataList" :model="formData" :rules="rules">
          <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formData.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="权限标识" :label-width="formLabelWidth" prop="code">
            <el-input v-model="formData.code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="权限描述" :label-width="formLabelWidth">
            <el-input v-model="formData.description" autocomplete="off" />
          </el-form-item>
          <el-form-item label="开启" :label-width="formLabelWidth">
            <el-switch v-model="formData.delivery" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ManualVerification()">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPermissions, deletePermissions, addPermissions, redactPermissions, echoPermissions } from '@/api/permission'

export default {
  name: 'Permission',
  data() {
    return {
      // 接收后端传过来的数组
      tableData: [],
      // 控制删除对话框显示隐藏
      dialogVisible: false,
      formData: {
        name: '',
        code: '',
        description: '',
        type: 1,
        pid: 0,
        enVisible: '0'
      },
      // 修改表头信息
      titleItem: '新增权限点',
      // 对话框显示隐藏
      dialogTableVisible: false,
      // 控制新增、编辑表单显示隐藏
      dialogFormVisible: false,
      // 单个列所占据尺寸
      formLabelWidth: '120px',
      // 表单自动验证
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ]
      },
      // 用来记录当前点击的用户id
      currentUserId: null,
      // 判断点击的是新增还是编辑
      actionType: ''
    }
  },
  async created() {
    // 获取数据
    const res = await getPermissions()
    // 渲染数据
    this.tableData = res
  },
  methods: {
    // 弹出框的删除
    async del() {
      deletePermissions(this.formData.id)
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
      this.formData.id = id
    },
    // 新增和编辑
    async addorechoLevel(actionType, id) {
      // 清除表单校验
      this.$refs.formDataList?.resetFields()
      // 判断是新增还是编辑
      if (actionType === 'add') {
        // 清空表单
        this.formData.name = ''
        this.formData.code = ''
        this.formData.description = ''
        // 给判断新增或编辑的数据赋值
        this.actionType = 'add'
        // 清空id的值
        this.currentUserId = null
      } else if (actionType === 'eitm') {
        // 编辑回显
        const res = await echoPermissions(id)
        this.formData.name = res.name
        this.formData.code = res.code
        this.formData.description = res.description
        // 给判断新增或编辑的数据赋值
        this.actionType = 'eitm'
        // 给id赋值
        this.currentUserId = id
      }
      // 打开对话框
      this.dialogFormVisible = true
    },
    // 表单手动验证
    async ManualVerification() {
      const postData = { ...this.formData }
      const ids = this.actionType === 'eitm' ? redactPermissions : addPermissions
      // 手动校验表单
      this.$refs.formDataList.validate().then(async() => {
        // 编辑
        if (ids) {
          postData.id = this.currentUserId
          // 重新渲染页面
          this.tableData = await getPermissions()
        }
        return ids(postData)
      }).then(async() => {
        // 重新渲染页面
        this.tableData = await getPermissions()
        // 关闭对话框
        this.dialogFormVisible = false
        // 提示
        this.$message.success('操作成功')
      }).catch(() => {
        this.$message.success('操作失败')
      })
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
