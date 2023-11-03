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
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在template -->
        <!-- <template v-slot="{ data }">
            <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
              <el-col>{{ data.name }}</el-col>
            </el-row>
          </template>
        </el-tree> -->
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
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
              <el-button size="mini" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
  </div></template>
<script>
import { getDepartment, transListToTreeData, getEmployeeList } from '@/api/department'

export default {
  name: 'Department',
  data() {
    return {
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 存储查询的参数
      queryParams: {
        departmentId: null,
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
  }
}</style>
