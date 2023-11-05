<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @node-click="onNodeClick"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showDialog = true;">excel导入</el-button>
          <!-- <el-button size="mini" @click="exportEmployeeExecel">excel导出</el-button> -->
          <el-popover v-model="visible" placement="top" width="160">
            <p>文件确定导出吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="visible = false; exportEmployeeExecel()">确定</el-button>
            </div>
            <el-button slot="reference" class="jiege" size="mini">excel导出</el-button>
          </el-popover>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list" tooltip-effect="dark">
          <!-- 选框 -->
          <el-table-column type="selection" width="55" />
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-popconfirm title="确认删除该行数据吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <span style="font-size: 13px;color: #606266;">共 {{ total }} 条</span>
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <!-- 导入弹框 -->
    <ImportExcel :show-excel-dialog.sync="showDialog" />
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import {
  getDepartment,
  transListToTreeData,
  getEmployeeList, delEmployee,
  exportEmployeeExecel
} from '@/api/department'

// 导入员工导入组件
import ImportExcel from './components/import-excel.vue'
export default {
  name: 'Department',
  components: {
    ImportExcel
  },
  data() {
    return {
      visible: false,
      showDialog: false,
      depts: [],
      // 树形默认属性值
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 节点存储查询的参数
      queryParams: {
        departmentId: null, // 记录部门id
        page: 1, // 当前页码
        pagesize: 10,
        // 设置关键字参数
        keyword: ''
      },
      total: 0, // 记录员工的总数
      list: []
    }
  },
  created() {
    this.getDepartment() // 调取接口
  },
  methods: {
    async getDepartment() {
      // const result = await getDepartment()
      this.depts = transListToTreeData(await getDepartment(), 0)
      this.queryParams.departmentId = this.depts[0].id
      // 设置选中节点
      // 数组渲染
      this.$nextTick(() => {
        // 树渲染完
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 获取员工列表
      this.getEmployeeList()
    },
    // 获取右侧数据
    selectNode(node) {
      this.queryParams.departmentId = node.id // 重新记录了参数
      this.queryParams.page = 1 // 设置第一页
      this.getEmployeeList()
    },
    onNodeClick(node) {
      console.log(node)
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    // 获取员工列表
    async getEmployeeList() {
      this.loding = true
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
      // this.loding = false
    },
    // 切换页码
    changePage(newPage) {
      this.queryParams.page = newPage // 赋值新页码
      this.getEmployeeList() // 查询数据
    },
    // 模糊查询
    changeValue() {
      clearTimeout(this.timer)// 防抖处理
      this.timer = setTimeout(() => {
        this.getEmployeeList()
      }, 300)
    },
    // 删除员工
    async confirmDel(id) {
      await delEmployee(id)
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      this.getEmployeeList()
      this.$message.success('删除员工成功')
    },
    // 导出excel文件
    async exportEmployeeExecel() {
      const result = await exportEmployeeExecel()
      FileSaver.saveAs(result, '员工表.xlsx') // 下载文件
    }

  }

}

</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }

    .jiege {
      margin-left: 10px;
    }

  }
}
</style>
