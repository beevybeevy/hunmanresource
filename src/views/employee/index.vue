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
        <!-- 树形组件 --> <!-- 先初始化首个节点->记录节点->选中节点->记录节点 -->
        <!-- data 绑定数据，
          props设置属性 树形配置，
          default-expand-all 默认展开所有节点，
          highlight-current 高亮，
         :expand-on-click-node="false" 关闭点击折叠展开 -->
        <!-- el-tree 插槽内容 -->
        <!-- 切换节点用 ref属性，key标识， @node-click="onNodeClick" 节点事件-->
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
        <!-- el-row 行 ，type布局模式，justify flex的布局下的水平排列方式-->
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <!-- @click="showDialog = true;"点击出现导入弹层 -->
          <el-button size="mini" @click="showDialog = true;">excel导入</el-button>
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
        <!-- :data="list" 获取员工数据时绑定表格 -->
        <el-table :data="list" tooltip-effect="dark" :header-cell-style="{ background: '#f5f6f8' }">
          <!-- 选框 -->
          <el-table-column type="selection" width="55" />
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <!-- 作用域插槽 -->
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
              <el-button size="mini" type="text" @click="getRole(row.id)">角色</el-button>
              <el-popconfirm title="确认删除该行数据吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!--  align 是flex布局下水平排列方式 -->
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
    <!-- 分配角色弹框 -->
    <BoxRole ref="centerDialogVisible" />
    <!-- 引入导入弹框 -->
    <ImportExcel :show-excel-dialog.sync="showDialog" />
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import {
  getDepartment, // 组织架构
  transListToTreeData, // 树型
  getEmployeeList, // 员工列表
  delEmployee, // 删除员工
  exportEmployeeExecel // 导出excel
} from '@/api/department'

import ImportExcel from './components/import-excel.vue'// 导入员工导入组件
import BoxRole from './components/box-role.vue' // 导入分配角色组件
export default {
  name: 'Department',
  components: {
    ImportExcel,
    BoxRole
  },
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
      // 分页参数 节点存储查询的参数
      queryParams: {
        departmentId: null, // 记录部门id
        page: 1, // 当前页码
        pagesize: 10,
        keyword: ''// 设置关键字参数模糊搜索
      },
      total: 0, // 记录员工的总数
      list: []// 存储员工数据
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
      // console.log(this.depts[0])
      this.queryParams.departmentId = this.depts[0].id // 记录首个节点Id
      // 设置选中节点
      // 数组件渲染是异步的，等到更新完毕
      this.$nextTick(() => {
        // 树渲染完成
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 获取员工列表
      this.getEmployeeList()
    },
    // 切换部门 获取右侧数据
    selectNode(node) {
      this.queryParams.departmentId = node.id // 重新记录了参数
      this.queryParams.page = 1 // 设置第一页
      // 获取员工列表
      this.getEmployeeList()
    },
    onNodeClick(node) {
      console.log(node)
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    // 获取员工列表 （先封装api获取列表->定义数据list 封装)
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
      // 删除最后一页最后一项，默认返回前一页
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      this.getEmployeeList()
      this.$message.success('删除员工成功')
    },
    // 导出excel文件
    async exportEmployeeExecel() {
      const result = await exportEmployeeExecel()
      FileSaver.saveAs(result, '员工表.xlsx') // 下载文件
    },
    // 显示员工角色
    getRole(id) {
      this.$refs.centerDialogVisible.getRole(id)
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
