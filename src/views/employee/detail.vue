<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" label-width="220px">
          <!-- 姓名 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userinfo.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>

          </el-row>
          <!-- 工号 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机 聘用形式  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="userinfo.mobile" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件 -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker size="mini" type="date" value-format="yyyy-MM-dd" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="timeOfEntry">
                <el-date-picker size="mini" type="date" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像" prop="correctionTime">
                <!-- 放置上传图片 -->
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      userInfo: {
        username: '', // 姓名
        workNumber: '', // 工号
        mobile: '', // 手机号
        formOfEmployment: null, // 聘用形式
        // departmentId: null, // 部门id
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }

    }
  }
}
</script>

<style scoped lang="scss">
.edit-form {
    background: #fff;
    padding: 20px;

    .inputW {
        width: 380px
    }
}
</style>
