<!-- 创建员工导入组件 -->
<template>
  <!-- 依赖包 -->
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
    @change="uploadChange"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        >
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getTemplate">{{ $t('employee.downloadSample') }}</el-button>
          <span>{{ $t('employee.dragFile') }}
            <el-button type="text" @click="handleUpload">{{ $t('employee.dragFile') }}</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">{{ $t('employee.cancel') }}</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import FileSaver from 'file-saver'
import { getExportTemplate, uploadExcel } from '@/api/department'
export default {
  props: {
    // 控制导入组件显示隐藏
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getTemplate() {
      const data = await getExportTemplate()
      FileSaver.saveAs(data, '员工导入模版.xlsx')
    },
    // 弹出文件选择器-只有一种方式 通过input file
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    // 文件改变上传
    async uploadChange(event) {
      console.log(event.target.files)
      //   调用上传接口
      const files = event.target.files // input的文件列表
      if (files.length > 0) {
        // 大于0 说明有文件要上传
        const data = new FormData()
        data.append('file', files[0]) // 将文件参数加入到formData 中
        try {
          await uploadExcel(data)
          // 成功
          this.$emit('uploadSuccess') // 通知父组件 上传成功
          this.$emit('update:showExcelDialog', false) // 关闭弹层
        } catch (error) {
          // 捕获失败
          //  this.$refs['excel-upload-input'].value = ''
        } finally {
          // 成功和失败都会执行finally
          this.$refs['excel-upload-input'].value = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
    display: flex;
    justify-content: center;
    margin: 20px;
    width: 360px;
    height: 180px;
    align-items: center;
    color: #697086;

    .excel-upload-input {
        display: none;
        z-index: -9999;
    }

    .btn-upload,
    .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .drop {
        line-height: 40px;
        color: #bbb;

        i {
            font-size: 60px;
            display: block;
            color: #c0c4cc;
        }
    }
}
</style>
