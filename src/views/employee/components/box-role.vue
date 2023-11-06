<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" left title="分配角色">
      <!-- 弹层内容 -->
      <!-- checkbox -->
      <el-checkbox-group v-model="roleIds">
        <!-- 放置n个的checkbox  要执行checkbox的存储值 item.id-->
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="alloctRole">确定</el-button>
          <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEnableRoleList, getRole, assignRole } from '@/api/department'
export default {
  name: 'GetAvailable',
  data() {
    return {
      centerDialogVisible: false, // 用来控制角色弹层的显示
      roleList: [], // 接收角色列表
      roleIds: [], // 用来双向绑定数据的
      list: [],
      currentId: null // 用来记录当前点击的用户id
    }
  },
  methods: {
    // 点击角色按钮弹出层
    async getRole(id) {
      // 发请求获取角色信息
      this.roleList = await getEnableRoleList()
      this.currentId = id
      // 角色详情
      const { roleIds } = await getRole(id)
      // 获取角色id
      this.roleIds = roleIds
      // 打开弹框,要等数据加载完成再打开弹框
      this.centerDialogVisible = true
    },
    // 分配角色
    async alloctRole() {
      await assignRole({
        id: this.currentId,
        roleIds: this.roleIds
      })
      this.$message.success('分配用户角色成功')
      this.centerDialogVisible = false
    }
  }

}
</script>

<style></style>
