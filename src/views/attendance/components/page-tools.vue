<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <div v-if="showBefore" class="before">
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>

    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

  <style lang="scss">
   .page-tools {
      margin: 10px;
      .before {
        color: #383c4eff;
        font-size: 18px;
        font-weight: 500;
        font-family: "DIN";
      }
   }
  </style>

