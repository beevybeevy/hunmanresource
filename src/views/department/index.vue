<template>
  <div class="container">
    <div class="app-container">
      <div class="block">
        <!-- <p>使用 scoped slot</p> -->
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ data.name }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                {{ data }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                操作
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div></template>

<script>
import { getDepartment, transListToTreeData } from '@/api/department'

export default {
  data() {
    const data = []
    return {
      data: JSON.parse(JSON.stringify(data))
    }
  },
  async created() {
    this.data = transListToTreeData(await getDepartment(), 0)
    console.log(this.node, this.data)
  },
  methods: {
    // append(data) {
    //   const newChild = { id: this.id++, label: 'testtest', children: [] }
    //   if (!data.children) {
    //     this.$set(data, 'children', [])
    //   }
    //   data.children.push(newChild)
    // },

    // remove(node, data) {
    //   const parent = node.parent
    //   const children = parent.data.children || parent.data
    //   const index = children.findIndex(d => d.id === data.id)
    //   children.splice(index, 1)
    // }
    //

  }
}
</script>

<style scoped>
.app-container,[data-v-f09716ce] {
    padding: 30px 140px;
    font-size: 14px;
}
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
