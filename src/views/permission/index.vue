<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary">主要按钮</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="名称"
        />
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
            <el-button type="text" size="small">添加</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="del(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getPermissions, deletePermissions } from '@/api/table'

export default {
  name: 'Permission',
  data() {
    return {
      tableData: []
    }
  },
  async created() {
    const res = await getPermissions()
    this.tableData = res
  },
  methods: {
    del(id) {
      deletePermissions(id)
      getPermissions()
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
