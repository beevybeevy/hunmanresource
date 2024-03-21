<template>
  <div class="cropper-content">
    <div class="cropper-box">
      <div class="cropper">
        <VueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.outputSize"
          :output-type="option.outputType"
          :info="option.info"
          :can-scale="option.canScale"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
          :full="option.full"
          :fixed-box="option.fixedBox"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :center-box="option.centerBox"
          :height="option.height"
          :info-true="option.infoTrue"
          :max-img-size="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="realTime"
          @imgLoad="imgLoad"
        />
      </div>
      <div class="show-preview">
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img">
        </div>
      </div>
    </div>
    <div class="handle-cropper">
      <div class="scope-btn">
        <label class="btn" for="uploads">{{ $t('avatar.selectAvatar') }}</label>
        <input
          id="uploads"
          type="file"
          style="position: absolute; clip: rect(0 0 0 0)"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="selectImg($event)"
        >
        <el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)">{{ $t('avatar.zoomIn') }}</el-button>
        <el-button size="mini" type="danger" plain icon="el-icon-zoom-out" @click="changeScale(-1)">{{ $t('avatar.zoomOut') }}</el-button>
        <el-button size="mini" type="danger" plain @click="rotateLeft">↺{{ $t('avatar.rotateLeft') }}</el-button>
        <el-button size="mini" type="danger" plain @click="rotateRight">↻ {{ $t('avatar.rotateRight') }}</el-button>
      </div>
      <div class="upload-btn">
        <el-button size="mini" type="success" @click="onConfirm">{{ $t('avatar.uploadAvatar') }} <i
          class="el-icon-upload"
        /></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { uploadImg } from '@/api/user'
import store from '@/store'
export default {
  name: 'CropperImage',
  components: {
    VueCropper
  },
  data() {
    return {
      img: '',
      avatar: '',
      previews: {},
      option: {
        img: this.initialImg, // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'png', // 裁剪生成图片的格式（jpeg || png || webp）
        info: true, // 图片大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // false按原比例裁切图片，不失真
        fixedBox: false, // 固定截图框大小，不允许改变
        canMove: false, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        height: true, // 是否按照设备的dpr 输出等比例图片
        infoTrue: false, // true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000, // 限制图片最大宽度和高度
        enlarge: 1 // 图片根据截图框输出比例倍数
      }
    }
  },
  created() {
    this.option.img = store.getters.avatar
  },
  methods: {
    // 初始化函数
    imgLoad(msg) {
      // console.log('工具初始化函数=====' + msg)
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    // 选择图片
    selectImg(e) {
      const file = e.target.files[0]
      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 5M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      // 转化为blob
      const reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.option.img = data
      }
      // 转化为base64
      reader.readAsDataURL(file)
      return isJPG && isLt2M
    },
    onConfirm() {
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData(async(data) => {
        this.img = data
        await uploadImg(this.img)
        this.$message.success('操作成功')
      })
      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob(data => {
        const url = URL.createObjectURL(data)
        this.avatar = url
        store.commit('user/setAvatar', this.avatar)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.cropper-content {
  display: flex;
  flex-direction: column;

  .cropper-box {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .cropper {
      width: 400px;
      height: 300px;
    }

    .show-preview {
      width: 250px;
      display: flex;
      justify-content: center;

      .preview {
        overflow: hidden;
        border: 1px solid #ccc;
        border-radius: 50%;
        background: #fff;
        box-sizing: border-box;
      }
    }
  }

  .handle-cropper {
    margin-top: 30px;
    display: flex;

    .scope-btn {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      padding-right: 10px;
    }

    .upload-btn {
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
    }

    .btn {
      outline: none;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      -webkit-transition: 0.1s;
      transition: 0.1s;
      font-weight: 500;
      padding: 8px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
      margin-right: 10px;
    }
  }
}
</style>
