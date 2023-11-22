<template>
  <div style="width: 100%" class="bigContainer">
    <div id="container" />

    <div class="body">
      <div class="search">
        <div v-for="item in list" :key="item.id" class="item" :class="{ active: activeId === item.id }" @click="doSearch(item.id)">{{ item.name }}</div>
      </div>
      <div class="block" width="300">
        <span class="demonstration">半径</span>
        <el-slider />
        <div class="button">
          <el-button size="small" style="margin-left: 300px;" @click="updateShow">取消</el-button>
          <el-button type="primary" size="small" @click="doSubmit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { getLocationListAPI } from '@/api/attandence'
export default {
  name: 'MapView',
  data() {
    return {
      list: [],
      activeId: 1
    }
  },
  mounted() {
    this.initAMap()
    this.getMapList()
  },
  unmounted() {
    this.map?.destroy()
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: 'b1d93251f9b98004c43feb0e4112f096', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map('container', {
            // 设置地图容器id
            viewMode: '3D', // 是否为3D地图模式
            zoom: 11, // 初始化地图级别
            center: [116.397428, 39.90923] // 初始化地图中心点位置
          })
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async getMapList() {
      const res = await getLocationListAPI()
      this.list = res
      console.log(res)
    },
    doSubmit() {

    },
    updateShow() {
      this.$emit('update', true)
    },
    doSearch(id) {
      activeId === id
    }
  }
}

</script>

<style lang="scss" scoped>
.bigContainer {
  display: flex;
}

#container {
  width: 70%;
  height: 620px;
  border: 2px solid #ccc;
}

.body {
  width: 40%;
  position: relative;
  display: flex;
  padding: 20px;

  .block {
    position: absolute;
    width: 70%;
    bottom: 10px;
    .button{
      display: flex;
      position: absolute;
      left: 10px;
    }
  }

  .search {
    width: 100%;
    height: 560px;
    border: 1px solid #ccc;
    margin-left: 20px;
    overflow: auto;

    .item {
      width: 100%;
      line-height: 40px;
      text-align: center;
      color: #606662;
      font-size: 13px;

      &:nth-child(2n) {
        background-color: #f5f7fa;
      }
    }

    .active {
      background-color: #0058f5 !important;
      color: #fff;
    }
  }
}
</style>
