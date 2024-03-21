<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" @click="addorechoLevel('add',0,1)">{{ $t('permission.addPermmision') }}</el-button>

      <el-table border :props="defaultProps" :data="tableData" row-key="id" :header-cell-style="{ background: '#eee' }" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="name" :label="$t('permission.name')" />
        <el-table-column prop="code" :label="$t('permission.identifier')" />
        <el-table-column prop="description" :label="$t('permission.description')" />
        <el-table-column :label="$t('permission.operation')">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addorechoLevel('add', row.id, 2)">{{ $t('permission.add') }}</el-button>
            <el-button type="text" @click="addorechoLevel('eitm', row.id)">{{ $t('permission.edit') }}</el-button>
            <el-button ref="delPermissions" type="text" @click="handleDelete(row.id)">{{ $t('permission.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 删除弹出框 -->
      <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>{{ $t('permission.deleteMessage') }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('permission.cancel') }}</el-button>
          <el-button type="primary" @click="del()">{{ $t('permission.confirm') }}</el-button>
        </span>
      </el-dialog>

      <!-- 新增、编辑弹出框 -->
      <el-dialog :title="titleItem" :visible.sync="dialogFormVisible">
        <el-form ref="formDataList" :model="formData" :rules="rules">
          <el-form-item :label="$t('permission.permissionName')" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formData.name" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('permission.permissionIdentifier')" :label-width="formLabelWidth" prop="code">
            <el-input v-model="formData.code" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('permission.permissionDescription')" :label-width="formLabelWidth">
            <el-input v-model="formData.description" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('permission.enabled')" :label-width="formLabelWidth">
            <!-- 如果后台返回数字类型，active-value 和 inactive-value 应该动态绑定 -->
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ManualVerification()">{{ $t('permission.confirm') }}</el-button>
          <el-button @click="dialogFormVisible = false">{{ $t('permission.cancel') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPermissions, deletePermissions, addPermissions, redactPermissions, echoPermissions } from '@/api/permission'
import i18n from '@/lang'
// import { logger } from 'runjs/lib/common'

export default {
  name: 'Permission',
  data() {
    return {
      // 按钮默认开启
      buttonValue: true,
      // 接收后端传过来的数组
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 控制删除对话框显示隐藏
      dialogVisible: false,
      formData: {
        name: '',
        code: '',
        description: '',
        type: 1,
        pid: 0,
        enVisible: ''
      },
      // 修改表头信息
      titleItem: i18n.t('permission.addPermissionIndentifier'),
      // 对话框显示隐藏
      dialogTableVisible: false,
      // 控制新增、编辑表单显示隐藏
      dialogFormVisible: false,
      // 弹出框里面表格的位置
      formLabelWidth: '180px',
      // 用来记录当前点击的用户id
      currentUserId: null,
      // 判断点击的是新增还是编辑
      actionType: '',
      // 表单自动验证
      rules: {
        name: [{ required: true, message: i18n.t('permission.nameMessage'), trigger: 'blur' }],
        code: [{ required: true, message: i18n.t('permission.identifierMessage'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.treeListForm()
  },
  methods: {
    // 树
    async treeListForm() {
      // 获取数据
      this.tableData = await getPermissions()
      // 渲染树状数据
      this.tableData = this.getDepartment(this.tableData)
    },
    // 树状数据
    getDepartment(list, id = 0) {
      const arr = []
      list.forEach(item => {
        if (item.pid === id) {
          // 找到了匹配的节点
          // 当前节点的id 和 当前节点的子节点的pid是想等的
          const children = this.getDepartment(list, item.id) // 找到的节点的子节点
          item.children = children // 将子节点赋值给当前节点
          arr.push(item)
        }
      })
      return arr
    },
    // 弹出框的删除
    async del() {
    // 发起请求
      deletePermissions(this.formData.id)
      // 关闭弹框
      this.dialogVisible = false
      // 重新渲染页面
      this.treeListForm()
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
    async addorechoLevel(actionType, id, type) {
      // 清除表单校验
      this.$refs.formDataList?.resetFields()
      // 判断是新增还是编辑
      if (actionType === 'add') {
        this.formData.type = type
        this.formData.pid = id
        this.formData.enVisible = '0'
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
        this.formData.enVisible = '1'
        // 给判断新增或编辑的数据赋值
        this.actionType = 'eitm'
        // 给id赋值
        this.currentUserId = id
        this.formData.pid = res.pid
        // console.log(this.formData.pid)
        if (this.formData.pid !== 0) {
          this.formData.type = 2
        } else { this.formData.type = 1 }
      }
      // 打开对话框
      this.dialogFormVisible = true
    },
    // 表单手动验证
    async ManualVerification() {
      const postData = { ...this.formData }
      const fn = this.actionType === 'eitm' ? redactPermissions : addPermissions
      // 手动校验表单
      this.$refs.formDataList.validate().then(() => {
        // 编辑
        if (fn) {
          postData.id = this.currentUserId
        }
        // 重新渲染页面
        this.treeListForm()
        return fn(postData)
      }).then(() => {
        // 重新渲染页面
        this.treeListForm()
        // 关闭对话框
        this.dialogFormVisible = false
        // 提示
        this.$message.success(i18n.t('permission.done'))
      }).catch(() => {
        this.$message.warning(i18n.t('permission.failed'))
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
