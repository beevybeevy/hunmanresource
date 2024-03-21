<template>
  <div class="container">
    <div class="app-container">
      <div class="block">
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini">
                {{ data.managerName }}
              </el-button>
              <el-popover slot="fold" placement="bottom" width="150" trigger="hover">
                <el-button slot="reference" type="text" size="mini"> 操作 <span class="el-icon-arrow-down" /></el-button>
                <template>
                  <el-button type="text" class="buttonstyle">添加子部门</el-button>
                  <el-button type="text" class="buttonstyle">编辑部门</el-button>
                  <el-button type="text" class="buttonstyle">删除</el-button>
                </template>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </div>

    </div>
  </div>
</template>

<script>
import { getDepartment, transListToTreeData } from '@/api/department'

export default {
  name: 'Department',
  // 定义数据
  data() {
    return {
      visible: false, // 确认导出框状态是否可见
      showDialog: false,
      depts: [],
      // 树形设置字段 默认属性值
      defaultProps: {
        children: 'children', // 从哪个字段读取子节点
        label: 'name' // 显示name
      },
      renderContent: '',
      // 对话框显示隐藏
      dialogTableVisible: false,
      // 控制新增、编辑表单显示隐藏
      dialogFormVisible: false,
      // 弹出框里面表格的位置
      formLabelWidth: '120px',
      dialogVisible: false,
      formData: {
        id: '',
        createTime: '',
        name: '',
        code: '',
        introduce: '',
        pid: 0,
        managerId: ''
      }
    }
  },
  // 初始化加载数据转化树形
  created() {
    this.getDepartment() // 调取接口
  },
  methods: {
    //  getDepartment组织架构数据
    async getDepartment() {
      // 递归方法 将列表转化成树形
      // const result = await getDepartment()
      this.depts = transListToTreeData(await getDepartment(), 0) // 调用方法，传入起始值
      // 设置选中节点
      // 数组件渲染是异步的，等到更新完毕
      this.$nextTick(() => {
        // 树渲染完成
        this.$refs.deptTree.setCurrentKey(this.depts)
      })
    },
    remove(node, data) {
      console.log(node, data)
      console.log(this.renderContent)
    }
  }
}
</script>

<style scoped>
.app-container,[data-v-f09716ce] {
    padding: 30px 140px;
    font-size: 14px;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.el-button--mini, .el-button--small{
  font-size: 14px;
  color: #001529;
  margin-left: 10px;
}

.buttonstyle {
  display: block;
  margin-left: 25px;
  font-size: 14px;
  color: #001529;
}
</style>
