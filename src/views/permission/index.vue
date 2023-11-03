<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" @click="addorechoLevel()">添加权限</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="名称"
        >
          <!-- <el-tree
            :data="name"
            accordion
            @node-click="handleNodeClick"
          /> -->
        </el-table-column>
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
            <el-button type="text" size="small" @click="addorechoLevel()">添加</el-button>
            <el-button type="text" size="small" @click="addorechoLevel()">编辑</el-button>
            <el-button
              ref="delPermissions"
              type="text"
              size="small"
              @click="handleDelete(scope.row.id)"
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
      <el-dialog title="新增权限点" :visible.sync="dialogFormVisible">
        <el-form ref="formData" :model="formData" :rules="rules">
          <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formData.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="权限标识" :label-width="formLabelWidth" prop="code">
            <el-input v-model="formData.code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="权限描述" :label-width="formLabelWidth">
            <el-input v-model="formData.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="开启" :label-width="formLabelWidth">
            <el-switch v-model="formData.delivery" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ManualVerification">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
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
      id: null,
      formData: {
        name: '',
        code: '',
        description: '',
        type: 0,
        pid: 0,
        enVisible: ''
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 表单自动验证
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ]
      }
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
    },
    // 新增和编辑
    addorechoLevel() {
      // 清空表单内容
      this.formData.name = ''
      this.formData.code = ''
      // 显示表单  clearValidate
      this.dialogFormVisible = true
      // 清除表单校验规则
      this.$refs.formData?.resetFields()
    },
    // 表单手动验证
    ManualVerification() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$message.success('表单校验通过！')
          // 校验通过时的操作
          this.dialogFormVisible = false
        } else {
          this.$message.error('表单校验未通过，请完善信息！')
          // 校验未通过时的操作
        }
      })
      // this.dialogFormVisible = false
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
