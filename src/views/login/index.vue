<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!-- el-form > el-form-item > el-input -->
        <!-- 二维码登录 -->
        <!-- <div v-if="showQRLogin" ref="qrcode" /> -->
        <div v-if="showQRLogin">
          <img id="qrcode" :src="qrCodeDataURL" alt="QR Code">
          <div v-show="Timoutlayer" class="qrcode_layer Timeout">
            <div>
              <span>点击刷新 </span> <i class="el-icon-refresh-left" style="color:#f56c6c;" @click="changeLoginWay2" /></div>
          </div>
        </div>
        <!-- 手机号登录 -->
        <el-form v-else ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>

        <el-button @click="changeLoginWay1">手机号登录</el-button>
        <el-button @click="changeLoginWay2">扫码登陆</el-button>
      </el-card>
    </div>
  </div></template>
<script>
import { getQRCode, getQRCodeStatus } from '@/api/user'
// import { setToken } from '@/utils/auth'
import QRCode from 'qrcode'
export default {
  name: 'Login',
  data() {
    return {
      layer: false,
      encryptionString: '',
      qrCodeDataURL: '',
      showQRLogin: false,
      loginForm: {
        mobile: '13800000002',
        password: 'hm#qd@23!',
        isAgree: false
      },
      loginRules: {
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'

        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: '密码长度应该为6-16位之间',
          trigger: 'blur'

        }],
        // required只能检查 null "" undefined
        isAgree: [{
          validator: (rule, value, callback) => {
            // rule规则
            // value检查的数据 true/false
            // callback 函数 执行这个函数
            // 成功执行callback 失败也执行callback(错误对象 new Error(错误信息))
            value ? callback() : callback(new Error('没有勾选用户平台协议'))
          }
        }]
      }
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
      this.showQRLogin = true
      const encryptionString = await getQRCode()
      console.log(encryptionString)
      this.encryptionString = encryptionString
      QRCode.toDataURL(encryptionString, (error, url) => {
        if (error) {
          console.error(error)
          return
        }
        this.qrCodeDataURL = url // 将生成的二维码DataURL保存到数据中
      })
      // 没有定时器的情况下才开启定时器
      if (!this.timer) { this.timer = setInterval(this.getQRCodeStatusInfo, 2000) }
    },
    async getQRCodeStatusInfo() {
      const response = await getQRCodeStatus(this.encryptionString)
      console.log(response.codeState)
      if (response.codeState === 3) {
        // 需要存入token再跳转
        console.log(response.token)
        // setToken(response.token)
        // 需要存cookie到vuex里面，实时更新
        this.$store.commit('user/setToken', response.token)
        this.$router.push('/')
        clearInterval(this.timer)
      } else if (response.codeState === 4) {
        // this.$message.warning('二维码状态已经失效，请刷新')
        this.layer = true
      }
    }
  }
}
</script>
<style lang="scss">
#qrcode {
  width: 300px;
  height: 300px;
}
.qrcode_layer{
  position: absolute;
    width: 150px;
    height: 150px;
    left: 80%;
    top: 50%;
    -webkit-transform: translate(-75px,-75px);
    transform: translate(-75px,-75px);
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
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
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
      color:#606266;
    }
  }
}
</style>
