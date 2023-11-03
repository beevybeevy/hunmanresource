<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" label-width="220px" :model="FormData" :rules="rules">
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="FormData.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>

          </el-row>
          <!-- 工号 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <!-- 工号禁用  disabled(禁用)  -->
                <el-input v-model="FormData.workNumber" disabled size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="FormData.mobile" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件 -->
                <select-tree v-model="FormData.departmentId" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--聘用形式  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="FormData.formOfEmployment" placeholder="请输入" size="mini" class="inputW">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="FormData.timeOfEntry"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 转正时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker v-model="FormData.correctionTime" size="mini" type="date" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像" prop="">
                <!-- 放置上传图片 -->
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="saveData">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
import SelectTree from './components/select-tree.vue'
export default {
  components: { SelectTree },
  data() {
    return {
      FormData: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        departmentId: '',
        formOfEmployment: null, // 聘用形式
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        // 姓名校验
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 4, message: '姓名为1-4位' }
        ],
        // 手机号校验
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { //   pattern 正则表达式
            pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
          }
        ],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [{
          required: true, message: '请选择转正时间', trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (this.FormData.timeOfEntry) {
              if (new Date(this.FormData.timeOfEntry) > new Date(value)) {
                callback(new Error('转正时间不能小于入职时间'))
                return
              }
            }
            callback()
          }
        }]
      }
    }
  },
  methods: {
    saveData() {
      this.$refs.userForm.validate()
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
