<template>
  <div style="width: 100%" class="bigContainer">
    <div id="container" />

    <div class="body">
      <div class="search">
        <div v-for="item in list" :key="item.id" class="item" :class="{ active: activeId === item.id }" @click="doSearch(item)">{{ item.name }}</div>
      </div>
      <div class="block" width="300">
        <span class="demonstration">半径</span>
        <el-slider v-model="radius" :max="1000" />
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
      activeId: 1,
      radius: 200
    }
  },
  mounted() {
    this.initAMap()
    this.getMapList()
  },
  updated() {
    this.circle.setRadius(this.radius)
    // this.map.setFitView()
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
            zoom: 16, // 初始化地图级别
            center: [116.397428, 39.90923] // 初始化地图中心点位置

          })

          this.marker = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: [116.405467, 39.907761],
            anchor: 'bottom-center'
          })// 添加标记点

          this.circle = new window.AMap.Circle(
            { strokeColor: 'blue', strokeWeight: 1, strokeOpacity: 0.5,
              fillColor: '#009ffa', fillOpacity: 0.3,
              center: [116.405467, 39.907761],
              radius: 300
            }) // 创建圆

          this.label = new window.AMap.Text({
            text: `100米范围内打卡`,
            position: [116.405467, 39.907761],
            offset: new window.AMap.Pixel(0, 40), // 偏移量
            style: {
              color: 'red',
              fontSize: '20px'
            }
          })

          this.map.add(this.marker)
          this.map.add(this.circle)
          this.map.setFitView()
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
    doSearch(item) {
      this.activeId = item.id
      this.map.setCenter(item.point)
      this.circle.setCenter(item.point)
      this.marker.setPosition(item.point)
      this.AMap.add(this.label)
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
