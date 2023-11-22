<template>
  <div class="container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>
          <div class="before-box">
            <p>未处理</p>
            <!-- {{ attendInfo.tobeTaskCount }} -->
          </div>
        </template>
        <template v-slot:after>
          <!-- <el-button size="mini" type="warning" @click="setRemind">提醒</el-button> -->
          <el-button size="mini" type="primary" plain @click="dialogVisible = true">打卡范围</el-button>
          <el-button size="mini" type="primary">设置</el-button>
        </template>
      </page-tools>
      <el-dialog
        title="打卡范围设置"
        :visible.sync="dialogVisible"
        fullscreen
      >
        <div class="map">
          <gdMap @update="updateShow" />
          <div />
        </div>
        <!-- <el-button size="mini" @click="dialogVisible = false">取 消</el-button> -->
      </el-dialog>
    </div>
  </div>
</template>
<script>
import pageTools from './components/page-tools.vue'
import gdMap from './components/MapContainer.vue'
export default {
  name: 'Attendance',
  components: {
    pageTools,
    gdMap
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    updateShow() {
      this.dialogVisible = false
    }
  }
}
</script>
<style>
.map{
  display: flex;
}
</style>
