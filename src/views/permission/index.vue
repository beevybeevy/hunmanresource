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
          width="180"
        />
        <el-table-column
          prop="identification"
          label="标识"
          width="180"
        />
        <el-table-column
          prop="describe"
          label="描述"
        />
        <el-table-column>     
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </el-table-column>
        <!-- <template slot-scope="scope">
        </template> -->
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Permission',
  data() {
    return {
      tableData: [{
        identification: '2016-05-02',
        name: '王小虎',
        describe: '上海市普陀区金沙江路 1518 弄',
        operation: '添加，删除'
      }]
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
