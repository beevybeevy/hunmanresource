<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" label-width="220px" :model="FormData" :rules="rules">
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('employee.username')" prop="username">
                <el-input v-model="FormData.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号 -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('employee.workNumber')" prop="workNumber">
                <!-- 工号禁用  disabled(禁用)  -->
                <el-input v-model="FormData.workNumber" disabled size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机  -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('employee.mobile')" prop="mobile">
                <el-input
                  v-model="FormData.mobile"
                  :disabled="!!$route.params.id"
                  size="mini"
                  class="input"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('employee.departmentName')" prop="departmentId">
                <!-- 放置及联部门组件 -->
                <select-tree v-model="FormData.departmentId" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--聘用形式  -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('employee.formOfEmployment')" prop="formOfEmployment">
                <el-select v-model="FormData.formOfEmployment" :placeholder="$t('employee.inputFormOfEmployment')" size="mini" class="inputW">
                  <el-option :label="$t('employee.official')" :value="1" />
                  <el-option :label="$t('employee.unofficial')" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('employee.transferTime')" prop="timeOfEntry">
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
              <el-form-item :label="$t('employee.transferTime')" prop="correctionTime">
                <el-date-picker v-model="FormData.correctionTime" size="mini" type="date" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('employee.staffPhoto')" prop="staffPhoto">
                <image-upload v-model="FormData.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="$router.push('/employee')">{{ $t('employee.cancel') }}</el-button>
              <el-button size="mini" type="primary" @click="saveData">{{ $t('employee.save') }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
import { addEmployee, editEmployee, getEmployeeDetail } from '@/api/department'
import SelectTree from './components/select-tree.vue'
import imageUpload from './components/image-upload.vue'
import i18n from '@/lang'
export default {
  components: { SelectTree, imageUpload },
  data() {
    return {
      FormData: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        formOfEmployment: '', // 聘用形式
        timeOfEntry: '', // 入职时间
        correctionTime: '', // 转正时间
        staffPhoto: '' // 头像
      },
      rules: {
        // 姓名校验
        username: [
          { required: true, message: i18n.t('employee.inputName'), trigger: 'blur' },
          { min: 1, max: 10, message: i18n.t('employee.nameFormat') }
        ],
        // 手机号校验
        mobile: [
          { required: true, message: i18n.t('employee.inputMobile'), trigger: 'blur' },
          { //   pattern 正则表达式
            pattern: /^1[3-9]\d{9}$/, message: i18n.t('employee.wrongMolie'), trigger: 'blur'
          }
        ],
        formOfEmployment: [{ required: true, message: i18n.t('employee.selectHire'), trigger: 'blur' }],
        departmentId: [{ required: true, message: i18n.t('employee.selectDepartment'), trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: i18n.t('employee.selectEntryDate'), trigger: 'blur' }],
        correctionTime: [{
          required: true, message: i18n.t('employee.dateOfBeingRegular'), trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (this.FormData.timeOfEntry) {
              if (new Date(this.FormData.timeOfEntry) > new Date(value)) {
                callback(new Error(i18n.t('employee.timeRule')))
                return
              }
            }
            callback()
          }
        }]
      }
    }
  },
  created() {
    // 如何获取路由参数的中id
    // if (this.$route.params.id) { this.getEmployeeDetail() }
    this.$route.params.id && this.getEmployeeDetail()
  },
  methods: {
    async getEmployeeDetail() {
      this.FormData = await getEmployeeDetail(this.$route.params.id)
    },

    saveData() {
      this.$refs.userForm.validate(async isOK => {
        if (isOK) {
          // 编辑模式
          if (this.$route.params.id) {
            // 编辑模式
            await editEmployee(this.FormData)
            this.$message.success(i18n.t('employee.updateDone'))
          } else {
            // 新增模式
            // 校验通过
            await addEmployee(this.FormData)
            this.$message.success(i18n.t('employee.addDone'))
          }
          this.$router.push('/employee')
        }
      })
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
