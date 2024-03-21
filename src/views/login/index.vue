<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">

      <div class="loginWord"> <h1>{{ $t('login.login') }}</h1>
        <el-dropdown class="lang">
          <span class="el-dropdown-link">
            Language<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="switchToChinese('zh')">中文</el-dropdown-item>
            <el-dropdown-item @click.native="switchToChinese('en')">English</el-dropdown-item>
            <el-dropdown-item @click.native="switchToChinese('de')">Deutsch</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown></div>

      </el-dropdown>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!-- el-form > el-form-item > el-input -->
        <!-- 二维码登录 -->
        <!-- <div v-if="showQRLogin" ref="qrcode" /> -->
        <div v-if="showQRLogin" v-loading="isLoading" class="QRlayer">
          <img id="qrcode" :src="qrCodeDataURL" alt="QR Code">
          <div v-show="Timoutlayer" class="qrcode_layer Timeout">
            <div>
              <span>{{ $t('login.refresh') }}</span> <i class="el-icon-refresh-left" style="color:#f56c6c;" @click="refreshQR" /></div>
          </div>
          <div v-show="SuccessLogInlayer" class="qrcode_layer Timeout">
            <div>
              <span>{{ $t('login.qrcode') }}</span> <i class="el-icon-check" style="color:#76c84d;" /></div>
          </div>
          <div v-show="CancelLayer" class="qrcode_layer Timeout">
            <div>
              <span>{{ $t('login.cancelLogin') }} </span> <i class="el-icon-refresh-left" style="color:#f56c6c;" @click="refreshQR" /></div>
          </div>
        </div>

        <!-- 手机号登录 -->
        <el-form v-else ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" :placeholder="$t('login.cancelLinputMobileogin')" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password :placeholder="$t('login.inputPassword')" />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              {{ $t('login.userTerm') }}
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">{{ $t('login.login') }}</el-button>
          </el-form-item>
        </el-form>
        <div class="loginButton">
          <el-button @click="changeLoginWay1">{{ $t('login.mobileLogin') }}</el-button>
          <el-button @click="changeLoginWay2">{{ $t('login.qrcodeLogin') }}</el-button>
        </div>
      </el-card>
    </div>
  </div></template>
<script>
import { getQRCode, getQRCodeStatus } from '@/api/user'

// import { setToken } from '@/utils/auth'
import QRCode from 'qrcode'
import i18n from '@/lang'
export default {
  name: 'Login',
  data() {
    return {
      Timoutlayer: false,
      SuccessLogInlayer: false,
      CancelLayer: false,
      encryptionString: '',
      qrCodeDataURL: '',
      showQRLogin: false,
      isLoading: false,
      loginForm: {
        mobile: '13800000002',
        password: 'hm#qd@23!',
        isAgree: false
      },
      loginRules: {
        mobile: [{
          required: true,
          message: i18n.t('login.inputMobile'),
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: i18n.t('login.mobileFormat'),
          trigger: 'blur'

        }],
        password: [{
          required: true,
          message: i18n.t('login.inputPassword'),
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: i18n.t('login.passwordFormat'),
          trigger: 'blur'

        }],
        // required只能检查 null "" undefined
        isAgree: [{
          validator: (rule, value, callback) => {
            // rule规则
            // value检查的数据 true/false
            // callback 函数 执行这个函数
            // 成功执行callback 失败也执行callback(错误对象 new Error(错误信息))
            value ? callback() : callback(new Error(i18n.t('login.selectUserTerm')))
          }
        }]
      }
    }
  },
  computed: {
    locale() {
      // console.log(this.$store.state.locale)
      return this.$store.state.locale
    }
  },
  watch: {
    locale(newVal) {
      this.$i18n.locale = newVal
      console.log(this.$i18n.locale)
      // location.reload()
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          await this.$store.dispatch('user/login', this.loginForm)
          this.$router.push('/')
        }
      })
    },
    changeLoginWay1() {
      this.showQRLogin = false
    },
    async changeLoginWay2() {
      // this.Timoutlayer = true
      this.isLoading = true
      this.showQRLogin = true
      const encryptionString = await getQRCode()
      // console.log(encryptionString)
      this.encryptionString = encryptionString
      QRCode.toDataURL(encryptionString, (error, url) => {
        if (error) {
          console.error(error)
          return
        }
        this.qrCodeDataURL = url // 将生成的二维码DataURL保存到数据中
      })
      this.isLoading = false
      // 没有定时器的情况下才开启定时器
      if (this.timer) clearInterval(this.timer)
      // if (!this.timer) { this.timer = setInterval(this.getQRCodeStatusInfo, 2000) }
      this.timer = setInterval(this.getQRCodeStatusInfo, 2000)
    },
    async getQRCodeStatusInfo() {
      const response = await getQRCodeStatus(this.encryptionString)
      // console.log(response.codeState)
      if (response.codeState === 3) {
        // 需要存入token再跳转
        // console.log(response.token)
        // 需要存cookie到vuex里面，实时更新
        this.$store.commit('user/setToken', response.token)
        this.$router.push('/')
        clearInterval(this.timer)
      } else if (response.codeState === 4) {
        // this.$message.warning('二维码状态已经失效，请刷新')
        this.Timoutlayer = true
        clearInterval(this.timer)
      } else if (response.codeState === 2) {
        // 扫码成功但是没有点登录
        this.SuccessLogInlayer = true
      } else if (response.codeState === 5) {
        // 取消情况
        this.SuccessLogInlayer = false
        this.CancelLayer = true
        clearInterval(this.timer)
      }
    },
    refreshQR() {
      this.Timoutlayer = false
      this.SuccessLogInlayer = false
      this.CancelLayer = false
      this.changeLoginWay2()
    },
    switchToChinese(lang) {
      // console.log(lang)
      this.$store.dispatch('changeLocale', lang)
    }
  }
}
</script>
<style lang="scss">
.QRlayer {
  position: relative;
  // .tipLayer{
  //   position: absolute;
  //   top:50%;
  //   left:50%
  // }
  width: 303px;
}

.loginButton {
  width: 350px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    flex: 1;
  }
}

#qrcode {
  width: 300px;
  height: 300px;
}

.qrcode_layer {
  position: absolute;
  width: 150px;
  height: 150px;
  left: 50%;
  top: 50%;
  // -webkit-transform: translate(-75px,-75px);
  transform: translate(-50%, -50%);
  opacity: .9;
  background: #e1dede;
  font-size: 24px;
  padding: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png) no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;

    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center / contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }

    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }

  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;

    .el-card {
      border: none;
      padding: 0;
    }

    h1 {
      padding-left: 20px;
      font-size: 24px;
    }

    .el-input {
      width: 350px;
      height: 44px;

      .el-input__inner {
        background: #f4f5fb;
      }
    }

    .el-checkbox {
      color: #606266;
    }
  }
}
.loginWord{
  position: relative;
  .lang{
   position: absolute;
   right: 80px;
   top:20px
}
}

</style>
